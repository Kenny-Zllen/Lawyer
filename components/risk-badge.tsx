import type { RiskLevel } from "@/types/legal";
import { cn } from "@/lib/utils";

const riskClass: Record<RiskLevel, string> = {
  低: "border-[#7ca982] bg-[#edf7ef] text-[#255f31]",
  中: "border-[#d7b15f] bg-[#fff7df] text-[#735315]",
  高: "border-[#d2786d] bg-[#fff0ed] text-[#90251c]"
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", riskClass[level])}>
      {level}风险
    </span>
  );
}
