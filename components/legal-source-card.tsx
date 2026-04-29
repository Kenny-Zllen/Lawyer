import type { AuthoritativeLegalSource } from "@/types/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sourceTypeLabels: Record<AuthoritativeLegalSource["sourceType"], string> = {
  law: "法律",
  judicial_interpretation: "司法解释",
  evidence_rule: "证据规则",
  procedural_rule: "程序规则",
  guiding_case: "指导性案例",
  court_case: "裁判案例",
  government_guidance: "政府指引",
  other: "其他"
};

const reliabilityLabels: Record<AuthoritativeLegalSource["reliabilityLevel"], string> = {
  official: "官方",
  high: "高",
  medium: "中"
};

export function LegalSourceCard({ source }: { source: AuthoritativeLegalSource }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{sourceTypeLabels[source.sourceType]}</span>
          <span>·</span>
          <span>{source.issuingAuthority}</span>
          <span>·</span>
          <span>{source.effectiveDate ?? "日期未标注"}</span>
          <span>·</span>
          <span>可靠性：{reliabilityLabels[source.reliabilityLevel]}</span>
        </div>
        <CardTitle className="text-base">{source.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-xs text-muted-foreground">{source.sourceName}{source.articleNumber ? ` · ${source.articleNumber}` : ""}</p>
        <p className="leading-6 text-muted-foreground">{source.content}</p>
        <div className="flex flex-wrap gap-2">
          {[...source.legalArea, ...source.scenarioTags].slice(0, 8).map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
