import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardCard({
  href,
  title,
  description,
  icon: Icon,
  cta = "进入工作台"
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  cta?: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full overflow-hidden transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_36px_rgba(18,32,29,0.08)]">
        <CardHeader>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-border/80 bg-muted/70 text-primary shadow-sm transition group-hover:border-primary/30 group-hover:bg-white">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="min-h-12 text-sm leading-6 text-muted-foreground">{description}</p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            {cta}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
