import type { AuthoritativeLegalSource, LegalArea } from "@/types/legal";
import { classifyLegalArea } from "../classifyLegalArea";
import { loadLegalSources } from "../loadLegalSources";

export type RetrieveLegalSourcesOptions = {
  maxResults?: number;
  minScore?: number;
  sourceTypes?: string[];
  legalAreas?: string[];
  reliabilityLevels?: string[];
};

export function keywordRetriever(
  query: string,
  legalArea?: string,
  options: RetrieveLegalSourcesOptions = {}
): AuthoritativeLegalSource[] {
  const maxResults = options.maxResults ?? 6;
  const minScore = options.minScore ?? 1;
  const inferredArea = legalArea ?? classifyLegalArea(query);
  const normalized = normalize(query);
  const terms = tokenize(normalized);

  const results = loadLegalSources()
    .filter((source) => matchesFilters(source, options))
    .map((source) => ({
      source,
      score: scoreSource(source, normalized, terms, inferredArea)
    }))
    .filter((entry) => entry.score >= minScore)
    .sort((a, b) => b.score - a.score || reliabilityRank(b.source) - reliabilityRank(a.source))
    .slice(0, maxResults)
    .map((entry) => entry.source);

  if (results.length) {
    return results;
  }

  return loadLegalSources()
    .filter((source) => matchesFilters(source, options))
    .filter((source) => source.reliabilityLevel === "official")
    .slice(0, Math.min(maxResults, 3));
}

function matchesFilters(source: AuthoritativeLegalSource, options: RetrieveLegalSourcesOptions) {
  if (options.sourceTypes?.length && !options.sourceTypes.includes(source.sourceType)) {
    return false;
  }

  if (
    options.legalAreas?.length &&
    !source.legalArea.some((area) => options.legalAreas?.includes(area))
  ) {
    return false;
  }

  if (
    options.reliabilityLevels?.length &&
    !options.reliabilityLevels.includes(source.reliabilityLevel)
  ) {
    return false;
  }

  return true;
}

function scoreSource(
  source: AuthoritativeLegalSource,
  normalizedQuery: string,
  terms: string[],
  legalArea: string
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

  return keywordScore + titleScore + sourceNameScore + contentScore + areaScore + scenarioScore + reliabilityRank(source);
}

function reliabilityRank(source: AuthoritativeLegalSource) {
  if (source.reliabilityLevel === "official") return 3;
  if (source.reliabilityLevel === "high") return 2;
  return 1;
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

export type { LegalArea };
