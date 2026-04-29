"use client";

import { useMemo, useState } from "react";
import { FileText, Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { ErrorState } from "@/components/error-state";
import { ExportDocxButton } from "@/components/export-docx-button";
import { LegalSourceCard } from "@/components/legal-source-card";
import { LoadingState } from "@/components/loading-state";
import { PrivacyWarning } from "@/components/privacy-warning";
import { ResultSection } from "@/components/result-section";
import { RiskBadge } from "@/components/risk-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { readJsonResponse } from "@/lib/api/client";
import {
  aiFallbackMessage,
  getFriendlyErrorMessage,
  normalizeAiWarning,
  normalizeDatabaseWarning
} from "@/lib/legal/userMessages";
import type { ContractReviewResult } from "@/types/legal";

const sampleContract =
  "甲方向乙方采购软件开发服务，乙方应在30日内完成交付。甲方验收后支付全部费用。合同未明确逾期交付责任、知识产权归属、保密义务及争议解决方式。";

interface UploadedContractResponse {
  contractId: string;
  fileName: string;
  fileType: string;
  rawText: string;
  rawTextPreview: string;
  databaseWarning?: string;
}

export default function ContractReviewPage() {
  const [contractText, setContractText] = useState(sampleContract);
  const [reviewingParty, setReviewingParty] = useState("甲方");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedContract, setUploadedContract] = useState<UploadedContractResponse | null>(null);
  const [result, setResult] = useState<ContractReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const copyText = useMemo(() => {
    if (!result) return "";
    return `${result.title}\n总体风险：${result.overallRisk}\n${result.summary}\n\n关键条款：${result.keyClauses.join("、")}\n\n${result.keyIssues
      .map((issue) => `- ${issue.title}（${issue.riskLevel}）：${issue.suggestion}`)
      .join("\n")}`;
  }, [result]);

  async function generateReview() {
    if (!selectedFile && contractText.trim().length < 20) {
      setError("请先上传 TXT 文件，或输入至少 20 个字的合同内容。");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const contract = await uploadContract();
      const reviewResponse = await fetch("/api/contracts/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contract.contractId,
          fileName: contract.fileName,
          fileType: contract.fileType,
          rawText: contract.rawText,
          reviewingParty
        })
      });
      const reviewPayload = await readJsonResponse<ContractReviewResult & { error?: string }>(
        reviewResponse,
        "合同审查服务暂不可用，请稍后重试。"
      );

      if (!reviewResponse.ok) {
        throw new Error(getFriendlyErrorMessage(reviewPayload, "合同审查失败，请检查输入后重试。"));
      }

      setResult(reviewPayload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "合同审查失败，请检查输入后重试。");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function uploadContract() {
    const formData = new FormData();
    const file =
      selectedFile ??
      new File([contractText], "pasted-contract.txt", {
        type: "text/plain"
      });

    formData.append("file", file);
    const uploadResponse = await fetch("/api/contracts/upload", {
      method: "POST",
      body: formData
    });
    const uploadPayload = await readJsonResponse<UploadedContractResponse & { error?: string }>(
      uploadResponse,
      "合同上传服务暂不可用，请稍后重试。"
    );

    if (!uploadResponse.ok) {
      throw new Error(getFriendlyErrorMessage(uploadPayload, "合同上传失败，请确认文件格式和大小后重试。"));
    }

    setUploadedContract(uploadPayload);
    return uploadPayload as UploadedContractResponse;
  }

  function handleFileChange(file: File | null) {
    setSelectedFile(file);
    setUploadedContract(null);
    setResult(null);
  }

  return (
    <AppShell
      title="合同审查"
      description="上传 TXT / DOCX / PDF 合同或粘贴合同内容，生成风险摘要、修改建议和中国大陆法依据。"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>合同内容</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PrivacyWarning />
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted text-center text-sm text-muted-foreground transition hover:border-primary/60">
                <Upload className="mb-2 h-5 w-5" aria-hidden="true" />
                <span>上传合同文件，支持 TXT / DOCX / PDF，最大 10MB</span>
                <input
                  type="file"
                  accept=".txt,.docx,.pdf,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                />
              </label>
              {selectedFile && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>{selectedFile.name}</span>
                  <span>·</span>
                  <span>{Math.ceil(selectedFile.size / 1024)} KB</span>
                </div>
              )}
              <label className="block text-sm font-medium">
                审查视角
                <Input
                  className="mt-2"
                  value={reviewingParty}
                  onChange={(event) => setReviewingParty(event.target.value)}
                  placeholder="例如：甲方、乙方、出租方、采购方"
                />
              </label>
              <Textarea
                value={contractText}
                onChange={(event) => setContractText(event.target.value)}
                rows={10}
                placeholder="也可以直接粘贴合同条款，系统会作为 TXT 草稿提交分析"
              />
              <Button onClick={generateReview} disabled={isLoading}>
                生成合同审查报告
              </Button>
            </CardContent>
          </Card>
          {error && <ErrorState message={error} />}
          {isLoading && <LoadingState label="正在上传并审查合同条款" />}
          {uploadedContract && (
            <Card>
              <CardHeader>
                <CardTitle>上传结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm leading-6 text-muted-foreground">
                <p>合同 ID：{uploadedContract.contractId}</p>
                <p>文件名：{uploadedContract.fileName}</p>
                <p>文件类型：{uploadedContract.fileType}</p>
                <p>文本预览：{uploadedContract.rawTextPreview}</p>
                {uploadedContract.databaseWarning && <p>{uploadedContract.databaseWarning}</p>}
              </CardContent>
            </Card>
          )}
          {result && (
            <ResultSection
              title="审查结论"
              action={
                <div className="flex flex-wrap justify-end gap-2">
                  <ExportDocxButton
                    endpoint="/api/export/contract-review"
                    payload={result}
                    fileName="合同审查报告.docx"
                  />
                  <CopyButton text={copyText} />
                </div>
              }
            >
              <div className="space-y-5">
                {result.warning?.includes("OPENAI_API_KEY") && (
                  <p className="rounded-md border border-[#d7c08d] bg-[#fff8e6] p-3 text-sm text-[#5c4618]">
                    {aiFallbackMessage}
                  </p>
                )}
                {result.aiMode === "mock" && (
                  <p className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
                    当前为系统 fallback 示例结果，非真实 AI 分析。
                  </p>
                )}
                {normalizeAiWarning(result.warning) && !result.warning?.includes("OPENAI_API_KEY") && (
                  <p className="rounded-md border border-[#d7c08d] bg-[#fff8e6] p-3 text-sm text-[#5c4618]">
                    {normalizeAiWarning(result.warning)}
                  </p>
                )}
                {result.databaseWarning && (
                  <p className="rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
                    {normalizeDatabaseWarning(result.databaseWarning)}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <RiskBadge level={result.overallRisk} />
                  <span className="text-sm text-muted-foreground">领域：{result.legalArea}</span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{result.summary}</p>
                <div>
                  <h3 className="text-sm font-semibold">关键条款</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.keyClauses.map((clause) => (
                      <span key={clause} className="rounded-full bg-muted px-3 py-1 text-xs">
                        {clause}
                      </span>
                    ))}
                  </div>
                </div>
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
          {result ? (
            result.sources.map((source) => <LegalSourceCard key={source.id} source={source} />)
          ) : (
            <p className="rounded-md border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
              上传并审查合同后，API 会返回匹配的大陆法权威依据。
            </p>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
