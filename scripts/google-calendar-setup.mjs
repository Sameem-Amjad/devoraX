/* One-time Google Calendar setup.
 *
 *   npm run setup:google
 *
 * Opens Google's consent screen, catches the redirect on localhost, exchanges
 * the code, and prints the refresh token for you to paste into .env.
 *
 * Nothing is sent anywhere but Google. The script writes no secrets to disk
 * and prints the token once, to your terminal.
 *
 * ── Before running, in console.cloud.google.com ───────────────────────
 *
 * 1. Create a project (or reuse one).
 *
 * 2. APIs & Services → Library → enable "Google Calendar API".
 *
 * 3. APIs & Services → OAuth consent screen
 *      User type: External
 *      Fill in app name, your email for both support and developer contact.
 *      Scopes: you can leave the list empty here; this script requests what
 *      it needs. Add yourself under "Test users".
 *
 *    ⚠ Leave it in "Testing" and Google expires your refresh token after
 *      SEVEN DAYS — bookings then silently stop reaching your calendar. Click
 *      "PUBLISH APP" to make the token permanent. Since the app requests only
 *      calendar scopes for your own account and has no other users, the
 *      "unverified app" warning is the only consequence, and only you ever
 *      see it — on this one consent screen.
 *
 * 4. APIs & Services → Credentials → Create credentials → OAuth client ID
 *      Application type: Web application
 *      Authorised redirect URI: http://localhost:53682/callback
 *      (must match REDIRECT_URI below exactly)
 *
 * 5. Put the client ID and secret in .env:
 *      GOOGLE_CLIENT_ID=...
 *      GOOGLE_CLIENT_SECRET=...
 *
 * 6. Run this script and follow the link it prints.
 */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
/* Two scopes, both needed:
     calendar.events   — create the booking event and invite the guest
     calendar.readonly — query freeBusy, so the site will not offer a slot
                         you are already busy in. freeBusy is NOT covered
                         by calendar.events; with only that scope Google
                         answers 403 and availability silently ignores
                         everything already on your calendar. */
const SCOPE = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
].join(" ");

/* Minimal .env reader — the repo has no dotenv dependency and this script
   runs outside Next, which would otherwise load it. */
const loadEnv = async () => {
  try {
    const text = await readFile(new URL("../.env", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* no .env yet — the check below reports it properly */
  }
};

await loadEnv();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "\n✗ GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be in .env first.\n" +
      "  See the setup steps at the top of this file.\n"
  );
  process.exit(1);
}

// Guards against a stray redirect from another tab landing on this server.
const state = crypto.randomUUID();

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    // offline + consent is what actually returns a refresh token. Without
    // prompt=consent Google omits it on every authorisation after the first,
    // which is the usual reason this flow appears to "work" but yields nothing.
    access_type: "offline",
    prompt: "consent",
    state,
  });

const page = (title, detail) =>
  `<!doctype html><meta charset="utf-8"><title>${title}</title>` +
  `<body style="font:16px system-ui;background:#0a0a0a;color:#eee;display:grid;place-items:center;height:100vh;margin:0">` +
  `<div style="text-align:center;max-width:32rem;padding:2rem">` +
  `<h1 style="color:#2dd4bf;font-size:1.25rem">${title}</h1><p style="color:#999">${detail}</p></div>`;

const code = await new Promise((resolve, reject) => {
  const server = createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname !== "/callback") {
      res.writeHead(404).end();
      return;
    }

    const err = url.searchParams.get("error");
    const got = url.searchParams.get("code");

    if (err || url.searchParams.get("state") !== state || !got) {
      res.writeHead(400, { "content-type": "text/html" });
      res.end(page("Authorisation failed", err ?? "State mismatch or missing code."));
      server.close();
      reject(new Error(err ?? "authorisation failed"));
      return;
    }

    res.writeHead(200, { "content-type": "text/html" });
    res.end(page("Authorised ✓", "You can close this tab and return to your terminal."));
    server.close();
    resolve(got);
  });

  server.listen(PORT, () => {
    console.log("\n  Opening Google's consent screen…");
    console.log("  If it doesn't open, paste this into a browser:\n");
    console.log(`  ${authUrl}\n`);
    // `open` is macOS; harmless elsewhere since the URL is printed anyway.
    spawn("open", [authUrl], { stdio: "ignore" }).on("error", () => {});
  });

  setTimeout(() => {
    server.close();
    reject(new Error("timed out after 5 minutes"));
  }, 300_000).unref();
});

const res = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }),
});

const token = await res.json();

if (!res.ok || !token.refresh_token) {
  console.error("\n✗ Token exchange failed:", JSON.stringify(token, null, 2));
  if (res.ok && !token.refresh_token) {
    console.error(
      "\n  Google returned an access token but no refresh token. That happens\n" +
        "  when this app was already authorised. Revoke it at\n" +
        "  https://myaccount.google.com/permissions and run this again.\n"
    );
  }
  process.exit(1);
}

// Confirm the token works, and show which calendar it will write to.
let calendarName = "(could not read)";
try {
  const check = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary",
    { headers: { authorization: `Bearer ${token.access_token}` } }
  );
  if (check.ok) {
    const cal = await check.json();
    calendarName = `${cal.summary} (${cal.timeZone})`;
  }
} catch {
  /* non-fatal — the refresh token is still valid */
}

console.log(`
  ✓ Authorised. Calendar: ${calendarName}

  Add this line to .env — it is the only new secret:

    GOOGLE_REFRESH_TOKEN=${token.refresh_token}

  Optional, if you want a calendar other than your default:

    GOOGLE_CALENDAR_ID=you@example.com

  Then restart \`npm run dev\`. Book a test call and the invite should
  arrive in both inboxes.

  ⚠ If the OAuth consent screen is still in "Testing", publish it now —
    otherwise this token stops working in seven days.
`);
