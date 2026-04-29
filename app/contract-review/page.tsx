"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { ErrorState } from "@/components/error-state";
import { LegalSourceCard } from "@/components/legal-source-card";
import { LoadingState } from "@/components/loading-state";
import { PrivacyWarning } from "@/components/privacy-warning";
import { ResultSection } from "@/components/result-section";
import { RiskBadge } from "@/components/risk-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { classifyLegalArea } from "@/lib/legal/classifyLegalArea";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import type { ContractReviewResult, RiskLevel } from "@/types/legal";

const sampleContract =
  "甲方向乙方采购软件开发服务，乙方应在30日内完成交付。甲方验收后支付全部费用。合同未明确逾期交付责任、知识产权归属、保密义务及争议解决方式。";

export default function ContractReviewPage() {
  const [contractText, setContractText] = useState(sampleContract);
  const [result, setResult] = useState<ContractReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const copyText = useMemo(() => {
    if (!result) return "";
    return `${result.title}\n总体风险：${result.overallRisk}\n${result.summary}\n\n${result.keyIssues
      .map((issue) => `- ${issue.title}（${issue.riskLevel}）：${issue.suggestion}`)
      .join("\n")}`;
  }, [result]);

  function generateReview() {
    if (contractText.trim().length < 20) {
      setError("请先输入至少 20 个字的合同内容或核心条款。");
      setResult(null);
      return;
    }
    setError("");
    setIsLoading(true);
    window.setTimeout(() => {
      setResult(buildMockReview(contractText));
      setIsLoading(false);
    }, 450);
  }

  return (
    <AppShell
      title="合同审查"
      description="粘贴合同内容，基于 mock 规则生成风险摘要、修改建议和大陆法权威依据。"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>合同内容</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PrivacyWarning />
              <label className="flex min-h-28 cursor-not-allowed flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted text-center text-sm text-muted-foreground">
                <Upload className="mb-2 h-5 w-5" aria-hidden="true" />
                文件上传占位区：第一阶段不解析真实文件
              </label>
              <Textarea
                value={contractText}
                onChange={(event) => setContractText(event.target.value)}
                rows={10}
                placeholder="请粘贴合同条款、审查背景或重点问题"
              />
              <Button onClick={generateReview}>生成 mock 审查结果</Button>
            </CardContent>
          </Card>
          {error && <ErrorState message={error} />}
          {isLoading && <LoadingState label="正在审查合同条款" />}
          {result && (
            <ResultSection title="审查结论" action={<CopyButton text={copyText} />}>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <RiskBadge level={result.overallRisk} />
                  <span className="text-sm text-muted-foreground">领域：{result.legalArea}</span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{result.summary}</p>
                <div className="space-y-3">
                  {result.keyIssues.map((issue) => (
                    <div key={issue.title} className="rounded-md border border-border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <RiskBadge level={issue.riskLevel} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{issue.explanation}</p>
                      <p className="mt-2 text-sm leading-6">
                        <span className="font-medium">建议：</span>
                        {issue.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ResultSection>
          )}
        </section>
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold">相关权威依据</h2>
          {(result?.sources ?? retrieveAuthoritativeLegalSources(contractText)).map((source) => (
            <LegalSourceCard key={source.id} source={source} />
          ))}
        </aside>
      </div>
    </AppShell>
  );
}

function buildMockReview(text: string): ContractReviewResult {
  const legalArea = classifyLegalArea(text);
  const highSignals = ["违约责任", "保密", "知识产权", "争议解决", "解除"].filter(
    (term) => !text.includes(term)
  );
  const overallRisk: RiskLevel = highSignals.length >= 3 ? "高" : highSignals.length >= 1 ? "中" : "低";

  return {
    id: "mock-contract-review",
    title: "合同审查 mock 结果",
    legalArea,
    overallRisk,
    summary: "该合同已具备基本交易安排，但部分关键风险分配条款仍需细化，尤其是履约标准、付款节点、违约责任和争议解决机制。",
    keyIssues: [
      {
        title: "交付与验收标准不够具体",
        riskLevel: text.includes("验收") ? "中" : "高",
        explanation: "仅约定交付期限或付款触发条件，容易导致交付成果是否合格产生争议。",
        suggestion: "补充交付物清单、验收流程、整改期限和视为验收的边界条件。"
      },
      {
        title: "违约责任可执行性不足",
        riskLevel: text.includes("违约") ? "中" : "高",
        explanation: "如未明确逾期交付、逾期付款、保密违约等后果，后续主张损失会更依赖举证。",
        suggestion: "设置违约金、损失赔偿、解除权和持续履行义务，并保持金额与交易规模相匹配。"
      },
      {
        title: "保密与知识产权安排需明确",
        riskLevel: text.includes("保密") && text.includes("知识产权") ? "低" : "中",
        explanation: "服务合同常涉及资料、成果、源代码、文档或商业信息，应明确归属和使用范围。",
        suggestion: "补充保密信息定义、例外、保密期限、成果权属、授权范围和返还销毁义务。"
      }
    ],
    suggestedClauses: ["交付验收条款", "违约责任条款", "保密与知识产权条款"],
    sources: retrieveAuthoritativeLegalSources(text)
  };
}
