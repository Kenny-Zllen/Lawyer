"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { ErrorState } from "@/components/error-state";
import { ExportDocxButton } from "@/components/export-docx-button";
import { LoadingState } from "@/components/loading-state";
import { ResultSection } from "@/components/result-section";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  aiFallbackMessage,
  getFriendlyErrorMessage,
  litigationPrivacyNotice,
  normalizeDatabaseWarning
} from "@/lib/legal/userMessages";
import type {
  LitigationAnalysisResult,
  LitigationCaseType,
  LitigationRequest,
  LitigationRole
} from "@/types/legal";
import { cn } from "@/lib/utils";

const roles: LitigationRole[] = ["原告", "被告", "第三人"];
const caseTypes: LitigationCaseType[] = [
  "合同纠纷",
  "民间借贷纠纷",
  "劳动争议",
  "房屋租赁纠纷",
  "买卖合同纠纷",
  "侵权责任纠纷",
  "公司纠纷",
  "其他民商事纠纷"
];

const priorityLabels = {
  high: "高",
  medium: "中",
  low: "低"
};

const priorityClass = {
  high: "border-[#d2786d] bg-[#fff0ed] text-[#90251c]",
  medium: "border-[#d7b15f] bg-[#fff7df] text-[#735315]",
  low: "border-[#7ca982] bg-[#edf7ef] text-[#255f31]"
};

export default function LitigationAssistantPage() {
  const [request, setRequest] = useState<LitigationRequest>({
    role: "原告",
    caseType: "合同纠纷",
    facts: "甲乙双方签订服务合同，乙方逾期交付且交付成果未通过验收。甲方多次催告后乙方仍未完成整改，甲方拟提起诉讼主张违约责任。",
    claimsOrDefense: "请求乙方支付违约金、赔偿延期造成的损失，并承担本案诉讼费用。",
    existingEvidence: "服务合同\n付款记录\n微信聊天记录\n催告函\n验收邮件",
    userQuestions: "帮助原告拟写起诉状和代理词，并提示还需要补充哪些关键证据。",
    jurisdiction: "中国大陆"
  });
  const [result, setResult] = useState<LitigationAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const copyAll = useMemo(() => {
    if (!result) return "";
    return [
      result.caseSummary,
      ...Object.values(result.draftDocuments).filter(Boolean),
      ...result.recommendedNextSteps
    ].join("\n\n");
  }, [result]);

  function updateRequest<K extends keyof LitigationRequest>(key: K, value: LitigationRequest[K]) {
    setRequest((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    if (!request.facts.trim() || !request.userQuestions.trim()) {
      setError("请至少填写案情陈述和希望 AI 解决的问题。");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/litigation-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getFriendlyErrorMessage(payload, "案件分析失败，请补充案情和问题后重试。"));
      }

      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "案件分析失败，请补充案情和问题后重试。");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell
      title="案件分析与诉讼文书助手"
      description="输入案情、诉讼立场、现有证据与待解决问题，生成初步诉讼策略、诉讼文书草稿、证据补充建议和对方抗辩预判。"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>案件信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium">
                  诉讼角色
                  <select
                    value={request.role}
                    onChange={(event) => updateRequest("role", event.target.value as LitigationRole)}
                    className="mt-2 h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/15"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  案件类型
                  <select
                    value={request.caseType}
                    onChange={(event) => updateRequest("caseType", event.target.value as LitigationCaseType)}
                    className="mt-2 h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/15"
                  >
                    {caseTypes.map((caseType) => (
                      <option key={caseType} value={caseType}>
                        {caseType}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm font-medium">
                案情陈述
                <Textarea
                  className="mt-2"
                  rows={6}
                  value={request.facts}
                  onChange={(event) => updateRequest("facts", event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                已有诉讼请求或抗辩观点
                <Textarea
                  className="mt-2"
                  rows={4}
                  value={request.claimsOrDefense}
                  onChange={(event) => updateRequest("claimsOrDefense", event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                已有证据材料
                <Textarea
                  className="mt-2"
                  rows={5}
                  value={request.existingEvidence}
                  onChange={(event) => updateRequest("existingEvidence", event.target.value)}
                  placeholder="合同、转账记录、微信聊天记录、发票、交付记录、催告函、对账单、验收单"
                />
              </label>
              <label className="block text-sm font-medium">
                希望 AI 解决的问题
                <Textarea
                  className="mt-2"
                  rows={4}
                  value={request.userQuestions}
                  onChange={(event) => updateRequest("userQuestions", event.target.value)}
                />
              </label>
              <div className="rounded-md border border-[#d7c08d] bg-[#fff8e6] p-3 text-sm leading-6 text-[#5c4618]">
                {litigationPrivacyNotice}
              </div>
              <Button onClick={submit} disabled={isLoading}>
                生成案件分析与诉讼文书草稿
              </Button>
            </CardContent>
          </Card>

          {error && <ErrorState message={error} />}
          {isLoading && <LoadingState label="正在生成案件分析与诉讼文书草稿" />}
          {result && (
            <LitigationResult result={result} copyAll={copyAll} />
          )}
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>诉讼模块提示</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>本工具仅提供 AI 生成的法律信息、诉讼分析和文书草稿支持，不构成正式法律意见。请在依赖任何输出前咨询合资格律师。</p>
              <p>仅支持中国大陆民商事案件初步分析，不处理刑事辩护、行政诉讼、港澳台或境外法律。</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function LitigationResult({
  result,
  copyAll
}: {
  result: LitigationAnalysisResult;
  copyAll: string;
}) {
  return (
    <div className="space-y-5">
      <ResultSection
        title="案件分析结果"
        action={
          <div className="flex flex-wrap justify-end gap-2">
            <ExportDocxButton
              endpoint="/api/export/litigation-analysis"
              payload={result}
              fileName="案件分析与诉讼文书报告.docx"
            />
            <CopyButton text={copyAll} />
          </div>
        }
      >
        <div className="space-y-4 text-sm leading-6">
          {result.isMockFallback && (
            <div className="rounded-md border border-[#d7c08d] bg-[#fff8e6] p-3 text-[#5c4618]">
              {result.fallbackReason ?? aiFallbackMessage}
            </div>
          )}
          {"databaseWarning" in result && typeof result.databaseWarning === "string" && (
            <div className="rounded-md border border-border bg-card p-3 text-muted-foreground">
              {normalizeDatabaseWarning(result.databaseWarning)}
            </div>
          )}
          <p className="rounded-md border border-border bg-muted p-3">{result.disclaimer}</p>
          <div>
            <h3 className="font-semibold">案情摘要</h3>
            <p className="mt-2 text-muted-foreground">{result.caseSummary}</p>
          </div>
        </div>
      </ResultSection>

      <ResultSection title="争议焦点">
        <div className="grid gap-3 md:grid-cols-2">
          {result.keyIssues.map((issue) => (
            <div key={issue.issue} className="rounded-md border border-border/80 bg-white/60 p-4 text-sm shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{issue.issue}</h3>
                <PriorityBadge value={issue.importance} />
              </div>
              <p className="mt-2 leading-6 text-muted-foreground">{issue.explanation}</p>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection title="诉讼请求建议 / 抗辩思路">
        <BulletList items={result.claimsOrDefenseSuggestions} />
      </ResultSection>

      <ResultSection title="法律依据">
        <div className="space-y-3">
          {result.legalBasis.map((basis) => (
            <div key={`${basis.sourceName}-${basis.title}-${basis.articleNumber ?? ""}`} className="rounded-md border border-border/80 bg-white/60 p-4 text-sm shadow-sm">
              <h3 className="font-semibold">{basis.title}</h3>
              <p className="mt-1 text-muted-foreground">{basis.sourceName}{basis.articleNumber ? ` · ${basis.articleNumber}` : ""}</p>
              <p className="mt-2 leading-6">{basis.relevance}</p>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection title="证据分析">
        <div className="space-y-4 text-sm leading-6">
          <div>
            <h3 className="font-semibold">已有证据摘要</h3>
            <BulletList items={result.evidenceAnalysis.existingEvidenceSummary} />
          </div>
          <div>
            <h3 className="font-semibold">缺失证据</h3>
            <div className="mt-3 overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="bg-muted text-foreground">
                  <tr>
                    <th className="border-b border-border px-3 py-2 font-semibold">证据名称</th>
                    <th className="border-b border-border px-3 py-2 font-semibold">证明目的</th>
                    <th className="border-b border-border px-3 py-2 font-semibold">优先级</th>
                  </tr>
                </thead>
                <tbody>
                  {result.evidenceAnalysis.missingEvidence.map((evidence) => (
                    <tr key={evidence.evidenceName} className="border-b border-border last:border-0">
                      <td className="px-3 py-3 font-medium">{evidence.evidenceName}</td>
                      <td className="px-3 py-3 text-muted-foreground">{evidence.purpose}</td>
                      <td className="px-3 py-3"><PriorityBadge value={evidence.priority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">证据策略</h3>
            <BulletList items={result.evidenceAnalysis.evidenceStrategy} />
          </div>
        </div>
      </ResultSection>

      <ResultSection title="对方抗辩预判与应对">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm leading-6">
            <thead className="bg-muted text-foreground">
              <tr>
                <th className="border-b border-border px-3 py-2 font-semibold">对方可能观点</th>
                <th className="border-b border-border px-3 py-2 font-semibold">我方应对策略</th>
                <th className="border-b border-border px-3 py-2 font-semibold">所需证据</th>
              </tr>
            </thead>
            <tbody>
              {result.opposingArgumentsAndResponses.map((item) => (
                <tr key={item.possibleOpposingArgument} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 align-top">{item.possibleOpposingArgument}</td>
                  <td className="px-3 py-3 align-top text-muted-foreground">{item.responseStrategy}</td>
                  <td className="px-3 py-3 align-top text-muted-foreground">{item.neededEvidence.join("、")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultSection>

      <ResultSection title="文书草稿">
        <div className="space-y-4">
          <DocumentBlock title="起诉状" text={result.draftDocuments.complaint} />
          <DocumentBlock title="答辩状" text={result.draftDocuments.answer} />
          <DocumentBlock title="代理词" text={result.draftDocuments.representationStatement} />
        </div>
      </ResultSection>

      <ResultSection title="风险提示和下一步建议">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">风险提示</h3>
            <div className="mt-3 rounded-md border border-[#d2786d] bg-[#fff0ed] p-3 text-[#90251c]">
              <BulletList items={result.riskWarnings} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">下一步建议</h3>
            <BulletList items={result.recommendedNextSteps} />
          </div>
        </div>
      </ResultSection>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
      {items.map((item) => (
        <li key={item}>• {item}</li>
      ))}
    </ul>
  );
}

function PriorityBadge({ value }: { value: "high" | "medium" | "low" }) {
  return (
    <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-xs", priorityClass[value])}>
      {priorityLabels[value]}
    </span>
  );
}

function DocumentBlock({ title, text }: { title: string; text?: string }) {
  if (!text) return null;

  return (
    <div className="rounded-md border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-border p-3">
        <h3 className="font-semibold">{title}</h3>
        <CopyButton text={text} />
      </div>
      <pre className="whitespace-pre-wrap bg-white/60 p-4 text-sm leading-7">{text}</pre>
    </div>
  );
}
