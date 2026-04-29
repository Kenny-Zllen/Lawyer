import type { AuthoritativeLegalSource } from "@/types/legal";
import { hybridRetriever } from "./retrievers/hybridRetriever";
import type { RetrieveLegalSourcesOptions } from "./retrievers/keywordRetriever";

export type { RetrieveLegalSourcesOptions };

export function retrieveAuthoritativeLegalSources(
  query: string,
  legalAreaOrLimit?: string | number,
  options: RetrieveLegalSourcesOptions = {}
): AuthoritativeLegalSource[] {
  if (typeof legalAreaOrLimit === "number") {
    return hybridRetriever(query, undefined, {
      ...options,
      maxResults: legalAreaOrLimit
    });
  }

  return hybridRetriever(query, legalAreaOrLimit, {
    maxResults: 6,
    ...options
  });
}
