import { Loader2 } from "lucide-react";

export function LoadingState({ label = "正在生成结果" }: { label?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-border bg-card text-sm text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}
