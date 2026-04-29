import OpenAI from "openai";

export class MissingOpenAIKeyError extends Error {
  constructor() {
    super("当前未配置 OPENAI_API_KEY，无法调用真实大模型。");
    this.name = "MissingOpenAIKeyError";
  }
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new MissingOpenAIKeyError();
  }

  return new OpenAI({ apiKey });
}
