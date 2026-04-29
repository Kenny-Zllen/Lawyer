import { Scale } from "lucide-react";

export const LEGAL_DISCLAIMER =
  "本工具仅提供 AI 生成的法律信息、合同审查和文书草稿支持，不构成正式法律意见。请在依赖任何输出前咨询合资格律师。";

export function DisclaimerBanner() {
  return (
    <div className="flex gap-3 rounded-md border border-[#d7c08d] bg-[#fff8e6] p-4 text-sm text-[#5c4618]">
      <Scale className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">大陆法域限定与免责声明</p>
        <p className="mt-1 leading-6">
          {LEGAL_DISCLAIMER} 本产品仅支持中华人民共和国大陆法域，不支持港澳台及其他国家地区法律。
        </p>
      </div>
    </div>
  );
}
