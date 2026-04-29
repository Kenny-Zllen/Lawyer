import { z } from "zod";

export const LegalAreaSchema = z.enum(["合同", "劳动", "公司", "争议解决", "其他"]);
export const RiskLevelSchema = z.enum(["低", "中", "高"]);
export const LitigationRoleSchema = z.enum(["原告", "被告", "第三人"]);
export const LitigationCaseTypeSchema = z.enum([
  "合同纠纷",
  "民间借贷纠纷",
  "劳动争议",
  "房屋租赁纠纷",
  "买卖合同纠纷",
  "侵权责任纠纷",
  "公司纠纷",
  "其他民商事纠纷"
]);
export const ImportanceSchema = z.enum(["high", "medium", "low"]);

export const AuthoritativeLegalSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  sourceType: z.enum([
    "law",
    "judicial_interpretation",
    "evidence_rule",
    "procedural_rule",
    "guiding_case",
    "court_case",
    "government_guidance",
    "other"
  ]),
  issuingAuthority: z.string(),
  sourceName: z.string(),
  url: z.string().optional(),
  effectiveDate: z.string().optional(),
  articleNumber: z.string().optional(),
  content: z.string(),
  jurisdiction: z.literal("中国大陆"),
  reliabilityLevel: z.enum(["official", "high", "medium"]),
  legalArea: z.array(z.string()),
  keywords: z.array(z.string()),
  scenarioTags: z.array(z.string())
});

export const ContractReviewResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  legalArea: LegalAreaSchema,
  overallRisk: RiskLevelSchema,
  summary: z.string(),
  keyClauses: z.array(z.string()),
  keyIssues: z.array(
    z.object({
      title: z.string(),
      riskLevel: RiskLevelSchema,
      explanation: z.string(),
      suggestion: z.string()
    })
  ),
  suggestedClauses: z.array(z.string()),
  sources: z.array(AuthoritativeLegalSourceSchema),
  aiMode: z.enum(["real", "mock"]).optional(),
  warning: z.string().optional(),
  databaseWarning: z.string().optional()
});

export const ContractReviewAIResultSchema = ContractReviewResultSchema.omit({
  id: true,
  sources: true,
  aiMode: true,
  warning: true,
  databaseWarning: true
}).extend({
  id: z.string().optional()
});

export const LegalResearchResultSchema = z.object({
  query: z.string(),
  legalArea: LegalAreaSchema,
  answer: z.string(),
  sources: z.array(AuthoritativeLegalSourceSchema),
  nextSteps: z.array(z.string()),
  aiMode: z.enum(["real", "mock"]).optional(),
  warning: z.string().optional(),
  databaseWarning: z.string().optional()
});

export const LegalResearchAIResultSchema = z.object({
  answer: z.string(),
  nextSteps: z.array(z.string()).default([]),
  warning: z.string().optional()
});

export const DraftingResultSchema = z.object({
  title: z.string(),
  legalArea: LegalAreaSchema,
  draftText: z.string(),
  checklist: z.array(z.string()),
  sources: z.array(AuthoritativeLegalSourceSchema),
  aiMode: z.enum(["real", "mock"]).optional(),
  warning: z.string().optional(),
  databaseWarning: z.string().optional()
});

export const DraftingAIResultSchema = DraftingResultSchema.omit({
  sources: true,
  aiMode: true,
  warning: true,
  databaseWarning: true
}).extend({
  legalArea: LegalAreaSchema.optional()
});

export const LitigationRequestSchema = z.object({
  role: LitigationRoleSchema,
  caseType: LitigationCaseTypeSchema,
  facts: z.string().min(1),
  claimsOrDefense: z.string().optional(),
  existingEvidence: z.string().optional(),
  userQuestions: z.string().min(1),
  jurisdiction: z.literal("中国大陆").default("中国大陆")
});

export const LitigationAnalysisResultSchema = z.object({
  role: LitigationRoleSchema,
  caseType: z.string(),
  jurisdiction: z.literal("中国大陆"),
  caseSummary: z.string(),
  keyIssues: z.array(
    z.object({
      issue: z.string(),
      explanation: z.string(),
      importance: ImportanceSchema
    })
  ),
  claimsOrDefenseSuggestions: z.array(z.string()),
  legalBasis: z.array(
    z.object({
      title: z.string(),
      articleNumber: z.string().optional(),
      sourceName: z.string(),
      relevance: z.string()
    })
  ),
  evidenceAnalysis: z.object({
    existingEvidenceSummary: z.array(z.string()),
    missingEvidence: z.array(
      z.object({
        evidenceName: z.string(),
        purpose: z.string(),
        priority: ImportanceSchema
      })
    ),
    evidenceStrategy: z.array(z.string())
  }),
  opposingArgumentsAndResponses: z.array(
    z.object({
      possibleOpposingArgument: z.string(),
      responseStrategy: z.string(),
      neededEvidence: z.array(z.string())
    })
  ),
  draftDocuments: z.object({
    complaint: z.string().optional(),
    answer: z.string().optional(),
    representationStatement: z.string().optional()
  }),
  riskWarnings: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()),
  disclaimer: z.string(),
  isMockFallback: z.boolean().optional(),
  fallbackReason: z.string().optional(),
  databaseWarning: z.string().optional()
});

export const LitigationAnalysisAIResultSchema = LitigationAnalysisResultSchema.omit({
  role: true,
  caseType: true,
  jurisdiction: true,
  isMockFallback: true,
  fallbackReason: true,
  databaseWarning: true
});
