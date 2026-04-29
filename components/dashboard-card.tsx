import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardCard({
  href,
  title,
  description,
  icon: Icon
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full transition hover:border-primary/50 hover:shadow-md">
        <CardHeader>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-muted text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="min-h-12 text-sm leading-6 text-muted-foreground">{description}</p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
            进入工作台
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
