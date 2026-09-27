/* Checks every outbound link this site can show, and reports the dead ones.
 *
 *   npm run check:links
 *
 * Two sources, because checking only one would miss most of them:
 *
 *   1. src/ — links hardcoded in components and content files.
 *   2. Supabase `projects` — the web / android / ios columns. These are the
 *      proof links on every case study, they are edited through the admin
 *      dashboard rather than in a commit, and a grep over the repo will never
 *      see them. This is where the five dead WOD Pro League and Outstride
 *      links lived.
 *
 * Run on demand, not in the build: a flaky network or a rate-limiting store
 * would fail a deploy that has nothing wrong with it, and the check takes far
 * longer than the build.
 *
 * Exit code is always 0. This reports; it does not gate anything.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");

const TIMEOUT_MS = 15000;
const CONCURRENCY = 4;
// Apple and Google throttle bursts hard, and a 429 looks exactly like a dead
// link if you are not careful. Pace requests rather than hammer.
const GAP_MS = 900;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/* Hosts that answer automation with a block rather than the page. A non-2xx
   from these says nothing about whether the link works in a browser. */
const BOT_HOSTILE = [/(^|\.)fiverr\.com$/, /(^|\.)linkedin\.com$/];

/* Supabase stores absent links as the four-character string "null" rather than
   SQL NULL. The app guards for it (projectClient.tsx), so it renders nothing —
   but it is not a URL and must not be fetched. */
const isRealUrl = (v) =>
  typeof v === "string" && v !== "null" && v !== '""' && /^https?:\/\//.test(v);

const loadEnv = async () => {
  try {
    const text = await readFile(join(ROOT, ".env"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env — the Supabase pass is skipped and reported below */
  }
};

const walk = async (dir) => {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if ([".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(extname(e.name))) out.push(p);
  }
  return out;
};

/** url -> human-readable list of places it appears */
const collectFromSource = async () => {
  const found = new Map();
  for (const file of await walk(SRC)) {
    const text = await readFile(file, "utf8");
    for (const m of text.matchAll(/https?:\/\/[^\s"'`)\\<>]+/g)) {
      const url = m[0].replace(/[.,;:]+$/, "");
      let host;
      try {
        host = new URL(url).hostname;
      } catch {
        continue;
      }
      // Namespaces, schemas and CDNs — not links a visitor clicks.
      if (/^(www\.)?w3\.org$/.test(host) || host === "schema.org") continue;
      if (host.endsWith("supabase.co") || host.endsWith("googleapis.com")) continue;
      if (host === "localhost" || host.endsWith("vercel-dns-017.com")) continue;
      // Admin-form placeholder hints (placeholder="https://play.google.com/…")
      // are UI copy, not links. They end in an ellipsis and always 404.
      if (/[…]$/.test(url) || /placeholder=["'`][^"'`]*$/.test(text.slice(0, m.index).split("\n").pop())) continue;
      if (!found.has(url)) found.set(url, new Set());
      found.get(url).add(file.slice(ROOT.length + 1));
    }
  }
  return found;
};

const collectFromSupabase = async (found) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("ℹ Supabase env not set — skipping the project link columns.\n");
    return 0;
  }

  const res = await fetch(
    `${url}/rest/v1/projects?select=id,title,web,android,ios&order=id.asc`,
    { headers: { apikey: key, authorization: `Bearer ${key}` } }
  );
  if (!res.ok) {
    console.log(`ℹ Supabase returned ${res.status} — skipping the project link columns.\n`);
    return 0;
  }

  let n = 0;
  for (const row of await res.json()) {
    for (const field of ["web", "android", "ios"]) {
      if (!isRealUrl(row[field])) continue;
      n++;
      const where = `projects/${row.id} (${row.title}) · ${field}`;
      if (!found.has(row[field])) found.set(row[field], new Set());
      found.get(row[field]).add(where);
    }
  }
  return n;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const check = async (url) => {
  const attempt = async (method) => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: ctl.signal,
        headers: { "user-agent": UA, accept: "*/*" },
      });
      return { status: res.status };
    } finally {
      clearTimeout(t);
    }
  };
  try {
    // Some hosts reject HEAD but serve GET, so a HEAD failure is not final.
    let r = await attempt("HEAD");
    if (r.status >= 400) r = await attempt("GET");
    return r;
  } catch (err) {
    return { status: 0, error: err.name === "AbortError" ? "timeout" : err.message };
  }
};

const run = async (urls) => {
  const it = urls[Symbol.iterator]();
  const results = [];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (const url of it) {
        results.push([url, await check(url)]);
        await sleep(GAP_MS);
      }
    })
  );
  return results;
};

await loadEnv();

const found = await collectFromSource();
const fromSrc = found.size;
const fromDb = await collectFromSupabase(found);

console.log(`checking ${found.size} links — ${fromSrc} from src/, ${fromDb} from Supabase projects…\n`);

const results = await run([...found.keys()]);
results.sort((a, b) => a[0].localeCompare(b[0]));

const dead = [];
const blocked = [];
for (const [url, r] of results) {
  if (r.status >= 200 && r.status < 400) continue;
  const host = new URL(url).hostname;
  (BOT_HOSTILE.some((re) => re.test(host)) ? blocked : dead).push([url, r]);
}

const label = (r) => (r.status === 0 ? `ERR ${r.error}` : r.status);

if (dead.length) {
  console.log(`✗ ${dead.length} link${dead.length > 1 ? "s" : ""} not responding:\n`);
  for (const [url, r] of dead) {
    console.log(`  ${String(label(r)).padEnd(14)} ${url}`);
    for (const w of found.get(url)) console.log(`  ${"".padEnd(14)}   ${w}`);
  }
  console.log(
    "\n  A link stored in Supabase is cleared from the admin dashboard or with a\n" +
      "  PATCH to the projects row — not in a commit. Check the page copy too:\n" +
      "  case-study prose often says a build is live and inspectable.\n"
  );
} else {
  console.log("✓ every link responded\n");
}

if (blocked.length) {
  console.log("ℹ blocked to bots — check by hand, probably fine:\n");
  for (const [url, r] of blocked) console.log(`  ${String(label(r)).padEnd(14)} ${url}`);
  console.log("");
}

const insecure = results.filter(([u]) => u.startsWith("http://"));
if (insecure.length) {
  console.log("⚠ served over http:// — try the https:// form:\n");
  for (const [u] of insecure) console.log(`  ${u}`);
  console.log("");
}
