import { Briefcase, FileSearch, PenLine, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DashboardCard } from "@/components/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <AppShell
      title="中国大陆法律 AI 工作台"
      description="面向律师、企业法务和中小企业主的中国大陆民商事法律 AI 工作台，聚焦合同审查、权威法律检索、文书生成和诉讼案件分析。"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          href="/contract-review"
          title="合同审查"
          description="粘贴合同条款或上传占位文件，生成风险摘要、问题清单、修改建议和权威依据。"
          icon={FileSearch}
        />
        <DashboardCard
          href="/legal-research"
          title="中国大陆法律检索辅助"
          description="围绕大陆民商事问题检索 mock 权威来源，输出初步分析和下一步工作建议。"
          icon={Search}
        />
        <DashboardCard
          href="/legal-drafting"
          title="法律文书生成"
          description="基于保密协议、催告函、服务协议等模板生成可复制的第一版文书草稿。"
          icon={PenLine}
        />
        <DashboardCard
          href="/litigation-assistant"
          title="案件分析与诉讼助手"
          description="基于案情、诉讼立场和证据材料，生成争议焦点、诉讼文书草稿、证据补充建议和对方抗辩预判。"
          icon={Briefcase}
          cta="开始案件分析"
        />
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>当前阶段范围</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>当前版本支持真实 AI 可选接入、API workflows、文档解析、诉讼分析和 mock fallback。</p>
            <p>数据库或 AI 不可用时不会阻断核心流程，但结果会标记为 fallback 或未持久化。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>法域边界</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>产品仅支持中华人民共和国大陆法域。</p>
            <p>港澳台及其他国家地区法律问题，应由相应法域合资格专业人士处理。</p>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
