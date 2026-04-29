import { z } from "zod";

export const LegalSourceTypeSchema = z.enum([
  "law",
  "judicial_interpretation",
  "evidence_rule",
  "procedural_rule",
  "guiding_case",
  "court_case",
  "government_guidance",
  "other"
]);

export const AuthoritativeLegalSourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  sourceType: LegalSourceTypeSchema,
  issuingAuthority: z.string().min(1),
  sourceName: z.string().min(1),
  url: z.string().optional(),
  effectiveDate: z.string().optional(),
  articleNumber: z.string().optional(),
  content: z.string().min(1),
  jurisdiction: z.literal("中国大陆"),
  reliabilityLevel: z.enum(["official", "high", "medium"]),
  legalArea: z.array(z.string().min(1)).min(1),
  keywords: z.array(z.string().min(1)).min(1),
  scenarioTags: z.array(z.string().min(1)).min(1)
});

export const AuthoritativeLegalSourceArraySchema = z.array(AuthoritativeLegalSourceSchema);
