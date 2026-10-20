## 一个演示里包含的三种状态

本地 `langgraph_hitl/demo.py` 用一个模拟转账流程展示人工介入：先生成待审核信息，通过 `interrupt()` 暂停，再用 `Command(resume=...)` 传回决定。

这个例子只是字符串状态演示，没有真正调用支付接口。它仍然适合说明三个概念：业务状态、暂停载荷和恢复载荷。

| 概念 | 作用 |
| --- | --- |
| `TransferState` | 保存收款人、金额、审核结果等业务字段 |
| `interrupt(...)` 载荷 | 告诉外部调用方目前需要确认什么 |
| `Command(resume=...)` | 将外部决定传回暂停点 |

把三者分开，才能避免将前端显示状态直接当作后端授权事实。

## 线程标识是恢复入口

示例使用 `InMemorySaver` 编译图，并在两次调用中复用同一个 `thread_id`。没有稳定的线程标识，后续调用就无法定位之前暂停的那次运行。

```python
# 简化示意：graph 已配置 checkpointer
config = {"configurable": {"thread_id": "review-demo"}}

result = graph.invoke(initial_state, config=config)
if result.get("__interrupt__"):
    decision = {"approved": False}
    result = graph.invoke(Command(resume=decision), config=config)
```

内存保存器适合演示，不代表进程重启后还能找回状态。需要跨进程或重启恢复时，应选择持久化存储并设计线程与用户的归属关系。

## 恢复会重新进入中断节点

根据 [LangGraph 的 interrupts 文档](https://docs.langchain.com/oss/python/langgraph/interrupts)，恢复时会从发生中断的节点开头重新执行。因此，放在 `interrupt()` 之前的代码可能再次运行。

这直接影响外部副作用的放置位置。纯粹整理待审核信息通常可以重复；创建外部任务、写入账单或发送通知，则需要移到合适的阶段，或使用业务幂等键保护。

不要把“从暂停点恢复”理解成 Python 在某一行保留调用栈后继续。图的持久化状态和普通函数的内存执行现场是不同层面的概念。

## 示例中的默认批准需要改进

本地示例对字典载荷采用：

```python
approved = bool(interrupt_result.get("approved", True))
```

这有两个值得记录的边界：缺少 `approved` 时默认批准；字符串 `"false"` 经过 `bool()` 后也会得到真值。在正式授权流程中，建议使用显式字段与严格布尔类型校验。

```python
def validate_decision(payload):
    if not isinstance(payload, dict):
        raise ValueError("审核结果必须是对象")
    if type(payload.get("approved")) is not bool:
        raise ValueError("approved 必须显式提供布尔值")
    return payload["approved"]
```

这段是建议实现，未改动原演示。若审核期间允许修改业务参数，还需要重新校验修改后的金额、目标与权限，不能把“同意修改”直接等同于“修改结果合法”。

## 最小验证场景

- 明确拒绝：后续节点不能报告成功。
- 缺少审批字段：返回校验错误，而非默认通过。
- 字符串布尔值：拒绝 `"false"` 这样的含糊输入。
- 重复恢复或重复请求：外部动作不能重复产生。
- 服务重启：验证持久化与线程定位，而非只在单进程内演示。

人工介入不仅需要一个暂停按钮，还需要清楚的恢复契约和执行边界。本文基于本地演示与官方恢复语义整理，没有执行任何转账或外部任务。
