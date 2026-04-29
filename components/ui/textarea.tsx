import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-md border border-border bg-white px-3 py-2 text-sm leading-6 outline-none transition shadow-[inset_0_1px_1px_rgba(18,32,29,0.03)] focus:border-primary/70 focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}
