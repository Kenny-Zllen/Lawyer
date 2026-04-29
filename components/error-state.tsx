import { AlertTriangle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex gap-3 rounded-md border border-destructive/30 bg-[#fff0ed] p-4 text-sm text-[#90251c]">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
