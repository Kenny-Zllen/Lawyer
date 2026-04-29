# 中国大陆法律 AI 工作台 MVP

面向律师、企业法务和中小企业主的“中国大陆民商事法律 AI 工作台”。当前版本支持 API 驱动的合同审查、法律检索辅助、法律文书生成、案件分析与诉讼文书助手、真实 OpenAI 兼容大模型调用、Prisma 数据库结构，以及 TXT / DOCX / PDF 文本解析。

## 当前功能

- Dashboard：`/`
- 合同审查：`/contract-review`
- 法律检索：`/legal-research`
- 文书生成：`/legal-drafting`
- 案件分析与诉讼文书助手：`/litigation-assistant`
- API routes：
  - `POST /api/contracts/upload`
  - `POST /api/contracts/review`
  - `POST /api/legal-research`
  - `POST /api/legal-drafting`
  - `POST /api/litigation-analysis`
- 合同上传支持 TXT / DOCX / PDF，限制 10MB
- DOCX/PDF 基础文本提取，暂不支持 OCR
- OpenAI API Key 缺失时返回明确 mock fallback
- DATABASE_URL 缺失或数据库不可用时继续使用内存 mock store
- 本地中国大陆民商事规则摘要库，覆盖合同、证据、民事诉讼、借贷、租赁、买卖、劳动、公司和侵权等基础场景

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
- Mammoth DOCX text extraction
- pdf-parse

## 环境变量

复制 `.env.example` 为 `.env.local`，按需填写：

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=
```

### 配置 OpenAI

填写：

```bash
OPENAI_API_KEY=你的 API Key
OPENAI_MODEL=gpt-4o-mini
```

所有 API Key 只在服务端读取，不会暴露到前端。未配置 `OPENAI_API_KEY` 时，API 不会崩溃，会返回 mock 示例结果，并在页面提示“当前未配置 AI API Key，无法调用真实大模型。”

### 配置数据库

当前 `prisma/schema.prisma` 使用 PostgreSQL provider，因为模型中包含 `Json` 字段。示例：

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/legal_ai?schema=public"
```

如果本地没有 PostgreSQL，MVP 仍可运行：上传合同会保存到内存 mock store，结果不会持久化。SQLite 可作为后续本地 fallback 方向，示例为：

```bash
DATABASE_URL="file:./dev.db"
```

如切换 SQLite，请同步确认 Prisma provider 和 Json 字段兼容性。

## Prisma 初始化

```bash
npm run prisma:generate
npm run prisma:migrate
```

如果未配置 `DATABASE_URL`，请先只运行应用或先配置 PostgreSQL；Prisma 迁移需要可连接的数据库。

## 本地运行

```bash
npm install
npm run prisma:generate
npm run dev
```

## 检查

```bash
npm run typecheck
npm run lint
npm run build
```

如果当前沙箱环境触发 Turbopack 的 `Operation not permitted / binding to a port`，可尝试：

```bash
npm run build:webpack
```

## Demo Flow

1. 合同审查：进入 `/contract-review`，上传 TXT / DOCX / PDF 或粘贴合同文本，填写审查视角，生成审查结果。
2. 法律检索：进入 `/legal-research`，选择法律领域并输入问题，查看权威来源和结构化分析。
3. 文书生成：进入 `/legal-drafting`，选择模板，填写主体、场景和关键条款，生成文书草稿。
4. 案件分析：进入 `/litigation-assistant`，填写诉讼角色、案件类型、案情、证据和问题，生成诉讼策略、证据缺口和文书草稿。

## 权威来源与检索

当前法律来源优先从 `data/legal-sources/*.json` 加载。`lib/legal/mainlandChinaLegalSources.ts` 保留为硬编码 fallback。内置数据是中国大陆民商事规则摘要库，不是完整法规库。每条来源包含：

- `sourceType`：法律、司法解释、证据规则、程序规则等
- `issuingAuthority`、`sourceName`、`effectiveDate`、`articleNumber`
- `content`：规则摘要，不编造完整法条原文
- `reliabilityLevel`：`official`、`high`、`medium`
- `legalArea`、`keywords`、`scenarioTags`

检索逻辑会综合关键词、来源名称、标题、规则摘要、法律领域、场景标签和可靠性评分。AI 只能基于检索到的 source context 输出；如果没有相关来源，应明确说明资料不足。

## 法律知识库维护与 RAG 预留

新增或编辑来源请参考 `docs/legal-source-authoring.md`。测试样例见 `docs/test-cases.md`。

当前检索链路：

- `loadLegalSources()`：读取并校验 `data/legal-sources/*.json`
- `legalSourceSchema.ts`：使用 Zod 校验来源结构
- `keywordRetriever`：当前实际使用的关键词和 scoring 检索
- `vectorRetriever`：stub，后续接 pgvector / embeddings
- `hybridRetriever`：当前调用 keyword retriever，未来合并 keyword + vector

后续计划：

- pgvector
- embeddings
- 法条全文导入
- 案例摘要导入
- 引用 URL 校验
- 法条版本管理

## 当前限制

- 法律知识库仍是本地规则摘要库，不是真实完整权威法律数据库，也不包含可检索的全量法条原文、案例库或裁判文书库。
- AI 必须基于 source context；资料不足时应输出“当前权威资料不足，无法基于现有资料给出可靠结论。”
- 规则摘要用于提高 MVP 检索质量，不应替代对最新官方文本、司法解释、地方规定和具体裁判规则的核验。
- PDF 仅做基础文本提取，不支持扫描件 OCR。
- 数据库未配置时使用内存 store，服务重启后数据会丢失。
- 当前没有用户登录、权限、多租户和完整历史记录界面。
- 输出不构成正式法律意见。

## Mock Fallback

当 `OPENAI_API_KEY` 缺失时，后端会返回 mock 示例结果，响应中带有 `aiMode: "mock"` 和提示信息。前端会显示“当前为 mock 示例结果，非真实 AI 分析。”

当 `DATABASE_URL` 缺失或数据库连接失败时，页面不会崩溃，后端会继续使用内存 mock store，并返回数据库不可用提示。

## 法域与免责声明

本产品仅支持中华人民共和国大陆法域，不支持港澳台及其他国家地区法律。

本工具仅提供 AI 生成的法律信息、合同审查和文书草稿支持，不构成正式法律意见。请在依赖任何输出前咨询合资格律师。

在没有合适数据保护措施前，请勿上传高度敏感、涉密或受律师保密特权保护的信息。

## 后续路线图

- 真实权威法律数据库
- pgvector RAG
- 用户登录
- 文档历史记录
- PDF 报告导出
- 权限与多租户
- OCR
