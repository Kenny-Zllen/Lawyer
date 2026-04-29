# Beta 回归测试样例

当前测试样例用于验证四个模块、内置 JSON 规则摘要库、关键词检索、fallback 和 DOCX 导出。所有命中结果仍需人工核验正式法律文本。

| # | 场景 | 推荐模块 | 输入示例 | 预期输出重点 | 预期命中法律来源 | 评分关注点 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 服务合同逾期交付 | 合同审查 / 案件分析 | 服务方逾期 30 日，合同未约定违约金。 | 交付验收、催告、损失证明、违约责任。 | `civil-code-contract-breach-damages`、`civil-code-contract-liquidated-damages` | 违约责任和证据建议是否具体。 |
| 2 | 买卖合同质量争议 | 法律检索 / 案件分析 | 买方收货后发现质量问题，已付款一半。 | 质量异议、验收、修理更换退货、损失。 | `civil-code-sales-contract`、`civil-procedure-evidence-burden` | 是否提示验收记录和质量证明。 |
| 3 | 民间借贷无借条但有转账 | 法律检索 / 案件分析 | 只有转账记录和聊天记录，对方否认借款。 | 借贷合意、转账性质、电子数据。 | `private-lending-proof-interest`、`civil-evidence-electronic-data` | 是否避免仅凭转账断言借贷成立。 |
| 4 | 租赁押金返还 | 法律检索 / 文书生成 | 房东拒退押金，称房屋损坏。 | 押金返还、交接记录、维修损失证明。 | `civil-code-lease-contract`、`civil-procedure-evidence-burden` | 证据清单是否可执行。 |
| 5 | 劳动者未签劳动合同 | 法律检索 | 入职 8 个月未签书面劳动合同。 | 劳动关系证明、工资社保、仲裁路径。 | `labor-contract-written-contract` | 是否提示劳动争议程序和证据。 |
| 6 | 公司股东知情权 | 案件分析 | 小股东要求查阅会计账簿被拒。 | 股东资格、前置请求、公司拒绝理由。 | `company-law-shareholder-dispute` | 是否要求章程、持股和书面请求证据。 |
| 7 | 被告违约金过高抗辩 | 案件分析 | 原告主张合同总价 50% 的违约金。 | 违约金调整、实际损失、过高抗辩。 | `civil-code-contract-liquidated-damages` | 抗辩思路是否平衡且有证据要求。 |
| 8 | 原告起诉解除合同 | 文书生成 / 案件分析 | 对方长期迟延履行，已多次催告。 | 解除条件、通知、返还和赔偿请求。 | `civil-code-contract-termination`、`civil-code-contract-breach-damages` | 起诉状请求是否明确。 |
| 9 | 电子聊天记录作为证据 | 法律检索 | 微信记录能否证明对方承诺付款。 | 原始载体、完整性、身份对应。 | `civil-evidence-electronic-data` | 是否提示电子数据真实性核验。 |
| 10 | 合同管辖条款争议 | 法律检索 | 合同约定甲方所在地法院，乙方异地。 | 协议管辖、连接点、管辖异议。 | `civil-procedure-filing-jurisdiction` | 是否提示程序期限由律师核验。 |
| 11 | 侵权损害赔偿 | 案件分析 | 对方施工损坏设备，需索赔维修费。 | 侵权构成、损失金额、因果关系。 | `civil-code-tort-liability` | 损失和因果证据是否充分。 |
| 12 | 个人信息处理合规 | 法律检索 / 合同审查 | SaaS 服务中收集客户员工信息。 | 告知同意、最小必要、委托处理。 | `personal-information-protection-basic` | 是否提示隐私合规边界。 |
| 13 | 乙方服务未经验收但要求付款 | 合同审查 / 案件分析 | 服务成果未验收，乙方要求尾款。 | 验收条件、付款触发、履行证明。 | `civil-code-contract-general-performance` | 是否识别验收与付款关联。 |
| 14 | 甲方拖欠服务费 | 文书生成 / 案件分析 | 服务已完成，甲方拖欠 3 个月费用。 | 催告函、付款请求、违约责任。 | `civil-code-contract-breach-damages` | 文书格式和证据附件是否完整。 |
| 15 | 劳动合同违法解除 | 法律检索 / 案件分析 | 公司口头辞退员工，无解除通知。 | 劳动关系、解除理由、赔偿或恢复劳动关系。 | `labor-contract-written-contract` | 是否提示仲裁和工资社保证据。 |
| 16 | 房屋租赁提前退租 | 法律检索 / 文书生成 | 承租人提前退租，出租人要求全部租金。 | 解除、押金、空置损失、减损义务。 | `civil-code-lease-contract` | 是否提示交接、招租和损失证明。 |
| 17 | 股权转让价款争议 | 合同审查 / 案件分析 | 股权已变更登记，受让方未付尾款。 | 付款条件、登记事实、违约责任。 | `company-law-shareholder-dispute`、`civil-code-contract-breach-damages` | 是否避免虚构公司章程条款。 |
| 18 | 货物交付后质量异议 | 法律检索 / 案件分析 | 买方使用后 2 个月提出质量异议。 | 验收、质量异议期限、鉴定。 | `civil-code-sales-contract` | 是否提示检验记录和鉴定证据。 |
| 19 | 被告主张诉讼时效抗辩 | 案件分析 | 原告多年后起诉追讨服务费。 | 时效起算、中断、中止、催收证据。 | `civil-procedure-filing-jurisdiction`、`civil-code-contract-breach-damages` | 是否提示时效需律师核验。 |
| 20 | 原告证据不足时补强 | 案件分析 | 只有部分聊天记录，无合同原件。 | 证据缺口、证明目的、补强路径。 | `civil-procedure-evidence-burden`、`civil-evidence-electronic-data` | missingEvidence 是否具体。 |

## 回归检查

- 四个模块均能在 OpenAI 不可用时返回系统 fallback 示例结果。
- 四个模块均能在有结果后导出 Word。
- 数据库不可用时页面显示“当前结果未写入数据库，但不影响本次分析展示。”
- 法律来源不足时显示“当前内置规则库未检索到足够相关依据，请补充问题背景或由律师核验正式法律文本。”
- 所有输出均保留中国大陆法域限制和免责声明。
