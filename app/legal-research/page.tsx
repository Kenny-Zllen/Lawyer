"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { ErrorState } from "@/components/error-state";
import { LegalSourceCard } from "@/components/legal-source-card";
import { LoadingState } from "@/components/loading-state";
import { ResultSection } from "@/components/result-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { classifyLegalArea } from "@/lib/legal/classifyLegalArea";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import type { LegalResearchResult } from "@/types/legal";

export default function LegalResearchPage() {
  const [query, setQuery] = useState("服务合同中未约定逾期交付违约金，甲方如何降低争议风险？");
  const [result, setResult] = useState<LegalResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const copyText = useMemo(() => {
    if (!result) return "";
    return `${result.query}\n领域：${result.legalArea}\n\n${result.answer}\n\n下一步：\n${result.nextSteps.join("\n")}`;
  }, [result]);

  function research() {
    if (query.trim().length < 8) {
      setError("请输入更完整的大陆民商事法律问题。");
      setResult(null);
      return;
    }
    setError("");
    setIsLoading(true);
    window.setTimeout(() => {
      const legalArea = classifyLegalArea(query);
      const sources = retrieveAuthoritativeLegalSources(query, 5);
      setResult({
        query,
        legalArea,
        sources,
        answer:
          "初步检索显示，该问题应先回到合同约定、履行证据和民法典合同编规则进行分析。若合同缺少明确违约金，可结合实际损失、交易习惯、补充协议和解除条件设计风险缓释路径。",
        nextSteps: [
          "核对合同是否已有交付标准、验收流程、通知与补救期限。",
          "整理逾期事实、沟通记录、损失凭证和对方承诺。",
          "优先尝试补充协议或书面催告，必要时评估诉讼或仲裁条款。"
        ]
      });
      setIsLoading(false);
    }, 420);
  }

  return (
    <AppShell
      title="中国大陆法律检索辅助"
      description="围绕大陆法律问题检索本地 mock 权威来源，形成初步分析、依据列表和下一步建议。"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>检索问题</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                rows={7}
                placeholder="请输入要检索的中国大陆法律问题"
              />
              <Button onClick={research}>检索 mock 权威来源</Button>
            </CardContent>
          </Card>
          {error && <ErrorState message={error} />}
          {isLoading && <LoadingState label="正在检索权威来源" />}
          {result && (
            <ResultSection title="初步分析" action={<CopyButton text={copyText} />}>
              <div className="space-y-4 text-sm leading-6">
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
          <h2 className="text-lg font-semibold">命中的 mock 权威来源</h2>
          {(result?.sources ?? retrieveAuthoritativeLegalSources(query, 5)).map((source) => (
            <LegalSourceCard key={source.id} source={source} />
          ))}
        </aside>
      </div>
    </AppShell>
  );
}
