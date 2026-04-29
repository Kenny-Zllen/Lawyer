import { z } from "zod";
import { getOpenAIClient, getOpenAIModel } from "./openai";

export class AIJsonGenerationError extends Error {
  constructor(message = "大模型未返回可校验的 JSON 结果，请稍后重试。") {
    super(message);
    this.name = "AIJsonGenerationError";
  }
}

export async function generateJson<T>({
  systemPrompt,
  userPrompt,
  schema
}: {
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodType<T>;
}): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: getOpenAIModel(),
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content:
              attempt === 0
                ? userPrompt
                : `${userPrompt}\n\n上一次输出不是合法 JSON 或未通过 schema 校验。请只返回合法 JSON，并严格匹配 schema。`
          }
        ]
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new AIJsonGenerationError("大模型未返回内容。");
      }

      return schema.parse(parseJsonContent(content));
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError instanceof AIJsonGenerationError) {
    throw lastError;
  }

  throw new AIJsonGenerationError();
}

function parseJsonContent(content: string) {
  const trimmed = content.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(withoutFence);
  } catch {
    const firstBrace = withoutFence.indexOf("{");
    const lastBrace = withoutFence.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
    }
    throw new AIJsonGenerationError("大模型返回内容不是合法 JSON。");
  }
}
