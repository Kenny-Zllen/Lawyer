import type { AuthoritativeLegalSource } from "@/types/legal";

export function formatSourceContext(sources: AuthoritativeLegalSource[]) {
  if (!sources.length) {
    return "无可用权威资料。";
  }

  return sources
    .map(
      (source) => `来源ID：${source.id}
标题：${source.title}
效力层级：${source.authority}
发布机关：${source.issuingBody}
生效日期：${source.effectiveDate}
法域：${source.jurisdiction}
领域：${source.legalArea}
摘要：${source.summary}
相关条文：${source.relevantArticles.join("、")}`
    )
    .join("\n\n---\n\n");
}
