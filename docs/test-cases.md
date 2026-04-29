# Demo 测试用例

当前测试用例用于验证内置 JSON 规则摘要库和关键词检索质量。所有命中结果仍需人工核验正式法律文本。

## 法律检索

| 问题 | 预期命中来源 | 可靠性 | 说明 |
| --- | --- | --- | --- |
| 服务合同中未约定逾期交付违约金，甲方如何降低争议风险？ | `civil-code-contract-breach-damages`、`civil-code-contract-liquidated-damages`、`supreme-court-contract-interpretation-general` | official / high | 当前为规则摘要，不是完整法条原文。 |
| 民间借贷只有转账记录没有借条，如何证明借贷关系？ | `private-lending-proof-interest`、`civil-evidence-electronic-data`、`civil-procedure-evidence-burden` | high / official | 需结合真实证据原件和交易背景。 |
| 房屋租赁押金不退，承租人应该准备哪些证据？ | `civil-code-lease-contract`、`civil-procedure-evidence-burden` | official | 需核验租赁合同、付款记录和交接记录。 |
| 买卖合同货款逾期未付，如何起诉？ | `civil-code-sales-contract`、`civil-code-contract-breach-damages`、`civil-procedure-filing-jurisdiction` | official | 程序和实体规则均需核验。 |
| 微信聊天记录能否作为证据？ | `civil-evidence-electronic-data`、`civil-procedure-evidence-burden` | high / official | 电子数据需要关注原始载体和完整性。 |
| 公司股东想查账，如何准备诉讼材料？ | `company-law-shareholder-dispute`、`civil-procedure-filing-jurisdiction` | official | 需核验公司法最新文本和章程。 |

## 合同审查

| 场景 | 预期命中来源 | 说明 |
| --- | --- | --- |
| 服务合同缺少验收和违约责任 | `civil-code-contract-general-performance`、`civil-code-contract-breach-damages` | 输出应提醒交付、验收、违约责任和证据留存。 |
| 违约金过高或过低 | `civil-code-contract-liquidated-damages`、`supreme-court-contract-interpretation-general` | 输出应提示损失证明和司法调整风险。 |

## 案件分析

| 场景 | 预期命中来源 | 说明 |
| --- | --- | --- |
| 原告起诉服务合同逾期交付 | `civil-code-contract-breach-damages`、`civil-procedure-filing-jurisdiction`、`civil-procedure-evidence-burden` | 应生成起诉状、代理词、证据缺口和对方抗辩预判。 |
| 被告应对民间借贷纠纷 | `private-lending-proof-interest`、`civil-evidence-electronic-data` | 应生成答辩状和借贷事实、利息、还款抗辩思路。 |

## 重要限制

- 当前来源是内置 JSON 规则摘要库，不是完整权威法律数据库。
- `official` 表示来源层级较高，不表示摘要等同完整法条原文。
- 所有输出都应由合资格律师结合最新官方文本、证据原件和案件事实核验。
