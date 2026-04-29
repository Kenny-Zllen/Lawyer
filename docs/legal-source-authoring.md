# 法律来源维护说明

法律来源 JSON 位于：

```text
data/legal-sources/
```

建议按主题拆分文件，例如：

- `contract.json`
- `procedure.json`
- `evidence.json`
- `labor.json`
- `company.json`
- `lending.json`
- `lease.json`
- `sales.json`
- `tort.json`
- `privacy.json`

每个文件是一个 JSON 数组，数组元素结构与 `AuthoritativeLegalSource` 对齐。

## 字段说明

- `id`：全局唯一 ID，新增时不得重复。
- `title`：在 UI 中展示的规则标题。
- `sourceType`：来源类型，可选 `law`、`judicial_interpretation`、`evidence_rule`、`procedural_rule`、`guiding_case`、`court_case`、`government_guidance`、`other`。
- `issuingAuthority`：发布机关。
- `sourceName`：法律、司法解释或规则文件名称。
- `url`：可选，官方或可信来源链接。
- `effectiveDate`：可选，生效日期。
- `articleNumber`：可选，条文号或“相关规则”说明。
- `content`：规则摘要。不是完整法条原文时，必须以“规则摘要：”开头。
- `jurisdiction`：只能是“中国大陆”。
- `reliabilityLevel`：`official`、`high`、`medium`。
- `legalArea`：法律领域标签数组。
- `keywords`：检索关键词数组。
- `scenarioTags`：业务场景标签数组。

## 规则摘要写法

当前内置数据不是完整权威法律数据库。新增来源时，应写清楚规则摘要的边界，不要把摘要写成完整法条原文。

推荐格式：

```text
规则摘要：……
```

## 可靠性标注

- `official`：全国人大、国务院、最高人民法院等官方法律法规或规范性文件。
- `high`：司法解释、权威司法文件或高度可信的官方规则摘要。
- `medium`：政府指引、行业规范或其他辅助性材料。

## keywords 与 scenarioTags

`keywords` 用于匹配用户输入中的词，例如“违约金”“证据”“民间借贷”。

`scenarioTags` 用于描述业务场景，例如“逾期交付”“起诉条件”“电子证据”。

关键词应覆盖：

- 常见法律概念
- 用户自然语言可能输入的词
- 文书或案件场景词

## 禁止事项

- 不允许伪造案例、案号、裁判规则。
- 不允许伪造完整法条原文。
- 不允许把规则摘要描述为完整权威法律数据库。
- 不允许加入港澳台或境外法域内容。

## 示例

```json
{
  "id": "civil-code-contract-liquidated-damages",
  "title": "违约金调整规则摘要",
  "sourceType": "law",
  "issuingAuthority": "全国人民代表大会",
  "sourceName": "中华人民共和国民法典 合同编",
  "url": "https://flk.npc.gov.cn/",
  "effectiveDate": "2021-01-01",
  "articleNumber": "第五百八十五条",
  "content": "规则摘要：当事人可以约定一方违约时根据违约情况支付一定数额违约金，也可以约定损失赔偿额的计算方法。约定违约金过分高于或低于造成损失的，可能涉及司法调整。",
  "jurisdiction": "中国大陆",
  "reliabilityLevel": "official",
  "legalArea": ["合同", "争议解决"],
  "keywords": ["违约金", "违约", "调减", "损失"],
  "scenarioTags": ["违约金主张", "违约金抗辩", "损失证明"]
}
```

## 新增后测试

```bash
npm run typecheck
npm run lint
```

然后访问 `/legal-research`，输入与新增来源相关的问题，确认命中的 source id 或标题符合预期。
