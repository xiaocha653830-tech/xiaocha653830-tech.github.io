# 在场 · Tech Notes

**在场**是我的个人技术博客，记录阅读源码、动手实践和复盘问题的过程。内容围绕大模型应用与软件工程展开，重点是把实现路径、设计取舍和仍待验证的边界说清楚。

**网站地址：**[xiaocha653830-tech.github.io](https://xiaocha653830-tech.github.io/)

## 内容方向

- **RAG 与检索**：文档导入、切片、混合检索、RRF 融合与重排。
- **Agent 工作流**：状态管理、人工介入、恢复机制与元数据组织。
- **数据工程**：任务投递、并发守卫、质量规则与故障复盘。
- **Python 工具**：围绕文档整理等日常工作编写和检视工具。

文章从具体问题出发，结合项目代码与学习笔记展开。源码解读会标注对应的 GitHub 文件；对于尚未实现的功能和历史故障，也会说明核对范围。

## 从这些文章开始

- [RAG 双管线：从文档导入到四路检索](https://xiaocha653830-tech.github.io/#/post/rag-pipelines)
- [RRF 与 Rerank：多路结果到底在哪里汇合](https://xiaocha653830-tech.github.io/#/post/rrf-rerank)
- [Outbox 与租约守卫：让后台任务有据可查](https://xiaocha653830-tech.github.io/#/post/outbox-fencing)
- [LangGraph 人工介入：暂停之后如何安全恢复](https://xiaocha653830-tech.github.io/#/post/langgraph-interrupt)

[浏览全部文章](https://xiaocha653830-tech.github.io/#/archive) · [按专题阅读](https://xiaocha653830-tech.github.io/#/topics) · [查看项目实践](https://xiaocha653830-tech.github.io/#/projects)

目前的文章主要关联 [RAG-KnowledgeBase](https://github.com/xiaocha653830-tech/RAG-KnowledgeBase)、[ETL-Agent](https://github.com/xiaocha653830-tech/ETL-Agent) 和 [Deep-Agent](https://github.com/xiaocha653830-tech/Deep-Agent)。博客会随着项目实践继续更新。
