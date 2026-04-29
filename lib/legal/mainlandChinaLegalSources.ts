import type { AuthoritativeLegalSource } from "@/types/legal";

export const fallbackHardcodedLegalSources: AuthoritativeLegalSource[] = [
  {
    id: "civil-code-contract-general-performance",
    title: "合同履行与诚信原则规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会",
    sourceName: "中华人民共和国民法典 合同编",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2021-01-01",
    articleNumber: "第五百零九条等",
    content:
      "规则摘要：合同当事人应按照约定全面履行义务，并遵循诚信原则，根据合同性质、目的和交易习惯履行通知、协助、保密等义务。适用于服务合同、买卖合同、租赁合同等履行争议的基础分析。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["合同", "民商事"],
    keywords: ["合同", "履行", "全面履行", "诚信原则", "通知义务", "协助义务", "服务合同", "买卖合同", "租赁"],
    scenarioTags: ["合同履行", "服务交付", "交易习惯", "义务边界"]
  },
  {
    id: "civil-code-contract-breach-damages",
    title: "违约责任、继续履行与损害赔偿规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会",
    sourceName: "中华人民共和国民法典 合同编",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2021-01-01",
    articleNumber: "第五百七十七条、第五百八十四条等",
    content:
      "规则摘要：一方不履行合同义务或履行不符合约定的，应承担继续履行、采取补救措施或赔偿损失等违约责任。损失赔偿通常围绕违约造成的损失、合同履行后可获得利益及可预见性边界展开。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["合同", "争议解决"],
    keywords: ["违约", "违约责任", "损害赔偿", "损失", "继续履行", "补救措施", "逾期", "交付", "验收"],
    scenarioTags: ["逾期交付", "履行瑕疵", "赔偿损失", "合同审查", "诉讼请求"]
  },
  {
    id: "civil-code-contract-liquidated-damages",
    title: "违约金调整规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会",
    sourceName: "中华人民共和国民法典 合同编",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2021-01-01",
    articleNumber: "第五百八十五条",
    content:
      "规则摘要：当事人可以约定一方违约时根据违约情况支付一定数额违约金，也可以约定损失赔偿额的计算方法。约定违约金过分高于或低于造成损失的，可能涉及司法调整。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["合同", "争议解决"],
    keywords: ["违约金", "违约", "调减", "调高", "损失", "赔偿额", "逾期付款", "逾期交付"],
    scenarioTags: ["违约金主张", "违约金抗辩", "损失证明", "诉讼策略"]
  },
  {
    id: "civil-code-contract-termination",
    title: "合同解除与终止规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会",
    sourceName: "中华人民共和国民法典 合同编",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2021-01-01",
    articleNumber: "第五百六十三条等",
    content:
      "规则摘要：在约定或法定解除事由出现时，当事人可以主张解除合同。解除争议通常需要核查违约程度、催告、履行期限、合同目的能否实现及解除通知等事实。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["合同"],
    keywords: ["解除", "终止", "合同目的", "催告", "履行期限", "根本违约", "通知"],
    scenarioTags: ["合同解除", "催告函", "合同目的落空", "风险审查"]
  },
  {
    id: "supreme-court-contract-interpretation-general",
    title: "民法典合同编通则司法解释规则摘要",
    sourceType: "judicial_interpretation",
    issuingAuthority: "最高人民法院",
    sourceName: "最高人民法院关于适用《中华人民共和国民法典》合同编通则若干问题的解释",
    effectiveDate: "2023-12-05",
    articleNumber: "合同解释、违约责任等相关规则",
    content:
      "规则摘要：对民法典合同编通则适用中的合同解释、预约合同、履行抗辩、债权保全、违约责任等问题作出细化，适合在合同争议、合同审查和诉讼策略中辅助定位裁判思路。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "high",
    legalArea: ["合同", "争议解决"],
    keywords: ["合同编通则", "合同解释", "预约合同", "履行抗辩", "违约责任", "违约金", "债权人代位权", "逾期"],
    scenarioTags: ["合同解释", "履行抗辩", "违约责任", "诉讼分析"]
  },
  {
    id: "civil-procedure-filing-jurisdiction",
    title: "民事起诉条件与管辖规则摘要",
    sourceType: "procedural_rule",
    issuingAuthority: "全国人民代表大会常务委员会",
    sourceName: "中华人民共和国民事诉讼法",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2024-01-01",
    articleNumber: "起诉条件、管辖相关规则",
    content:
      "规则摘要：民事案件起诉通常需要明确原被告、具体诉讼请求、事实和理由，并属于人民法院受理民事诉讼范围和受诉法院管辖。诉讼前应核查地域管辖、协议管辖、专属管辖和仲裁条款。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["争议解决", "民事诉讼"],
    keywords: ["诉讼", "民事诉讼", "起诉", "起诉状", "管辖", "协议管辖", "仲裁条款", "原告", "被告"],
    scenarioTags: ["起诉条件", "管辖审查", "诉讼文书", "案件分析"]
  },
  {
    id: "civil-procedure-evidence-burden",
    title: "民事诉讼证据与举证责任规则摘要",
    sourceType: "procedural_rule",
    issuingAuthority: "全国人民代表大会常务委员会",
    sourceName: "中华人民共和国民事诉讼法",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2024-01-01",
    articleNumber: "证据相关规则",
    content:
      "规则摘要：当事人对自己提出的主张有责任提供证据。证据包括书证、物证、视听资料、电子数据、证人证言等。案件分析应将事实主张、证明对象和证据材料逐项对应。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["争议解决", "民事诉讼"],
    keywords: ["证据", "举证责任", "证明责任", "电子数据", "书证", "聊天记录", "微信", "转账记录", "发票", "验收单"],
    scenarioTags: ["证据清单", "证据缺口", "举证策略", "质证"]
  },
  {
    id: "civil-evidence-electronic-data",
    title: "民事诉讼电子数据证据规则摘要",
    sourceType: "evidence_rule",
    issuingAuthority: "最高人民法院",
    sourceName: "最高人民法院关于民事诉讼证据的若干规定",
    effectiveDate: "2020-05-01",
    articleNumber: "电子数据、证据审查相关规则",
    content:
      "规则摘要：电子数据可以作为民事诉讼证据类型之一。微信聊天记录、电子邮件、电子合同、转账记录等材料应关注原始载体、形成过程、完整性、真实性、关联性和证明目的。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "high",
    legalArea: ["争议解决", "证据"],
    keywords: ["证据", "电子数据", "微信", "聊天记录", "邮件", "转账记录", "原始载体", "真实性", "关联性", "合法性"],
    scenarioTags: ["电子证据", "证据补强", "质证意见", "诉讼证据"]
  },
  {
    id: "private-lending-proof-interest",
    title: "民间借贷借贷事实与利息规则摘要",
    sourceType: "judicial_interpretation",
    issuingAuthority: "最高人民法院",
    sourceName: "最高人民法院关于审理民间借贷案件适用法律若干问题的规定",
    effectiveDate: "2021-01-01",
    articleNumber: "借贷事实、利率保护相关规则",
    content:
      "规则摘要：民间借贷案件通常围绕借贷合意、款项交付、还款情况、利息约定和担保责任展开。转账凭证、借条、聊天记录、还款记录等材料对证明借贷事实具有重要意义。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "high",
    legalArea: ["民间借贷", "合同", "争议解决"],
    keywords: ["借贷", "民间借贷", "借款", "本金", "利息", "还款", "转账记录", "借条", "担保"],
    scenarioTags: ["民间借贷纠纷", "借贷事实", "利息", "还款抗辩"]
  },
  {
    id: "labor-contract-termination-compensation",
    title: "劳动合同解除与经济补偿规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会常务委员会",
    sourceName: "中华人民共和国劳动合同法",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2008-01-01",
    articleNumber: "劳动合同解除、终止和经济补偿相关规则",
    content:
      "规则摘要：劳动争议中应重点核查劳动关系、合同签订、工资支付、社保、解除事由、解除程序、经济补偿或赔偿金等事实和证据。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["劳动", "争议解决"],
    keywords: ["劳动", "劳动合同", "工资", "社保", "解除", "终止", "经济补偿", "赔偿金", "加班"],
    scenarioTags: ["劳动争议", "解除劳动合同", "经济补偿", "仲裁"]
  },
  {
    id: "company-law-shareholder-dispute",
    title: "公司治理与股东权利规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会常务委员会",
    sourceName: "中华人民共和国公司法",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2024-07-01",
    articleNumber: "股东权利、出资、董监高责任相关规则",
    content:
      "规则摘要：公司纠纷中常见争议包括出资责任、股东知情权、股权转让、公司决议效力、董监高责任等。应结合章程、出资凭证、股东会决议和工商登记材料分析。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["公司", "民商事"],
    keywords: ["公司", "股东", "股权", "出资", "章程", "董事", "监事", "高管", "股权转让", "知情权"],
    scenarioTags: ["公司纠纷", "股东争议", "股权转让", "公司治理"]
  },
  {
    id: "civil-code-tort-liability",
    title: "侵权责任基础规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会",
    sourceName: "中华人民共和国民法典 侵权责任编",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2021-01-01",
    articleNumber: "侵权责任编相关规则",
    content:
      "规则摘要：侵权责任案件通常围绕侵权行为、过错、损害后果、因果关系和责任承担方式展开。证据应覆盖损害事实、费用支出、行为与损害之间的关联。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["侵权", "民商事", "争议解决"],
    keywords: ["侵权", "损害", "过错", "因果关系", "赔偿", "医疗费", "财产损失"],
    scenarioTags: ["侵权责任纠纷", "损害赔偿", "证据缺口"]
  },
  {
    id: "civil-code-lease-contract",
    title: "房屋租赁合同基础规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会",
    sourceName: "中华人民共和国民法典 合同编",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2021-01-01",
    articleNumber: "租赁合同相关规则",
    content:
      "规则摘要：房屋租赁纠纷常围绕租金支付、押金返还、房屋交付、维修义务、提前解除、转租和违约责任展开。应核查租赁合同、付款凭证、交接记录和沟通记录。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["合同", "租赁", "争议解决"],
    keywords: ["租赁", "房屋租赁", "租金", "押金", "维修", "转租", "提前解除", "房屋交付"],
    scenarioTags: ["房屋租赁纠纷", "押金返还", "租金争议", "解除合同"]
  },
  {
    id: "civil-code-sales-contract",
    title: "买卖合同交付、验收与价款规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会",
    sourceName: "中华人民共和国民法典 合同编",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2021-01-01",
    articleNumber: "买卖合同相关规则",
    content:
      "规则摘要：买卖合同纠纷常围绕标的物交付、质量瑕疵、验收、价款支付、逾期付款和违约责任展开。证据应关注订单、发货记录、签收验收、发票和对账材料。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["合同", "买卖", "争议解决"],
    keywords: ["买卖", "买卖合同", "货款", "交付", "验收", "质量", "发票", "对账单", "逾期付款"],
    scenarioTags: ["买卖合同纠纷", "货款催收", "质量争议", "交付验收"]
  },
  {
    id: "personal-information-protection-basic",
    title: "个人信息处理合规规则摘要",
    sourceType: "law",
    issuingAuthority: "全国人民代表大会常务委员会",
    sourceName: "中华人民共和国个人信息保护法",
    url: "https://flk.npc.gov.cn/",
    effectiveDate: "2021-11-01",
    articleNumber: "个人信息处理基础规则",
    content:
      "规则摘要：处理个人信息应具备合法性基础，遵循合法、正当、必要和诚信原则。合同审查和诉讼材料处理时应注意敏感个人信息、最小必要、授权同意和数据安全。",
    jurisdiction: "中国大陆",
    reliabilityLevel: "official",
    legalArea: ["数据合规", "其他"],
    keywords: ["个人信息", "隐私", "数据", "敏感个人信息", "授权", "同意", "最小必要"],
    scenarioTags: ["隐私合规", "材料脱敏", "数据保护"]
  }
];

export const mainlandChinaLegalSources = fallbackHardcodedLegalSources;
