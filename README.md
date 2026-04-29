# 中国大陆法律 AI 工作台 Beta

面向律师、企业法务和中小企业主的中国大陆民商事法律 AI 工作台。Beta 版本聚焦四个试用场景：合同审查、法律检索辅助、法律文书生成、案件分析与诉讼文书助手。

本项目支持真实 OpenAI 兼容大模型调用，也保留系统 fallback 示例结果，便于在 API、数据库或模型暂不可用时继续体验完整流程。

## 当前功能

- Dashboard：`/`
- 合同审查：上传 TXT / DOCX / PDF 或粘贴合同，生成风险摘要、关键问题、修改建议和法律依据。
- 法律检索：基于内置中国大陆民商事规则摘要库生成初步分析和下一步建议。
- 文书生成：生成保密协议、催告函、服务协议、劳动合同摘要、法律分析备忘录等草稿。
- 案件分析与诉讼文书助手：生成争议焦点、诉讼请求或抗辩思路、证据缺口、对方抗辩预判、起诉状、答辩状和代理词草稿。
- 四个模块均支持 DOCX / Word 导出。
- 合同上传限制 10MB，支持 TXT / DOCX / PDF 基础文本提取，暂不支持 OCR。
- 数据库不可用时不阻断页面展示。

## 技术栈

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui 风格组件
- Lucide React
- OpenAI SDK
- Zod
- Prisma
- docx
- Mammoth
- pdf-parse

## 本地运行

```bash
npm install
npm run prisma:generate
npm run dev
```

访问：

- `http://localhost:3000`
- `/contract-review`
- `/legal-research`
- `/legal-drafting`
- `/litigation-assistant`

## 环境变量

复制 `.env.example` 为 `.env.local` 或 `.env`，按需填写：

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=
```

`OPENAI_API_KEY` 只在服务端读取，不得提交到仓库，也不得写入前端代码。

数据库建议使用 PostgreSQL：

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/legal_ai?schema=public"
```

如果未配置数据库，Beta 仍可运行，但结果不会持久化。

## 四个模块说明

### 合同审查

适合合同初审、缺失条款识别、违约责任和履行风险梳理。输出可作为律师修改合同的工作底稿。

### 法律检索

适合中国大陆民商事问题的初步分析。当前检索对象是内置规则摘要库，不是完整法律数据库。

### 文书生成

适合生成第一版文书草稿。用户应补充真实主体信息、金额、日期、附件和签署安排。

### 案件分析与诉讼文书助手

适合民商事案件的初步诉讼策略、证据清单、对方抗辩预判、起诉状、答辩状和代理词草稿。

## DOCX 导出

四个结果页均提供“导出 Word”按钮：

- `POST /api/export/contract-review`
- `POST /api/export/legal-research`
- `POST /api/export/legal-drafting`
- `POST /api/export/litigation-analysis`

导出的 DOCX 可编辑，包含中文标题、分节、法律依据、免责声明和 fallback 标注。

## 法律知识库说明

法律来源优先从 `data/legal-sources/*.json` 加载，结构由 `lib/legal/legalSourceSchema.ts` 使用 Zod 校验。`lib/legal/mainlandChinaLegalSources.ts` 保留为 fallback。

当前数据是内置中国大陆民商事规则摘要库，不是完整权威法律数据库，也不包含全量法条原文、案例库或裁判文书库。新增来源请参考 `docs/legal-source-authoring.md`。

当前检索链路：

- `keywordRetriever`：关键词和 scoring 检索。
- `vectorRetriever`：stub，预留 pgvector / embeddings。
- `hybridRetriever`：当前调用 keyword retriever，未来合并关键词和向量检索。

## Fallback 机制

当 AI 服务不可用、API Key 缺失、模型不可用或账户额度不足时，后端会返回系统 fallback 示例结果，并在页面和 DOCX 顶部标注：

> 当前为系统 fallback 示例结果，非真实 AI 分析。

数据库不可用时，页面会显示：

> 当前结果未写入数据库，但不影响本次分析展示。

## 安全与隐私提示

- 不要上传涉密、敏感个人信息或受律师保密特权保护的完整材料。
- 不要在日志中输出完整合同、案情、证据材料或 API Key。
- 本产品仅支持中华人民共和国大陆法域，不支持港澳台及其他国家地区法律。
- 本工具仅提供 AI 生成的法律信息、合同审查、诉讼分析和文书草稿支持，不构成正式法律意见。请在依赖任何输出前咨询合资格律师。

## 测试与评估

```bash
npm run typecheck
npm run lint
npm run build
```

如本地沙箱触发 Turbopack `Operation not permitted / binding to a port`，可运行：

```bash
npm run build:webpack
```

相关文档：

- `docs/test-cases.md`：20 个 Beta 回归测试样例。
- `docs/evaluation-rubric.md`：输出质量评分量表。
- `docs/beta-user-guide.md`：试用用户说明。
- `docs/deployment-checklist.md`：部署准备清单。

## 部署准备

部署前确认：

- `.env` / `.env.local` 未提交。
- OpenAI 与数据库环境变量已在平台后端配置。
- `npm run typecheck`、`npm run lint`、`npm run build` 或 `npm run build:webpack` 通过。
- HTTPS、日志脱敏、文件上传限制、隐私政策和免责声明已准备。

## 当前限制

- 内置规则库不是完整法律数据库。
- AI 输出必须由律师核验，不得直接提交法院、仲裁机构或交易相对方。
- PDF 仅支持可提取文本，不支持扫描件 OCR。
- 暂无用户登录、权限、多租户、完整历史记录和正式报告管理。
- 暂未接入真实外部法律数据库、pgvector 和 embeddings。

## 后续路线

- 法条全文和案例摘要导入。
- pgvector / embeddings RAG。
- 引用 URL 校验和法条版本管理。
- 用户登录、历史记录和多租户权限。
- PDF 报告导出。
- OCR。
- 隐私政策、审计日志和更完整的合规配置。
