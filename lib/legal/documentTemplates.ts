import type { LegalArea } from "@/types/legal";

export interface DocumentTemplate {
  id: string;
  name: string;
  legalArea: LegalArea;
  description: string;
  sections: string[];
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "nda",
    name: "保密协议",
    legalArea: "合同",
    description: "适用于商务洽谈、项目合作前的信息披露场景。",
    sections: ["定义与范围", "保密义务", "允许披露", "期限", "违约责任", "争议解决"]
  },
  {
    id: "demand-letter",
    name: "催告函",
    legalArea: "争议解决",
    description: "适用于付款、交付、整改等民商事履约催告。",
    sections: ["事实背景", "合同依据", "催告事项", "履行期限", "保留权利"]
  },
  {
    id: "service-agreement",
    name: "服务协议",
    legalArea: "合同",
    description: "适用于企业间服务采购、技术支持、咨询交付。",
    sections: ["服务范围", "交付验收", "费用支付", "知识产权", "保密", "违约责任"]
  },
  {
    id: "employment-summary",
    name: "劳动合同摘要",
    legalArea: "劳动",
    description: "用于提炼劳动合同核心条款和注意事项。",
    sections: ["岗位与期限", "工作地点", "薪酬福利", "试用期", "解除终止", "合规提醒"]
  },
  {
    id: "legal-memo",
    name: "法律分析备忘录",
    legalArea: "其他",
    description: "用于形成事实、问题、规则、分析和建议结构化备忘录。",
    sections: ["背景事实", "待分析问题", "法律依据", "初步分析", "行动建议"]
  }
];

export function getDocumentTemplate(templateId: string) {
  return documentTemplates.find((template) => template.id === templateId) ?? documentTemplates[0];
}
