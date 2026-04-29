import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition shadow-[inset_0_1px_1px_rgba(18,32,29,0.03)] focus:border-primary/70 focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}
