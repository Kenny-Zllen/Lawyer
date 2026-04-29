import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from "docx";
import type {
  ContractReviewResult,
  DraftingResult,
  LegalResearchResult,
  LitigationAnalysisResult
} from "@/types/legal";
import { betaLegalDisclaimer } from "@/lib/legal/userMessages";

const fallbackNotice = "当前为系统 fallback 示例结果，非真实 AI 分析。";

export async function exportContractReviewToDocx(result: ContractReviewResult) {
  const children = [
    title("合同审查报告"),
    ...notices(result.aiMode === "mock", result.warning),
    ...section("合同摘要", [text(result.summary)]),
    ...section("总体风险", [text(result.overallRisk)]),
    ...section("关键条款", bullets(result.keyClauses)),
    ...section(
      "风险问题与修改建议",
      result.keyIssues.flatMap((issue) => [
        subheading(`${issue.title}（${issue.riskLevel}）`),
        text(issue.explanation),
        text(`建议：${issue.suggestion}`)
      ])
    ),
    ...section("建议补充条款", bullets(result.suggestedClauses)),
    ...legalSourcesSection(result.sources),
    ...disclaimerSection()
  ];

  return pack(children);
}

export async function exportLegalResearchToDocx(result: LegalResearchResult) {
  const children = [
    title("法律检索报告"),
    ...notices(result.aiMode === "mock", result.warning),
    ...section("检索问题", [text(result.query)]),
    ...section("识别领域", [text(result.legalArea)]),
    ...section("初步分析", splitText(result.answer)),
    ...section("建议下一步", bullets(result.nextSteps)),
    ...legalSourcesSection(result.sources),
    ...disclaimerSection()
  ];

  return pack(children);
}

export async function exportDraftingResultToDocx(result: DraftingResult) {
  const children = [
    title(result.title || "法律文书草稿"),
    ...notices(result.aiMode === "mock", result.warning),
    ...section("文书草稿", splitText(result.draftText)),
    ...section("交付前检查", bullets(result.checklist)),
    ...legalSourcesSection(result.sources),
    ...disclaimerSection()
  ];

  return pack(children);
}

export async function exportLitigationAnalysisToDocx(result: LitigationAnalysisResult) {
  const documentBlocks = [
    ["起诉状草稿", result.draftDocuments.complaint],
    ["答辩状草稿", result.draftDocuments.answer],
    ["代理词草稿", result.draftDocuments.representationStatement]
  ] as const;

  const children = [
    title("案件分析与诉讼文书报告"),
    ...notices(Boolean(result.isMockFallback), result.fallbackReason),
    ...section("案情摘要", splitText(result.caseSummary)),
    ...section(
      "争议焦点",
      result.keyIssues.flatMap((issue) => [
        subheading(`${issue.issue}（重要性：${importanceLabel(issue.importance)}）`),
        text(issue.explanation)
      ])
    ),
    ...section("诉讼请求建议 / 抗辩思路", bullets(result.claimsOrDefenseSuggestions)),
    ...section(
      "法律依据",
      result.legalBasis.flatMap((basis) => [
        subheading(`${basis.title}${basis.articleNumber ? ` · ${basis.articleNumber}` : ""}`),
        text(`${basis.sourceName}：${basis.relevance}`)
      ])
    ),
    ...section("已有证据摘要", bullets(result.evidenceAnalysis.existingEvidenceSummary)),
    ...section(
      "证据缺口",
      result.evidenceAnalysis.missingEvidence.flatMap((evidence) => [
        subheading(`${evidence.evidenceName}（${importanceLabel(evidence.priority)}）`),
        text(evidence.purpose)
      ])
    ),
    ...section("证据策略", bullets(result.evidenceAnalysis.evidenceStrategy)),
    ...section(
      "对方抗辩预判与应对",
      result.opposingArgumentsAndResponses.flatMap((item) => [
        subheading(item.possibleOpposingArgument),
        text(`应对策略：${item.responseStrategy}`),
        text(`所需证据：${item.neededEvidence.join("、")}`)
      ])
    ),
    ...documentBlocks.flatMap(([heading, value]) =>
      value ? section(heading, splitText(value)) : []
    ),
    ...section("风险提示", bullets(result.riskWarnings)),
    ...section("下一步建议", bullets(result.recommendedNextSteps)),
    ...disclaimerSection(result.disclaimer)
  ];

  return pack(children);
}

function pack(children: Array<Paragraph | Table>) {
  const document = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  return Packer.toBuffer(document);
}

function title(value: string) {
  return new Paragraph({
    text: value,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 320 }
  });
}

function section(heading: string, children: Array<Paragraph | Table>) {
  return [
    new Paragraph({
      text: heading,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 280, after: 120 }
    }),
    ...children
  ];
}

function subheading(value: string) {
  return new Paragraph({
    text: value,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 160, after: 80 }
  });
}

function text(value: string) {
  return new Paragraph({
    children: [new TextRun(value || "未提供")],
    spacing: { after: 100 }
  });
}

function splitText(value: string) {
  return (value || "未提供").split(/\n+/).map((line) => text(line));
}

function bullets(items: string[]) {
  if (!items.length) return [text("未提供")];

  return items.map(
    (item) =>
      new Paragraph({
        text: item,
        bullet: { level: 0 },
        spacing: { after: 80 }
      })
  );
}

function notices(isFallback: boolean, warning?: string) {
  const paragraphs: Paragraph[] = [];

  if (isFallback) {
    paragraphs.push(text(fallbackNotice));
  }

  if (warning) {
    paragraphs.push(text(warning));
  }

  return paragraphs;
}

function legalSourcesSection(sources: ContractReviewResult["sources"]) {
  if (!sources.length) {
    return section("法律依据", [text("当前内置规则库未检索到足够相关依据。")]);
  }

  const rows = [
    new TableRow({
      children: ["标题", "来源", "条文/规则", "摘要"].map((header) =>
        new TableCell({ children: [text(header)] })
      )
    }),
    ...sources.map(
      (source) =>
        new TableRow({
          children: [
            source.title,
            source.sourceName,
            source.articleNumber ?? "规则摘要",
            source.content
          ].map((cell) => new TableCell({ children: [text(cell)] }))
        })
    )
  ];

  return section("法律依据", [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
      },
      rows
    })
  ]);
}

function disclaimerSection(disclaimer = betaLegalDisclaimer) {
  return section("免责声明", [text(disclaimer)]);
}

function importanceLabel(value: "high" | "medium" | "low") {
  return value === "high" ? "高" : value === "medium" ? "中" : "低";
}
