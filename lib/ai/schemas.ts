import { z } from "zod";

export const LegalAreaSchema = z.enum(["合同", "劳动", "公司", "争议解决", "其他"]);
export const RiskLevelSchema = z.enum(["低", "中", "高"]);

export const AuthoritativeLegalSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  authority: z.enum(["法律", "行政法规", "司法解释", "部门规章", "指导性案例", "司法文件"]),
  issuingBody: z.string(),
  effectiveDate: z.string(),
  legalArea: LegalAreaSchema,
  jurisdiction: z.literal("中华人民共和国大陆"),
  url: z.string().optional(),
  keywords: z.array(z.string()),
  summary: z.string(),
  relevantArticles: z.array(z.string())
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
  sources: z.array(AuthoritativeLegalSourceSchema)
});

export const LegalResearchResultSchema = z.object({
  query: z.string(),
  legalArea: LegalAreaSchema,
  answer: z.string(),
  sources: z.array(AuthoritativeLegalSourceSchema),
  nextSteps: z.array(z.string())
});

export const DraftingResultSchema = z.object({
  title: z.string(),
  legalArea: LegalAreaSchema,
  draftText: z.string(),
  checklist: z.array(z.string()),
  sources: z.array(AuthoritativeLegalSourceSchema)
});
