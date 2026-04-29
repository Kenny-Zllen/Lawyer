"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FileSearch, LayoutDashboard, PenLine, Search } from "lucide-react";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contract-review", label: "合同审查", icon: FileSearch },
  { href: "/legal-research", label: "法律检索", icon: Search },
  { href: "/legal-drafting", label: "文书生成", icon: PenLine },
  { href: "/litigation-assistant", label: "案件分析", icon: Briefcase }
];

export function AppShell({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(23,68,63,0.06),transparent_360px)]">
      <aside className="fixed inset-y-0 left-0 hidden w-[17rem] border-r border-border/80 bg-[#fafbf9]/95 px-4 py-5 shadow-[8px_0_30px_rgba(18,32,29,0.04)] backdrop-blur lg:block">
        <Link href="/" className="block rounded-md px-3 py-3">
          <p className="text-xs font-medium text-muted-foreground">中国大陆民商事</p>
          <p className="mt-1 text-xl font-semibold tracking-normal text-foreground">法律 AI 工作台</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Beta 试用版</p>
        </Link>

        <nav className="mt-7 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(23,68,63,0.14)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-md border border-border/80 bg-white p-3 text-xs leading-5 text-muted-foreground shadow-sm">
          真实 AI 可选接入。服务不可用时，系统会清晰标注 fallback 示例结果。
        </div>
      </aside>

      <div className="lg:pl-[17rem]">
        <header className="border-b border-border/80 bg-white/82 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:px-8">
            <nav className="flex flex-wrap gap-2 lg:hidden">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm transition",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                中华人民共和国大陆法域
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
                {title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
            </div>

            <DisclaimerBanner />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-7 md:px-8">{children}</main>
      </div>
    </div>
  );
}
