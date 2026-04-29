import { ShieldAlert } from "lucide-react";

export const PRIVACY_WARNING =
  "在没有合适数据保护措施前，请勿上传高度敏感、涉密或受律师保密特权保护的信息。";

export function PrivacyWarning() {
  return (
    <div className="flex gap-3 rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <p className="leading-6">{PRIVACY_WARNING}</p>
    </div>
  );
}
