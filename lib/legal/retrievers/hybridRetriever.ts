import type { AuthoritativeLegalSource } from "@/types/legal";
import { keywordRetriever, type RetrieveLegalSourcesOptions } from "./keywordRetriever";
import { vectorRetriever } from "./vectorRetriever";

export function hybridRetriever(
  query: string,
  legalArea?: string,
  options: RetrieveLegalSourcesOptions = {}
): AuthoritativeLegalSource[] {
  const keywordResults = keywordRetriever(query, legalArea, options);
  const vectorResults = vectorRetriever(query, legalArea, options);
  const seen = new Set<string>();
  const merged: AuthoritativeLegalSource[] = [];

  for (const source of [...keywordResults, ...vectorResults]) {
    if (!seen.has(source.id)) {
      seen.add(source.id);
      merged.push(source);
    }
  }

  return merged.slice(0, options.maxResults ?? 6);
}
