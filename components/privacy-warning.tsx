import { ShieldAlert } from "lucide-react";

export const PRIVACY_WARNING =
  "在没有合适数据保护措施前，请勿上传高度敏感、涉密或受律师保密特权保护的信息。";

export function PrivacyWarning() {
  return (
    <div className="flex gap-3 rounded-md border border-border/80 bg-muted/70 p-4 text-sm text-muted-foreground">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-primary shadow-sm">
        <ShieldAlert className="h-4 w-4" aria-hidden="true" />
      </div>
      <p className="leading-6">{PRIVACY_WARNING}</p>
    </div>
  );
}
