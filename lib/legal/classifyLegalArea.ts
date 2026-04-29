import type { LegalArea } from "@/types/legal";

const areaKeywords: Record<Exclude<LegalArea, "其他">, string[]> = {
  合同: ["合同", "协议", "违约", "解除", "保密", "服务", "付款", "交付", "验收"],
  劳动: ["劳动", "员工", "雇佣", "试用期", "竞业", "社保", "离职", "工资"],
  公司: ["公司", "股东", "股权", "出资", "董事", "章程", "融资", "分红"],
  争议解决: ["诉讼", "仲裁", "管辖", "证据", "保全", "执行", "催告", "争议"]
};

export function classifyLegalArea(text: string): LegalArea {
  const normalized = text.toLowerCase();
  const matched = Object.entries(areaKeywords)
    .map(([area, keywords]) => ({
      area: area as LegalArea,
      score: keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length
    }))
    .sort((a, b) => b.score - a.score)[0];

  return matched?.score ? matched.area : "其他";
}
