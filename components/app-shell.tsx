import Link from "next/link";
import { Briefcase, FileSearch, LayoutDashboard, PenLine, Search } from "lucide-react";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

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
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card px-4 py-6 lg:block">
        <Link href="/" className="block rounded-md px-3 py-2">
          <p className="text-sm text-muted-foreground">中国大陆民商事合同</p>
          <p className="mt-1 text-xl font-semibold tracking-normal">法律 AI 工作台</p>
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-4 right-4 rounded-md border border-border bg-muted p-3 text-xs leading-5 text-muted-foreground">
          当前 MVP：真实 AI 可选接入，数据库和 AI 不可用时保留 mock fallback。
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6">
            <nav className="flex flex-wrap gap-2 lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md border border-border px-3 py-2 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div>
              <p className="text-sm font-medium text-primary">中华人民共和国大陆法域</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal md:text-3xl">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            <DisclaimerBanner />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
