# 中国大陆法律 AI 工作台 MVP

第一阶段骨架：面向中国大陆民商事合同场景的前端 MVP，支持合同审查、法律检索辅助和法律文书生成的 mock 交互。

## 范围

- Next.js App Router + React + TypeScript
- Tailwind CSS + shadcn/ui 风格基础组件
- Lucide React 图标
- 本地 mock 中国大陆权威法律来源
- 不接真实 OpenAI API
- 不接真实数据库
- 不解析真实上传文件

## 页面

- `/`：Dashboard
- `/contract-review`：合同审查
- `/legal-research`：中国大陆法律检索辅助
- `/legal-drafting`：法律文书生成

## 法域与免责声明

本产品仅支持中华人民共和国大陆法域，不支持港澳台及其他国家地区法律。

所有页面均展示：

> 本工具仅提供 AI 生成的法律信息、合同审查和文书草稿支持，不构成正式法律意见。请在依赖任何输出前咨询合资格律师。

含上传或敏感输入场景展示：

> 在没有合适数据保护措施前，请勿上传高度敏感、涉密或受律师保密特权保护的信息。

## 本地运行

```bash
npm install
npm run dev
```

## 检查

```bash
npm run typecheck
npm run lint
npm run build
```
