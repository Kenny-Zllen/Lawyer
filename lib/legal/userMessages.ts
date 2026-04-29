export const betaLegalDisclaimer =
  "本工具仅提供 AI 生成的法律信息、合同审查、诉讼分析和文书草稿支持，不构成正式法律意见。请在依赖任何输出前咨询合资格律师。";

export const litigationPrivacyNotice =
  "请勿上传涉密、敏感个人信息或受律师保密特权保护的完整材料。本工具不会替代律师对证据原件、诉讼时效、管辖和程序风险的专业判断。";

export const aiFallbackMessage =
  "AI 服务暂不可用，系统已返回 fallback 示例结果。请检查 OPENAI_API_KEY、OPENAI_MODEL 或账户额度。";

export const insufficientSourcesMessage =
  "当前内置规则库未检索到足够相关依据，请补充问题背景或由律师核验正式法律文本。";

export const databaseUnavailableMessage =
  "当前结果未写入数据库，但不影响本次分析展示。";

export const exportFailedMessage =
  "导出失败，请稍后重试或复制文本手动保存。";

export function getFriendlyErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "object" && payload && "error" in payload) {
    const error = payload.error;
    if (typeof error === "string" && error.trim()) {
      return error;
    }
  }

  return fallback;
}

export function normalizeDatabaseWarning(warning?: string) {
  return warning ? databaseUnavailableMessage : "";
}

export function normalizeAiWarning(warning?: string) {
  if (!warning) return "";

  if (
    warning.includes("OPENAI_API_KEY") ||
    warning.includes("AI") ||
    warning.includes("大模型")
  ) {
    return aiFallbackMessage;
  }

  if (warning.includes("权威资料不足") || warning.includes("资料不足")) {
    return insufficientSourcesMessage;
  }

  return warning;
}
