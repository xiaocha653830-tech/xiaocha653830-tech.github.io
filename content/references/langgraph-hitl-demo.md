# 人工介入示例的核对笔记

这份项目内资料摘录了用于《LangGraph 人工介入》一文的演示结构，便于读者核对文章中的推断。演示代码没有连接支付服务，不会执行转账。

## 状态和暂停点

演示定义 `TransferState`，包含 `recipient`、`amount`、`memo`、`approved` 与 `final_status`。`review_transfer` 用 `interrupt()` 返回待审核信息；恢复载荷可以是布尔值或字典。

```python
pending_transfer = {
    "recipient": state["recipient"],
    "amount": state["amount"],
    "memo": state["memo"],
}
interrupt_result = interrupt({
    "title": "转账审核",
    "pending_transfer": pending_transfer,
})
```

此处仅展示与文章论点有关的短片段。原演示中的 `execute_transfer` 只返回“人工审核成功，转账成功”等状态文字。

## 恢复方式

演示以 `InMemorySaver` 编译图，用同一个 `thread_id` 首次运行和恢复：

```python
config = {"configurable": {"thread_id": "abc"}}
result = graph.invoke(initial_state, config=config)
result = graph.invoke(Command(resume=interrupt_result), config=config)
```

`InMemorySaver` 只适合本地演示；进程重启后的恢复需要持久化 checkpointer。恢复时中断节点从开头重新运行的行为，可参阅 [LangGraph 官方文档](https://docs.langchain.com/oss/python/langgraph/interrupts)。

## 原演示的边界

原演示使用 `bool(interrupt_result.get("approved", True))` 解释字典载荷。缺失字段会默认批准，字符串 `"false"` 也会被转换成真值。文章中给出的严格校验是建议写法，不能理解为原演示已采用。
