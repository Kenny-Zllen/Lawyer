import type { AuthoritativeLegalSource, LegalArea } from "@/types/legal";
import { classifyLegalArea } from "./classifyLegalArea";
import { mainlandChinaLegalSources } from "./mainlandChinaLegalSources";

export function retrieveAuthoritativeLegalSources(
  query: string,
  limit = 4
): AuthoritativeLegalSource[] {
  const legalArea = classifyLegalArea(query);
  const normalized = query.toLowerCase();

  return mainlandChinaLegalSources
    .map((source) => ({
      source,
      score: scoreSource(source, normalized, legalArea)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.source);
}

function scoreSource(
  source: AuthoritativeLegalSource,
  normalizedQuery: string,
  legalArea: LegalArea
) {
  const keywordScore = source.keywords.reduce(
    (score, keyword) => score + (normalizedQuery.includes(keyword.toLowerCase()) ? 3 : 0),
    0
  );
  const titleScore = normalizedQuery
    .split(/\s+|，|。|、|；|;|,|\./)
    .filter(Boolean)
    .some((term) => source.title.toLowerCase().includes(term))
    ? 2
    : 0;
  const areaScore = source.legalArea === legalArea ? 2 : 0;

  return keywordScore + titleScore + areaScore;
}
