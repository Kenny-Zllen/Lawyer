import type { AuthoritativeLegalSource } from "@/types/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LegalSourceCard({ source }: { source: AuthoritativeLegalSource }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{source.authority}</span>
          <span>·</span>
          <span>{source.issuingBody}</span>
          <span>·</span>
          <span>{source.effectiveDate}</span>
        </div>
        <CardTitle className="text-base">{source.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="leading-6 text-muted-foreground">{source.summary}</p>
        <div className="flex flex-wrap gap-2">
          {source.relevantArticles.map((article) => (
            <span key={article} className="rounded-full bg-muted px-2.5 py-1 text-xs">
              {article}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
