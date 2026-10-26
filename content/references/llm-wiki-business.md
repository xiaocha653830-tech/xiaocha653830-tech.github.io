# LLM Wiki 与业务问数的资料核对

本文依据既有对话材料讨论方案，没有部署或评测 Wiki 系统。

## 知识维护

[Karpathy 的原始说明](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)描述原始素材、Wiki 页面和维护规则的分工，并包含摄取、查询与定期检查流程。它是可调整的组织模式，不代表所有实现都采用同一套工具。

## 问数流程

[LangChain 的 SQL Agent 示例](https://docs.langchain.com/oss/python/langchain/sql-agent)展示查看表结构、生成和检查 SQL、执行查询及依据结果回答的过程。把 Wiki 作为业务上下文是本文讨论的接入方案，未在该示例中验证。

## 结论边界

资料说明了机制与接入位置，不能证明本文项目的检索准确率、回答延迟或成本已经改善。对话里的“特供款”沿用原稿中的示例，不代表实际业务定义。
