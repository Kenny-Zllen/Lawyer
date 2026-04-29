"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { ErrorState } from "@/components/error-state";
import { LegalSourceCard } from "@/components/legal-source-card";
import { LoadingState } from "@/components/loading-state";
import { PrivacyWarning } from "@/components/privacy-warning";
import { ResultSection } from "@/components/result-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { documentTemplates, getDocumentTemplate } from "@/lib/legal/documentTemplates";
import type { DraftingRequest, DraftingResult } from "@/types/legal";

export default function LegalDraftingPage() {
  const [request, setRequest] = useState<DraftingRequest>({
    templateId: "nda",
    parties: "甲方：某科技有限公司；乙方：某咨询顾问",
    scenario: "双方拟就企业数字化项目开展商务洽谈，需保护技术方案、报价和客户资料。",
    keyTerms: "保密期限三年；违约责任按实际损失赔偿；争议提交甲方所在地人民法院。"
  });
  const [result, setResult] = useState<DraftingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedTemplate = getDocumentTemplate(request.templateId);
  const copyText = useMemo(() => result?.draftText ?? "", [result]);

  function updateRequest<K extends keyof DraftingRequest>(key: K, value: DraftingRequest[K]) {
    setRequest((current) => ({ ...current, [key]: value }));
  }

  async function draft() {
    if (!request.parties.trim() || !request.scenario.trim() || !request.keyTerms.trim()) {
      setError("请补充主体信息、使用场景和关键条款。");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/legal-drafting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "文书生成失败，请稍后重试。");
      }

      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "文书生成失败，请稍后重试。");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell
      title="法律文书生成"
      description="基于本地模板，通过 mock API 生成可复制的大陆民商事文书草稿。"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>文书信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PrivacyWarning />
              <label className="block text-sm font-medium">
                模板类型
                <select
                  value={request.templateId}
                  onChange={(event) => {
                    updateRequest("templateId", event.target.value);
                    setResult(null);
                  }}
                  className="mt-2 h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  {documentTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                主体信息
                <Input
                  className="mt-2"
                  value={request.parties}
                  onChange={(event) => updateRequest("parties", event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                使用场景
                <Textarea
                  className="mt-2"
                  rows={5}
                  value={request.scenario}
                  onChange={(event) => updateRequest("scenario", event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                关键条款
                <Textarea
                  className="mt-2"
                  rows={4}
                  value={request.keyTerms}
                  onChange={(event) => updateRequest("keyTerms", event.target.value)}
                />
              </label>
              <Button onClick={draft} disabled={isLoading}>
                通过 API 生成 mock 文书草稿
              </Button>
            </CardContent>
          </Card>
          {error && <ErrorState message={error} />}
          {isLoading && <LoadingState label="正在调用文书生成 API" />}
          {result && (
            <ResultSection title={result.title} action={<CopyButton text={copyText} />}>
              <div className="space-y-4">
                <pre className="whitespace-pre-wrap rounded-md border border-border bg-muted p-4 text-sm leading-7">
                  {result.draftText}
                </pre>
                <div className="text-sm leading-6">
                  <h3 className="font-semibold">交付前检查</h3>
                  <ul className="mt-2 space-y-2 text-muted-foreground">
                    {result.checklist.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </ResultSection>
          )}
        </section>
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{selectedTemplate.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>{selectedTemplate.description}</p>
              <p>章节：{selectedTemplate.sections.join("、")}</p>
            </CardContent>
          </Card>
          <h2 className="text-lg font-semibold">相关权威依据</h2>
          {result ? (
            result.sources.map((source) => <LegalSourceCard key={source.id} source={source} />)
          ) : (
            <p className="rounded-md border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
              生成文书后，API 会返回与模板和场景匹配的大陆法权威依据。
            </p>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
