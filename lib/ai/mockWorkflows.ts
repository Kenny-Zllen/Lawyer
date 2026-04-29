import type {
  ContractReviewResult,
  DraftingRequest,
  DraftingResult,
  LegalArea,
  LegalResearchResult,
  RiskLevel
} from "@/types/legal";
import { classifyLegalArea } from "@/lib/legal/classifyLegalArea";
import { getDocumentTemplate } from "@/lib/legal/documentTemplates";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import {
  ContractReviewResultSchema,
  DraftingResultSchema,
  LegalResearchResultSchema
} from "./schemas";

export function buildMockContractReviewResult(
  contractId: string,
  rawText: string
): ContractReviewResult {
  const legalArea = classifyLegalArea(rawText);
  const missingTerms = ["违约责任", "保密", "知识产权", "争议解决", "解除"].filter(
    (term) => !rawText.includes(term)
  );
  const overallRisk: RiskLevel =
    missingTerms.length >= 3 ? "高" : missingTerms.length >= 1 ? "中" : "低";
  const keyClauses = detectKeyClauses(rawText);

  const result: ContractReviewResult = {
    id: `review-${contractId}`,
    title: "合同审查 mock 结果",
    legalArea,
    overallRisk,
    summary:
      "该合同已具备基本交易安排，但仍需结合交易背景细化履约标准、付款节点、风险分配和争议解决机制。当前结论由 mock workflow 基于上传文本和本地权威来源生成。",
    keyClauses,
    keyIssues: [
      {
        title: "交付与验收标准不够具体",
        riskLevel: rawText.includes("验收") ? "中" : "高",
        explanation: "如果仅约定交付期限或付款触发条件，后续容易围绕交付成果是否合格产生争议。",
        suggestion: "补充交付物清单、验收流程、整改期限、视为验收条件以及拒收后的处理路径。"
      },
      {
        title: "违约责任可执行性不足",
        riskLevel: rawText.includes("违约") ? "中" : "高",
        explanation: "未明确逾期交付、逾期付款、保密违约等后果时，主张损失会更依赖后续举证。",
        suggestion: "设置违约金、损失赔偿、解除权和持续履行义务，并保持金额与交易规模相匹配。"
      },
      {
        title: "保密与知识产权安排需明确",
        riskLevel: rawText.includes("保密") && rawText.includes("知识产权") ? "低" : "中",
        explanation: "服务、咨询、软件开发等合同通常涉及资料、成果、源代码、文档或商业信息。",
        suggestion: "补充保密信息定义、例外、保密期限、成果权属、授权范围和返还销毁义务。"
      }
    ],
    suggestedClauses: [
      "交付验收条款",
      "付款节点与发票条款",
      "违约责任条款",
      "保密与知识产权条款",
      "适用法律与争议解决条款"
    ],
    sources: retrieveAuthoritativeLegalSources(rawText, 5),
    aiMode: "mock",
    warning: "当前未配置 OPENAI_API_KEY，返回 mock 示例结果。"
  };

  return ContractReviewResultSchema.parse(result);
}

export function buildMockLegalResearchResult(
  question: string,
  legalArea?: LegalArea
): LegalResearchResult {
  const area = legalArea ?? classifyLegalArea(question);
  const sources = retrieveAuthoritativeLegalSources(`${area} ${question}`, 5);

  const result: LegalResearchResult = {
    query: question,
    legalArea: area,
    sources,
    answer:
      sources.length < 2
        ? "当前权威资料不足，无法基于现有资料给出可靠结论。"
        : "基于当前 mock 权威来源，建议先核对合同约定、履行证据与民法典合同编规则。若缺少明确约定，可围绕补充协议、书面催告、损失证明和争议解决条款制定风险控制方案。",
    nextSteps:
      sources.length < 2
        ? ["补充更具体的事实、合同类型、争议阶段和关键词后重新检索。"]
        : [
            "核对合同是否已有交付标准、验收流程、通知与补救期限。",
            "整理履行事实、沟通记录、损失凭证和对方承诺。",
            "结合管辖或仲裁条款评估催告、谈判、诉讼或仲裁路径。"
          ],
    aiMode: "mock",
    warning: "当前未配置 OPENAI_API_KEY，返回 mock 示例结果。"
  };

  return LegalResearchResultSchema.parse(result);
}

export function buildMockDraftingResult(request: DraftingRequest): DraftingResult {
  const template = getDocumentTemplate(request.templateId);
  const sources = retrieveAuthoritativeLegalSources(
    `${template.name} ${request.scenario} ${request.keyTerms}`,
    5
  );

  const result: DraftingResult = {
    title: `${template.name} mock 草稿`,
    legalArea: template.legalArea,
    draftText: buildDraftText(request),
    checklist: [
      "核对主体名称、统一社会信用代码和签署权限。",
      "根据真实交易补充金额、期限、交付物和附件。",
      "检查适用法律、管辖或仲裁条款是否与交易安排匹配。",
      "由合资格律师结合事实和最新法规进行最终审阅。"
    ],
    sources,
    aiMode: "mock",
    warning: "当前未配置 OPENAI_API_KEY，返回 mock 示例结果。"
  };

  return DraftingResultSchema.parse(result);
}

function detectKeyClauses(rawText: string) {
  const candidates = ["合同主体", "服务范围", "交付验收", "付款安排", "违约责任", "保密义务", "知识产权", "解除终止", "争议解决"];
  const detected = candidates.filter((clause) => rawText.includes(clause.replace("安排", "")) || rawText.includes(clause));
  return detected.length ? detected : ["合同主体", "履行义务", "违约责任", "争议解决"];
}

function buildDraftText(request: DraftingRequest) {
  const template = getDocumentTemplate(request.templateId);
  return `${template.name}

一、主体信息
${request.parties}

二、背景与目的
${request.scenario}

三、核心约定
${request.keyTerms}

四、主要条款
${template.sections
  .map(
    (section, index) =>
      `${index + 1}. ${section}：双方应结合交易事实进一步细化本条款的权利义务、履行标准和违约后果。`
  )
  .join("\n")}

五、适用法律与争议解决
本草稿仅面向中华人民共和国大陆法域。双方可约定由有管辖权的人民法院或仲裁机构解决争议，具体安排应与交易结构及可执行性相匹配。

六、提示
本草稿由 mock workflow 生成，不构成正式法律意见，签署或发送前应由合资格律师审阅。`;
}
