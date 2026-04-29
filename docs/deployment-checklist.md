# Beta 部署准备清单

## 本地运行检查

- 确认当前分支为待部署分支。
- 确认 `.env`、`.env.local` 未被 Git 跟踪。
- 执行依赖安装和 Prisma Client 生成：

```bash
npm install
npm run prisma:generate
```

## 环境变量检查

必须在部署平台的后端环境变量中配置：

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=
```

- `OPENAI_API_KEY` 不得写入前端代码或提交到仓库。
- `OPENAI_MODEL` 应使用当前账户可调用的模型。
- `DATABASE_URL` 建议使用 PostgreSQL，需与 `prisma/schema.prisma` provider 匹配。

## 质量检查

```bash
npm run typecheck
npm run lint
npm run build
```

如果本地沙箱触发 Turbopack `Operation not permitted / binding to a port`，可使用：

```bash
npm run build:webpack
```

## Vercel / Railway / Render 注意事项

- 确认 Node.js 版本与 Next.js 版本兼容。
- 在平台环境变量中配置 OpenAI 和数据库。
- 文件上传限制当前为 10MB，部署平台也应设置相同或更高限制。
- DOCX 导出 API 不依赖数据库，但依赖服务端运行环境。
- Prisma 迁移应在受控环境执行，不要在生产请求中自动迁移。

## HTTPS 与隐私

- 小范围试用也应使用 HTTPS。
- 日志不得记录完整合同、案情、证据材料或 API Key。
- 错误日志只记录错误名称和摘要。
- 上线前准备隐私政策和免责声明页面或说明文档。

## 小范围试用前检查

- 四个模块均能生成结果。
- 四个模块均能导出 Word。
- OpenAI 不可用时能显示 fallback 提示。
- 数据库不可用时不影响页面展示。
- 法律来源不足时能提示补充背景和人工核验。
- 试用用户已知晓：输出不构成正式法律意见，不能直接提交法院或作为最终法律意见使用。
