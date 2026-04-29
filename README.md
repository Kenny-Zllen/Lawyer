# 中国大陆法律 AI 工作台 MVP

面向律师、企业法务和中小企业主的“中国大陆民商事合同 AI 工作台”。当前第三阶段支持 API 驱动的合同审查、法律检索辅助、法律文书生成、真实 OpenAI 兼容大模型调用、Prisma 数据库结构，以及 TXT / DOCX / PDF 文本解析。

## 当前功能

- Dashboard：`/`
- 合同审查：`/contract-review`
- 法律检索：`/legal-research`
- 文书生成：`/legal-drafting`
- API routes：
  - `POST /api/contracts/upload`
  - `POST /api/contracts/review`
  - `POST /api/legal-research`
  - `POST /api/legal-drafting`
- 合同上传支持 TXT / DOCX / PDF，限制 10MB
- DOCX/PDF 基础文本提取，暂不支持 OCR
- OpenAI API Key 缺失时返回明确 mock fallback
- DATABASE_URL 缺失或数据库不可用时继续使用内存 mock store

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

## 当前限制

- 法律知识库仍是本地 mock 数据，不是真实权威法律数据库。
- AI 必须基于 source context；资料不足时应输出“当前权威资料不足，无法基于现有资料给出可靠结论。”
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
