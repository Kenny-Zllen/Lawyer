import type { AuthoritativeLegalSource, LegalArea } from "@/types/legal";
import { classifyLegalArea } from "./classifyLegalArea";
import { mainlandChinaLegalSources } from "./mainlandChinaLegalSources";

export function retrieveAuthoritativeLegalSources(
  query: string,
  limit = 4
): AuthoritativeLegalSource[] {
  const legalArea = classifyLegalArea(query);
  const normalized = normalize(query);
  const terms = tokenize(normalized);

  return mainlandChinaLegalSources
    .map((source) => ({
      source,
      score: scoreSource(source, normalized, terms, legalArea)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.source);
}

function scoreSource(
  source: AuthoritativeLegalSource,
  normalizedQuery: string,
  terms: string[],
  legalArea: LegalArea
) {
  const keywordScore = source.keywords.reduce(
    (score, keyword) => score + (normalizedQuery.includes(normalize(keyword)) ? 5 : 0),
    0
  );
  const titleScore = terms.some((term) => normalize(source.title).includes(term)) ? 3 : 0;
  const sourceNameScore = terms.some((term) => normalize(source.sourceName).includes(term)) ? 2 : 0;
  const contentScore = terms.reduce(
    (score, term) => score + (normalize(source.content).includes(term) ? 1 : 0),
    0
  );
  const areaScore = source.legalArea.some((area) => area === legalArea) ? 4 : 0;
  const scenarioScore = source.scenarioTags.reduce(
    (score, tag) => score + (normalizedQuery.includes(normalize(tag)) ? 4 : 0),
    0
  );
  const reliabilityScore =
    source.reliabilityLevel === "official" ? 2 : source.reliabilityLevel === "high" ? 1 : 0;

  return keywordScore + titleScore + sourceNameScore + contentScore + areaScore + scenarioScore + reliabilityScore;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, "");
}

function tokenize(normalizedQuery: string) {
  return normalizedQuery
    .split(/，|。|、|；|;|,|\.|\?|？|!|！|：|:/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
}
