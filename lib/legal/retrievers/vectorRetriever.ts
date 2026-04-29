import type { AuthoritativeLegalSource } from "@/types/legal";
import type { RetrieveLegalSourcesOptions } from "./keywordRetriever";

export function vectorRetriever(
  _query: string,
  _legalArea?: string,
  _options: RetrieveLegalSourcesOptions = {}
): AuthoritativeLegalSource[] {
  void _query;
  void _legalArea;
  void _options;
  // TODO: Connect pgvector / embeddings and return semantically similar legal sources.
  return [];
}
