"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportFailedMessage } from "@/lib/legal/userMessages";

export function ExportDocxButton({
  endpoint,
  payload,
  fileName,
  label = "导出 Word"
}: {
  endpoint: string;
  payload: unknown;
  fileName: string;
  label?: string;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  async function exportDocx() {
    setError("");
    setIsExporting(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(exportFailedMessage);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError(exportFailedMessage);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="outline" size="sm" onClick={exportDocx} disabled={isExporting}>
        <Download className="h-4 w-4" aria-hidden="true" />
        {isExporting ? "导出中" : label}
      </Button>
      {error && <p className="max-w-44 text-right text-xs text-destructive">{error}</p>}
    </div>
  );
}
