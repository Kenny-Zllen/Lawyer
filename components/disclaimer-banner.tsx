import { Scale } from "lucide-react";
import { betaLegalDisclaimer } from "@/lib/legal/userMessages";

export const LEGAL_DISCLAIMER =
  betaLegalDisclaimer;

export function DisclaimerBanner() {
  return (
    <div className="flex gap-3 rounded-md border border-[#d8c18f] bg-[#fffaf0] p-4 text-sm text-[#594318] shadow-[0_1px_2px_rgba(89,67,24,0.04)]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f5ead1] text-[#735315]">
        <Scale className="h-4 w-4" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold">大陆法域限定与免责声明</p>
        <p className="mt-1 leading-6">
          {LEGAL_DISCLAIMER} 本产品仅支持中华人民共和国大陆法域，不支持港澳台及其他国家地区法律。
        </p>
      </div>
    </div>
  );
}
