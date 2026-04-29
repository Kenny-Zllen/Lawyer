import type { AuthoritativeLegalSource } from "@/types/legal";

export function formatSourceContext(
  sources: AuthoritativeLegalSource[],
  options: { maxChars?: number; maxResults?: number } = {}
) {
  if (!sources.length) {
    return "无可用权威资料。";
  }

  const maxChars = options.maxChars ?? 6000;
  const maxResults = options.maxResults ?? 6;
  const context = sources
    .slice(0, maxResults)
    .map(
      (source) => `来源ID：${source.id}
标题：${source.title}
条文或规则：${source.articleNumber ?? "规则摘要"}
来源类型：${source.sourceType}
发布机关：${source.issuingAuthority}
来源名称：${source.sourceName}
可靠性：${source.reliabilityLevel}
内容：${source.content}
场景标签：${source.scenarioTags.join("、")}`
    )
    .join("\n\n---\n\n");

  return context.length > maxChars ? `${context.slice(0, maxChars)}\n\n[Source context truncated]` : context;
}
