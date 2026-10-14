/**
 * JSON-LD for one page, as a single @graph.
 *
 * Pages used to emit three to six separate <script> blocks, each with its own
 * @context. That is valid, but one graph whose nodes reference each other by
 * @id reads as one connected description (this WebPage, on this WebSite, about
 * this Service, from this Organization) rather than a pile of fragments.
 *
 * `<` is written as <. JSON.stringify leaves it alone, so any string that
 * contains "</script>" (a project description edited in the admin dashboard,
 * for example) would close the tag early and spill the rest of the JSON into
 * the page as visible text. The escape is invisible to a JSON parser.
 *
 * A server component: the markup is in the HTML every crawler receives,
 * including the AI crawlers that never run JavaScript.
 */
type Node = Record<string, unknown>;

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function JsonLd({ graph }: { graph: Array<Node | null | undefined | false> }) {
  const nodes = graph
    .filter((n): n is Node => Boolean(n))
    // The graph carries the one @context; a node copied from older code with its
    // own would repeat it.
    .map((n) => {
      const node = { ...n };
      delete node['@context'];
      return node;
    });
  if (!nodes.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd({ '@context': 'https://schema.org', '@graph': nodes }),
      }}
    />
  );
}
