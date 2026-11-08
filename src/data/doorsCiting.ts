/**
 * The door pages that cite a project as proof, so the project's page can link
 * back to them.
 *
 * Each door page's `proof` lists the project pages it rests on. A reader who
 * lands on one of those project pages from a search had no way to reach the
 * service it supports: the links ran from the door to the project only. This
 * reads the same `proof` arrays, so a project gains or loses the link when a
 * door starts or stops citing it, with nothing else to keep in step.
 *
 * Server code only, like data/siteNav.ts: it reads data/solutions.ts, which
 * must not reach the browser bundle. The project page renders the links on the
 * server.
 */
import { SOLUTIONS, isOffer, type OfferSolution } from './solutions';

/** The door pages whose proof cites this project, in the order SOLUTIONS lists them. */
export function doorsCiting(projectId: number | string): OfferSolution[] {
  const id = Number(projectId);
  return SOLUTIONS.filter(isOffer).filter((door) =>
    door.proof.some((p) => p.type === 'project' && p.project_id === id)
  );
}
