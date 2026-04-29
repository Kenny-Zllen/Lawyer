import type { AuthoritativeLegalSource } from "@/types/legal";

export const mainlandChinaLegalSources: AuthoritativeLegalSource[] = [
  {
    id: "prc-civil-code-contract",
    title: "中华人民共和国民法典 合同编",
    authority: "法律",
    issuingBody: "全国人民代表大会",
    effectiveDate: "2021-01-01",
    legalArea: "合同",
    jurisdiction: "中华人民共和国大陆",
    url: "https://flk.npc.gov.cn/",
    keywords: ["合同", "违约", "违约金", "逾期", "交付", "履行", "损失", "解除", "格式条款", "买卖", "服务协议", "保密"],
    summary: "规定合同订立、效力、履行、保全、变更转让、终止、违约责任及典型合同规则。",
    relevantArticles: ["第四百六十九条", "第四百九十六条", "第五百零九条", "第五百六十三条", "第五百七十七条"]
  },
  {
    id: "labor-contract-law",
    title: "中华人民共和国劳动合同法",
    authority: "法律",
    issuingBody: "全国人民代表大会常务委员会",
    effectiveDate: "2008-01-01",
    legalArea: "劳动",
    jurisdiction: "中华人民共和国大陆",
    url: "https://flk.npc.gov.cn/",
    keywords: ["劳动", "劳动合同", "试用期", "竞业限制", "解除", "经济补偿"],
    summary: "规范劳动合同订立、履行、变更、解除和终止，以及特别规定和法律责任。",
    relevantArticles: ["第十条", "第十九条", "第二十三条", "第三十九条", "第四十六条"]
  },
  {
    id: "company-law-2023",
    title: "中华人民共和国公司法",
    authority: "法律",
    issuingBody: "全国人民代表大会常务委员会",
    effectiveDate: "2024-07-01",
    legalArea: "公司",
    jurisdiction: "中华人民共和国大陆",
    url: "https://flk.npc.gov.cn/",
    keywords: ["公司", "股东", "出资", "董事", "章程", "股权转让"],
    summary: "规定公司设立、组织机构、股东权利义务、董监高责任、股权股份和公司变更终止。",
    relevantArticles: ["第四十七条", "第五十一条", "第八十八条", "第一百八十条", "第二百六十五条"]
  },
  {
    id: "civil-procedure-law",
    title: "中华人民共和国民事诉讼法",
    authority: "法律",
    issuingBody: "全国人民代表大会常务委员会",
    effectiveDate: "2024-01-01",
    legalArea: "争议解决",
    jurisdiction: "中华人民共和国大陆",
    url: "https://flk.npc.gov.cn/",
    keywords: ["诉讼", "民事诉讼", "起诉", "答辩", "管辖", "证据", "保全", "执行", "送达", "代理词"],
    summary: "规则摘要：规范民事案件起诉条件、管辖、审判程序、证据、保全、执行及送达等基础程序规则。",
    relevantArticles: ["起诉条件规则摘要", "证据规则摘要", "管辖规则摘要", "保全规则摘要", "执行规则摘要"]
  },
  {
    id: "arbitration-law",
    title: "中华人民共和国仲裁法",
    authority: "法律",
    issuingBody: "全国人民代表大会常务委员会",
    effectiveDate: "1995-09-01",
    legalArea: "争议解决",
    jurisdiction: "中华人民共和国大陆",
    url: "https://flk.npc.gov.cn/",
    keywords: ["仲裁", "仲裁协议", "仲裁条款", "裁决", "争议解决"],
    summary: "规定仲裁协议、仲裁委员会、仲裁程序、裁决撤销和执行等基本规则。",
    relevantArticles: ["第十六条", "第十八条", "第二十一条", "第五十八条", "第六十二条"]
  },
  {
    id: "private-lending-judicial-interpretation",
    title: "最高人民法院关于审理民间借贷案件适用法律若干问题的规定",
    authority: "司法解释",
    issuingBody: "最高人民法院",
    effectiveDate: "2021-01-01",
    legalArea: "争议解决",
    jurisdiction: "中华人民共和国大陆",
    keywords: ["借贷", "民间借贷", "本金", "利息", "转账记录", "还款", "借款合同"],
    summary: "规则摘要：就民间借贷合同效力、借贷事实证明、利率保护、还款责任等审理问题提供裁判规则框架。",
    relevantArticles: ["借贷事实规则摘要", "利率保护规则摘要", "合同效力规则摘要"]
  },
  {
    id: "civil-evidence-rules",
    title: "最高人民法院关于民事诉讼证据的若干规定",
    authority: "司法解释",
    issuingBody: "最高人民法院",
    effectiveDate: "2020-05-01",
    legalArea: "争议解决",
    jurisdiction: "中华人民共和国大陆",
    keywords: ["证据", "举证", "质证", "聊天记录", "微信", "转账记录", "发票", "验收单", "对账单", "证明目的"],
    summary: "规则摘要：规定民事诉讼举证、质证、证据交换、电子数据、证明责任及证据审查判断的基础规则。",
    relevantArticles: ["举证责任规则摘要", "电子数据规则摘要", "证据审查规则摘要"]
  },
  {
    id: "personal-information-protection-law",
    title: "中华人民共和国个人信息保护法",
    authority: "法律",
    issuingBody: "全国人民代表大会常务委员会",
    effectiveDate: "2021-11-01",
    legalArea: "其他",
    jurisdiction: "中华人民共和国大陆",
    url: "https://flk.npc.gov.cn/",
    keywords: ["个人信息", "隐私", "数据", "处理", "同意", "敏感个人信息"],
    summary: "规定个人信息处理规则、跨境提供、个人权利、处理者义务和法律责任。",
    relevantArticles: ["第十三条", "第二十八条", "第三十八条", "第五十一条", "第六十六条"]
  },
  {
    id: "supreme-court-contract-interpretation",
    title: "最高人民法院关于适用《中华人民共和国民法典》合同编通则若干问题的解释",
    authority: "司法解释",
    issuingBody: "最高人民法院",
    effectiveDate: "2023-12-05",
    legalArea: "合同",
    jurisdiction: "中华人民共和国大陆",
    keywords: ["合同编通则", "合同解释", "预约合同", "违约责任", "违约金", "逾期", "交付", "履行", "损失", "债权人代位权"],
    summary: "就民法典合同编通则适用中的合同解释、预约合同、履行抗辩、违约责任等作出细化。",
    relevantArticles: ["第一条", "第六条", "第二十六条", "第五十九条", "第六十八条"]
  }
];
