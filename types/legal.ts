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
  aiMode?: "real" | "mock";
  warning?: string;
  databaseWarning?: string;
}

export interface LegalResearchResult {
  query: string;
  legalArea: LegalArea;
  answer: string;
  sources: AuthoritativeLegalSource[];
  nextSteps: string[];
  aiMode?: "real" | "mock";
  warning?: string;
  databaseWarning?: string;
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
  aiMode?: "real" | "mock";
  warning?: string;
  databaseWarning?: string;
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

export type LitigationRole = "原告" | "被告" | "第三人";

export type LitigationCaseType =
  | "合同纠纷"
  | "民间借贷纠纷"
  | "劳动争议"
  | "房屋租赁纠纷"
  | "买卖合同纠纷"
  | "侵权责任纠纷"
  | "公司纠纷"
  | "其他民商事纠纷";

export type LitigationRequest = {
  role: LitigationRole;
  caseType: LitigationCaseType;
  facts: string;
  claimsOrDefense?: string;
  existingEvidence?: string;
  userQuestions: string;
  jurisdiction: "中国大陆";
};

export type LitigationAnalysisResult = {
  role: LitigationRole;
  caseType: string;
  jurisdiction: "中国大陆";
  caseSummary: string;
  keyIssues: {
    issue: string;
    explanation: string;
    importance: "high" | "medium" | "low";
  }[];
  claimsOrDefenseSuggestions: string[];
  legalBasis: {
    title: string;
    articleNumber?: string;
    sourceName: string;
    relevance: string;
  }[];
  evidenceAnalysis: {
    existingEvidenceSummary: string[];
    missingEvidence: {
      evidenceName: string;
      purpose: string;
      priority: "high" | "medium" | "low";
    }[];
    evidenceStrategy: string[];
  };
  opposingArgumentsAndResponses: {
    possibleOpposingArgument: string;
    responseStrategy: string;
    neededEvidence: string[];
  }[];
  draftDocuments: {
    complaint?: string;
    answer?: string;
    representationStatement?: string;
  };
  riskWarnings: string[];
  recommendedNextSteps: string[];
  disclaimer: string;
  isMockFallback?: boolean;
  fallbackReason?: string;
};
