import { NextResponse } from "next/server";
import { getOpenAIClient, getOpenAIModel, MissingOpenAIKeyError } from "@/lib/ai/openai";

export const runtime = "nodejs";

export async function GET() {
  const model = getOpenAIModel();

  try {
    const client = getOpenAIClient();
    await client.models.retrieve(model);

    return NextResponse.json({
      ok: true,
      configured: true,
      model
    });
  } catch (error) {
    const summary = summarizeError(error);

    return NextResponse.json(
      {
        ok: false,
        configured: !(error instanceof MissingOpenAIKeyError),
        model,
        errorName: summary.name,
        errorMessage: sanitizeMessage(summary.message)
      },
      { status: 200 }
    );
  }
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}

function sanitizeMessage(message: string) {
  return message.replace(/sk-[A-Za-z0-9_-]+/g, "sk-***");
}
