import type { AuthoritativeLegalSource } from "@/types/legal";

export function formatSourceContext(sources: AuthoritativeLegalSource[]) {
  if (!sources.length) {
    return "无可用权威资料。";
  }

  return sources
    .map(
      (source) => `来源ID：${source.id}
标题：${source.title}
来源类型：${source.sourceType}
发布机关：${source.issuingAuthority}
来源名称：${source.sourceName}
生效日期：${source.effectiveDate ?? "未标注"}
条文或规则：${source.articleNumber ?? "规则摘要"}
可靠性：${source.reliabilityLevel}
法域：${source.jurisdiction}
领域：${source.legalArea.join("、")}
场景标签：${source.scenarioTags.join("、")}
内容：${source.content}`
    )
    .join("\n\n---\n\n");
}
