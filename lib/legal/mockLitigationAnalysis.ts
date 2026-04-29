import type {
  AuthoritativeLegalSource,
  LitigationAnalysisResult,
  LitigationRequest
} from "@/types/legal";

const disclaimer =
  "本工具仅提供 AI 生成的法律信息、诉讼分析和文书草稿支持，不构成正式法律意见。请在依赖任何输出前咨询合资格律师。";

export function createMockLitigationAnalysis(
  request: LitigationRequest,
  sources: AuthoritativeLegalSource[]
): LitigationAnalysisResult {
  const legalBasis = sources.slice(0, 4).map((source) => ({
    title: source.title,
    articleNumber: source.relevantArticles[0],
    sourceName: source.title,
    relevance: `可作为分析${request.caseType}中实体权利、程序安排或证据责任的参考依据。`
  }));
  const existingEvidence = parseEvidence(request.existingEvidence);

  return {
    role: request.role,
    caseType: request.caseType,
    jurisdiction: "中国大陆",
    caseSummary: `根据现有材料，本案属于${request.caseType}，用户当前代表${request.role}。案情核心在于事实履行、权利义务边界、证据完整性及诉讼请求或抗辩观点能否获得证据支持。`,
    keyIssues: [
      {
        issue: "基础法律关系是否成立且有效",
        explanation: "需结合合同、交易记录、沟通记录或其他书面材料判断双方之间的权利义务基础。",
        importance: "high"
      },
      {
        issue: request.role === "被告" ? "原告诉讼请求是否具有事实和法律依据" : "诉讼请求金额和责任承担方式是否明确",
        explanation: "诉讼请求或抗辩意见应与事实、合同约定、履行情况和证据材料形成对应关系。",
        importance: "high"
      },
      {
        issue: "现有证据能否形成完整证明链条",
        explanation: "需要区分合同成立、履行、违约或损害后果等不同证明对象，逐项匹配证据。",
        importance: "medium"
      }
    ],
    claimsOrDefenseSuggestions: buildSuggestions(request),
    legalBasis,
    evidenceAnalysis: {
      existingEvidenceSummary: existingEvidence,
      missingEvidence: [
        {
          evidenceName: "对方主体身份及签署权限材料",
          purpose: "证明对方主体适格、签约或履约行为可归属于相应主体。",
          priority: "medium"
        },
        {
          evidenceName: "完整履行过程证据",
          purpose: "证明交付、验收、付款、催告、拒绝履行或损失发生的时间线。",
          priority: "high"
        },
        {
          evidenceName: "损失或金额计算依据",
          purpose: "支撑诉讼请求金额、违约金调整抗辩或损失赔偿范围。",
          priority: "high"
        }
      ],
      evidenceStrategy: [
        "将每项诉讼请求或抗辩观点对应到具体证据和证明目的。",
        "优先补强原始合同、付款凭证、交付验收记录、催告通知和沟通记录。",
        "对电子数据保留原始载体、导出记录和形成时间，必要时考虑公证或可信时间戳。"
      ]
    },
    opposingArgumentsAndResponses: buildOpposingArguments(request),
    draftDocuments: buildDraftDocuments(request),
    riskWarnings: [
      "诉讼时效、管辖约定、仲裁条款、证据原件和送达地址均需由律师进一步核查。",
      "当前草稿基于用户摘要材料生成，不能替代对完整案卷、证据原件和交易背景的审查。",
      "不得将本结果理解为胜诉承诺或确定胜率判断。"
    ],
    recommendedNextSteps: [
      "整理案件时间线，并将每个关键事实对应到证据编号。",
      "补充当事人身份信息、合同全文、付款或交付凭证、催告记录和损失计算表。",
      "由合资格律师核查管辖、诉讼时效、请求权基础和证据形式合规性。"
    ],
    disclaimer,
    isMockFallback: true,
    fallbackReason: "AI 调用失败，已返回 mock 示例结果。"
  };
}

function parseEvidence(existingEvidence?: string) {
  if (!existingEvidence?.trim()) {
    return ["用户尚未提供明确证据清单，需要补充合同、付款、交付、沟通和催告等材料。"];
  }

  return existingEvidence
    .split(/\n|；|;|、/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function buildSuggestions(request: LitigationRequest) {
  if (request.role === "原告") {
    return [
      "明确被告主体、合同或基础法律关系、违约事实及责任承担方式。",
      "将诉讼请求拆分为本金或价款、违约金或损失、利息、诉讼费用承担等项目。",
      "如需解除合同或继续履行，应补充相应通知、催告及履行障碍证据。"
    ];
  }

  if (request.role === "被告") {
    return [
      "审查原告请求权基础是否成立，重点核对合同效力、履行条件和金额计算。",
      "围绕已履行、对方先违约、违约金过高、损失未证明、诉讼时效或管辖提出抗辩。",
      "对原告证据真实性、关联性、合法性和证明目的逐项发表质证意见。"
    ];
  }

  return [
    "说明第三人与案件处理结果之间的法律利害关系。",
    "厘清第三人是否承担义务、享有独立请求权或仅需发表参加诉讼意见。",
    "补充能证明第三人交易地位、履行行为和权利义务边界的证据。"
  ];
}

function buildOpposingArguments(request: LitigationRequest) {
  if (request.role === "被告") {
    return [
      {
        possibleOpposingArgument: "原告可能主张合同关系明确且被告存在违约。",
        responseStrategy: "逐项核对合同成立、履行条件、对方是否先违约以及金额计算依据。",
        neededEvidence: ["合同全文", "履行记录", "付款或交付凭证", "双方沟通记录"]
      }
    ];
  }

  return [
    {
      possibleOpposingArgument: "对方可能主张其已履行义务或不存在违约责任。",
      responseStrategy: "以时间线方式展示对方未履行、迟延履行或履行不符合约定的事实。",
      neededEvidence: ["催告函", "交付验收记录", "聊天记录", "损失计算依据"]
    },
    {
      possibleOpposingArgument: "对方可能请求调减违约金或否认损失。",
      responseStrategy: "补充实际损失、履行利益受损、替代交易成本或合理费用证据。",
      neededEvidence: ["损失明细", "发票", "对账单", "替代采购或修复记录"]
    }
  ];
}

function buildDraftDocuments(request: LitigationRequest) {
  const representationStatement = `代理词

尊敬的审判长、审判员：

围绕本案争议焦点，发表如下代理意见：

一、应先审查双方基础法律关系及主要权利义务。
根据现有材料，本案属于${request.caseType}，需结合合同、履行记录和沟通材料判断责任承担。

二、应围绕证据链条判断各项主张是否成立。
用户现有材料为：${request.existingEvidence || "尚未形成完整证据清单"}。仍需补充原始证据和证明目的说明。

三、应结合诉讼角色确定请求或抗辩重点。
用户当前代表${request.role}，相关诉讼策略需围绕事实基础、法律依据和证据充分性展开。

综上，请求法院依法采纳上述代理意见。

代理人：
日期：

提示：需根据具体法院、当事人身份信息和证据材料进一步完善。`;

  if (request.role === "原告") {
    return {
      complaint: `民事起诉状

原告：
被告：

诉讼请求：
1. 请求法院判令被告承担相应民事责任。
2. 请求法院判令被告支付违约金、损失或其他应付款项，具体金额以证据和计算清单为准。
3. 请求法院判令被告承担本案诉讼费用。

事实与理由：
${request.facts}

证据和证据来源：
${request.existingEvidence || "需补充合同、付款凭证、交付记录、沟通记录、催告函等证据。"}

此致
有管辖权的人民法院

具状人：
日期：

提示：需根据具体法院、当事人身份信息和证据材料进一步完善。`,
      representationStatement
    };
  }

  if (request.role === "被告") {
    return {
      answer: `民事答辩状

答辩人：
被答辩人：

答辩请求：
1. 请求依法驳回或调整被答辩人缺乏事实和法律依据的诉讼请求。
2. 请求依法由被答辩人承担相应诉讼费用或不利后果。

事实与理由：
${request.claimsOrDefense || "需结合原告诉讼请求、合同履行情况和证据材料进一步补充答辩意见。"}

证据意见：
${request.existingEvidence || "需围绕原告证据的真实性、合法性、关联性及证明目的逐项发表意见。"}

此致
有管辖权的人民法院

答辩人：
日期：

提示：需根据具体法院、当事人身份信息和证据材料进一步完善。`,
      representationStatement
    };
  }

  return {
    representationStatement: representationStatement.replace(
      "围绕本案争议焦点，发表如下代理意见：",
      "围绕本案争议焦点及第三人与案件结果的利害关系，发表如下参加诉讼意见："
    )
  };
}
