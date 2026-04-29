export type LegalArea = "合同" | "劳动" | "公司" | "争议解决" | "其他";

export type RiskLevel = "低" | "中" | "高";

export interface AuthoritativeLegalSource {
  id: string;
  title: string;
  authority: "法律" | "行政法规" | "司法解释" | "部门规章" | "指导性案例" | "司法文件";
  issuingBody: string;
  effectiveDate: string;
  legalArea: LegalArea;
  jurisdiction: "中华人民共和国大陆";
  url?: string;
  keywords: string[];
  summary: string;
  relevantArticles: string[];
}

export interface ContractReviewResult {
  id: string;
  title: string;
  legalArea: LegalArea;
  overallRisk: RiskLevel;
  summary: string;
  keyClauses: string[];
  keyIssues: Array<{
    title: string;
    riskLevel: RiskLevel;
    explanation: string;
    suggestion: string;
  }>;
  suggestedClauses: string[];
  sources: AuthoritativeLegalSource[];
}

export interface LegalResearchResult {
  query: string;
  legalArea: LegalArea;
  answer: string;
  sources: AuthoritativeLegalSource[];
  nextSteps: string[];
}

export interface DraftingRequest {
  templateId: string;
  parties: string;
  scenario: string;
  keyTerms: string;
}

export interface DraftingResult {
  title: string;
  legalArea: LegalArea;
  draftText: string;
  checklist: string[];
  sources: AuthoritativeLegalSource[];
}

export interface UploadedContract {
  contractId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  rawTextPreview: string;
  createdAt: string;
}
