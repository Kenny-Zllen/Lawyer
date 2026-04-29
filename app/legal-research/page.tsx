"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { ErrorState } from "@/components/error-state";
import { ExportDocxButton } from "@/components/export-docx-button";
import { LegalSourceCard } from "@/components/legal-source-card";
import { LoadingState } from "@/components/loading-state";
import { ResultSection } from "@/components/result-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  aiFallbackMessage,
  getFriendlyErrorMessage,
  normalizeAiWarning,
  normalizeDatabaseWarning
} from "@/lib/legal/userMessages";
import type { LegalArea, LegalResearchResult } from "@/types/legal";

const legalAreas: LegalArea[] = ["合同", "劳动", "公司", "争议解决", "其他"];

export default function LegalResearchPage() {
  const [query, setQuery] = useState("服务合同中未约定逾期交付违约金，甲方如何降低争议风险？");
  const [legalArea, setLegalArea] = useState<LegalArea>("合同");
  const [result, setResult] = useState<LegalResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const copyText = useMemo(() => {
    if (!result) return "";
    return `${result.query}\n领域：${result.legalArea}\n\n${result.answer}\n\n下一步：\n${result.nextSteps.join("\n")}`;
  }, [result]);

  async function research() {
    if (query.trim().length < 8) {
      setError("请输入更完整的大陆民商事法律问题。");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/legal-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query, legalArea })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getFriendlyErrorMessage(payload, "法律检索失败，请补充问题背景后重试。"));
      }

      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "法律检索失败，请补充问题背景后重试。");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell
      title="中国大陆法律检索辅助"
      description="通过 API 检索本地权威来源，形成初步分析、依据列表和下一步建议。"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>检索问题</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block text-sm font-medium">
                法律领域
                <select
                  value={legalArea}
                  onChange={(event) => setLegalArea(event.target.value as LegalArea)}
                  className="mt-2 h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  {legalAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>
              <Textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                rows={7}
                placeholder="请输入要检索的中国大陆法律问题"
              />
              <Button onClick={research} disabled={isLoading}>
                检索内置规则库并生成分析
              </Button>
            </CardContent>
          </Card>
          {error && <ErrorState message={error} />}
          {isLoading && <LoadingState label="正在调用法律检索 API" />}
          {result && (
            <ResultSection
              title="初步分析"
              action={
                <div className="flex flex-wrap justify-end gap-2">
                  <ExportDocxButton
                    endpoint="/api/export/legal-research"
                    payload={result}
                    fileName="法律检索报告.docx"
                  />
                  <CopyButton text={copyText} />
                </div>
              }
            >
              <div className="space-y-4 text-sm leading-6">
                {result.warning?.includes("OPENAI_API_KEY") && (
                  <p className="rounded-md border border-[#d7c08d] bg-[#fff8e6] p-3 text-[#5c4618]">
                    {aiFallbackMessage}
                  </p>
                )}
                {result.warning && !result.warning.includes("OPENAI_API_KEY") && (
                  <p className="rounded-md border border-[#d7c08d] bg-[#fff8e6] p-3 text-[#5c4618]">
                    {normalizeAiWarning(result.warning)}
                  </p>
                )}
                {result.aiMode === "mock" && (
                  <p className="rounded-md border border-border bg-muted p-3 text-muted-foreground">
                    当前为系统 fallback 示例结果，非真实 AI 分析。
                  </p>
                )}
                {result.databaseWarning && (
                  <p className="rounded-md border border-border bg-card p-3 text-muted-foreground">
                    {normalizeDatabaseWarning(result.databaseWarning)}
                  </p>
                )}
                <p className="text-muted-foreground">识别领域：{result.legalArea}</p>
                <p>{result.answer}</p>
                <div>
                  <h3 className="font-semibold">建议下一步</h3>
                  <ul className="mt-2 space-y-2 text-muted-foreground">
                    {result.nextSteps.map((step) => (
                      <li key={step}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </ResultSection>
          )}
        </section>
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold">命中的权威来源</h2>
          {result ? (
            result.sources.map((source) => <LegalSourceCard key={source.id} source={source} />)
          ) : (
            <p className="rounded-md border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
              提交检索问题后，API 会返回命中的大陆法权威来源。
              当前法律来源为内置规则摘要库，非完整法律数据库。
            </p>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
