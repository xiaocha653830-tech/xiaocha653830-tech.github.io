// 由 scripts/build-content.mjs 生成，请编辑 content/ 中的源文件。
window.BLOG_CONTENT = {
  "updated": "2026-10-28",
  "topics": [
    {
      "id": "rag",
      "name": "RAG 与检索",
      "english": "Retrieval",
      "symbol": "R",
      "description": "从文档导入到证据排序，沿着数据流理解知识库。",
      "articles": [
        "rag-pipelines",
        "chunk-contract",
        "rrf-rerank",
        "llm-wiki-business"
      ]
    },
    {
      "id": "agent",
      "name": "Agent 工作流",
      "english": "Agent workflows",
      "symbol": "A",
      "description": "状态、人工介入与元数据，把智能体的边界说清楚。",
      "articles": [
        "langgraph-interrupt",
        "metadata-boundaries",
        "deepagent-latency"
      ]
    },
    {
      "id": "engineering",
      "name": "数据工程",
      "english": "Data engineering",
      "symbol": "E",
      "description": "投递、执行、编码与回读，从失败路径理解可靠性。",
      "articles": [
        "outbox-fencing",
        "unicode-roundtrip"
      ]
    },
    {
      "id": "python",
      "name": "Python 工具",
      "english": "Python tooling",
      "symbol": "P",
      "description": "把重复劳动写成工具，也把工具的适用范围记录下来。",
      "articles": [
        "docx-markdown"
      ]
    }
  ],
  "projects": [
    {
      "id": "knowledge-base",
      "name": "知识库检索管线",
      "path": "https://github.com/xiaocha653830-tech/RAG-KnowledgeBase",
      "status": "源码结构已核对",
      "description": "文档导入与查询双图，涉及 Milvus、HyDE、RRF 和模型重排。本次整理聚焦数据契约与版本差异。",
      "stack": [
        "Python",
        "LangGraph",
        "Milvus"
      ],
      "articles": [
        "rag-pipelines",
        "chunk-contract",
        "rrf-rerank"
      ]
    },
    {
      "id": "etl-agent",
      "name": "ETL-Agent",
      "path": "https://github.com/xiaocha653830-tech/ETL-Agent",
      "status": "局部实现核对",
      "description": "自然语言数据集成控制面，本文选取运行投递、租约守卫和规则回读。README 的历史测试记录与本次静态核对分别注明。",
      "stack": [
        "FastAPI",
        "SQLAlchemy",
        "Celery"
      ],
      "articles": [
        "outbox-fencing",
        "unicode-roundtrip"
      ]
    },
    {
      "id": "deep-agent",
      "name": "数据智能体骨架",
      "path": "https://github.com/xiaocha653830-tech/Deep-Agent",
      "status": "骨架 / 待实现",
      "description": "已有多存储客户端与仓储边界，元数据构建方法仍为日志骨架。整理其设计意图与下一步需要补齐的闭环。",
      "stack": [
        "MySQL",
        "Qdrant",
        "Elasticsearch"
      ],
      "articles": [
        "metadata-boundaries"
      ]
    },
    {
      "id": "docx-tools",
      "name": "文档整理工具",
      "path": "https://github.com/xiaocha653830-tech/xiaocha653830-tech.github.io/tree/main/content/references",
      "status": "工具源码已核对",
      "description": "按顺序转换 Word 段落与表格，识别代码样式并生成 Markdown；同时记录标题识别、图片与质量检查的限制。",
      "stack": [
        "Python",
        "python-docx",
        "Markdown"
      ],
      "articles": [
        "docx-markdown"
      ]
    }
  ],
  "articles": [
    {
      "id": "deepagent-latency",
      "title": "DeepAgent 已经并行，为什么还要等八分钟？",
      "summary": "从一次 518 秒的旅行规划，检查任务范围、接口限流和 MCP 返回冗余，讨论怎样减少等待与模型往返。",
      "category": "Agent 工作流",
      "topic": "agent",
      "tags": [
        "DeepAgent",
        "MCP",
        "LangSmith",
        "性能分析"
      ],
      "kind": "运行分析",
      "date": "2026-10-28",
      "updated": "2026-10-28",
      "order": -1,
      "level": "入门",
      "status": "运行记录与方案分析",
      "scope": "核对 LangSmith 页面中的节点耗时、任务输入及可见工具返回；未完成逐节点 token 与重试统计，优化建议尚未实测。",
      "sources": [
        {
          "path": "content/references/deepagent-latency.md",
          "start": 1,
          "end": 21,
          "repository": "xiaocha653830-tech.github.io",
          "url": "https://github.com/xiaocha653830-tech/xiaocha653830-tech.github.io/blob/main/content/references/deepagent-latency.md#L1-L21"
        }
      ],
      "markdown": "两个子任务已经同时发出，用户却要等八分多钟才能拿到旅行方案。\n\n这是我做 DeepAgent 旅行助手时遇到的问题。项目接了高德和 12306 两个 MCP 服务，分别处理地图与票务信息。我最初和 DeepSeek 抱怨，任务耗时久，token 花费多，生成的内容还又多又杂。\n\n讨论很快转向并行。DeepSeek 建议修改主代理的提示词，让地图和票务子代理同时工作。但我去看 LangSmith，发现原来的两个 `task` 就已经同时发出了。\n\n后来回到这次武汉到北京两日游的运行记录，等待才有了更具体的轮廓。\n\n| 页面中的运行 | 耗时 | 覆盖的工作 |\n| --- | --- | --- |\n| 整次运行 | 518.13 秒，约 8.6 分钟 | 从接收问题到完成回复 |\n| 地图子代理 `map_agent` | 371.72 秒，约 6.2 分钟 | 地图领域的整项任务 |\n| 汇总代理 `summary_agent` | 82.90 秒，约 1.4 分钟 | 后续报告整理与文件处理 |\n\n\u003cdiv class=\"trace-comparison\">\n  \u003ca href=\"./assets/deepagent/travel-waterfall.png\" title=\"查看原始调用瀑布图\">\u003cimg src=\"./assets/deepagent/travel-waterfall.png\" alt=\"原始调用瀑布图，点击查看大图\" width=\"398\" height=\"941\" loading=\"lazy\">\u003c/a>\n  \u003ca href=\"./assets/deepagent/travel-sequence.svg\" title=\"查看调用时序图\">\u003cimg src=\"./assets/deepagent/travel-sequence.svg\" alt=\"主代理并行派发地图和票务任务，结果汇合后整理并交给汇总代理，最后返回用户\" width=\"662\" height=\"557\" loading=\"lazy\">\u003c/a>\n\u003c/div>\n\n*图 1　左侧为原始调用瀑布图，右侧为 Mermaid 绘制的主要调用时序。两图均可点击放大；纵向间距不代表实际耗时比例。* [Mermaid 源码](./assets/deepagent/travel-sequence.mmd)\n\n这三个数字来自[同一条 LangSmith trace](https://smith.langchain.com/o/b5ed5e99-fce4-454b-ad9f-2a52b6c54a5a/a/travel-agent-debug/projects/p/7d950f1a-61d5-4958-87e1-5d907d1a916b?peek=01a17cac-b007-75b0-a1c9-e7d34d5d49d8&peeked_trace=01a17cac-616b-7236-b060-cd39d9b75317&runTab=details)。整次运行已经包含各阶段，地图节点也包含内部的模型和工具调用，不能把表中的数字直接相加。371.72 秒对应的是地图子任务，不能据此说高德某个接口响应了六分钟。\n\n接下来值得追问的，是地图子任务接到了多大的工作，以及查完以后为什么还需要那么久。\n\n## 地图助手接到的，已经是一份完整攻略\n\n主代理交给 `map_agent` 的指令，比“查几个景点的交通路线”展开了很多。\n\n它要求从一批经典景点中覆盖 6—8 个，查询位置、开放情况、门票与预约信息，再安排两天的景点顺序。交通部分既要查景点之间的路线，也要考虑北京西站、北京南站、北京丰台站到酒店区域或首站景点的接驳。最后还要补天气，交付一个推荐方案和一个备选方案。\n\n![地图子任务的派发参数、内部调用与攻略输出](./assets/deepagent/map-task.png)\n\n*图 2　展开 371.72 秒的任务，可以看到 `task` 派发给了 `map_agent`，返回内容已经是一份景点与市内交通方案。*\n\n其中有些工作确实能帮助规划，但它们都要付出查询和判断成本。尤其在车次和到站位置还没确定时，同时研究多个车站的接驳，就会提前展开一些最后未必用得上的路线。\n\n工具调用记录也呈现出几个阶段。子代理先查询景点和天气，随后获取 POI 详情，再解析车站等地点的位置，准备查询关键交通路线。这里有些先后顺序有实际原因。地点搜索返回的字段不够时，需要继续拿到坐标，才能计算路线，不能把所有后续调用都算成多余工作。\n\n但查询范围可以更早收敛。先选出本次两日游真正需要的少量候选，再详细查相关地点；确定候选车站以后，再查对应接驳。需要比较多个车站时，也应当让比较服务于选车次，而非默认替所有车站各做一份完整方案。\n\n这一步调整的是任务本身。只在原指令后面加一句“请并行执行”，这些工作仍然都要有人完成。\n\n## 同时开始，也要等较慢的任务结束\n\n把这次运行想成两个人一起准备旅行资料，就容易理解剩下的等待了。\n\n一个人查车票，另一个人查地图。两个人同时开始，确实可以省掉排队的时间。但如果完整行程需要两份资料，就仍然要等较慢的那个人。地图这边花了六分多钟，另一边即使先完成，最终方案也不能因此提前齐备。两份资料到齐之后，整理报告又是后面的一段工作。\n\n这也能帮助理解[阿姆达尔定律](https://www3.cs.stonybrook.edu/~rezaul/Spring-2012/CSE613/reading/Amdahl-1967.pdf)的提醒。固定任务里，那些必须按顺序完成的部分，会限制增加并行带来的提速。至于哪个并行分支拖到最后，还要具体看每条分支做了多久。本文不需要用公式计算上限，先找出用户还在等哪件事，就能决定下一步查哪里。\n\n异步子代理解决的是另一项等待。按 [Deep Agents 的文档](https://docs.langchain.com/oss/python/deepagents/async-subagents)，同步子代理可以并行执行，同时让主代理等待结果；异步子代理则允许主代理派发后继续工作，之后再取结果。\n\n这对中途响应用户和调整任务有价值。不过，只要最终行程依赖地图结果，地图没有查完，这份行程仍然没有完成。把任务搬到后台，或者部署到另一台机器，都不会自动缩短其中的查询与模型调用。\n\n## 高德已经返回限流，继续加并发未必合适\n\n这次工具返回里，出现了一条比“感觉接口慢”更具体的线索。\n\n`maps_text_search` 返回过 `Text Search failed: CUQPS_HAS_EXCEEDED_THE_LIMIT`，`maps_search_detail` 也返回过同类限制信息。这证明这次执行中发生了限流。\n\n因此，优化还要检查请求发出的节奏。并发适合让互不依赖的工作一起执行，但外部服务能够接住多少请求，是另一项约束。把更多请求挤到同一时刻，可能只会得到更多失败结果，随后又要花时间处理失败。\n\n可以在调用层限制同一服务的并发和请求频率。遇到限流时，按规则等待后有限重试；仍然失败，就返回已取得的数据和明确缺口。限制需要由程序执行，提示词里的“不要重试太多次”无法代替它。\n\n不过，这条错误还不足以解释全部六分钟。当前没有逐个核算所有请求的耗时和重试过程，不能把限流直接写成唯一原因，也没有证据说子代理陷入了无限循环。文章能够确认到的地方，是限流已经发生，请求调度需要考虑服务容量。\n\n## 多接几个 MCP，不必再多套几层代理\n\n聊到单个子代理耗时，我担心继续拆子代理会增加更多模型调用。DeepSeek 随后建议把地图与票务工具直接交给主代理，我又提出了未来的约束。现在只有两个 MCP 服务，后面可能接十几个甚至更多。\n\n这个问题需要同时看执行轮次和上下文。把工具全放到主代理，可能省掉委派，却让主代理面对更多工具定义和业务规则。每个服务各配一个子代理，又可能增加本来不需要的模型决策。\n\n比较适合继续验证的方向，是保留地图、票务等业务入口，把内部已经确定的步骤交给代码。地点已经选好，按 POI ID 取详情、核对城市、筛掉无关字段，可以走固定流程；要在多个景点组合间作出选择，再让模型参与。[LangGraph 对工作流与 Agent 的区分](https://docs.langchain.com/oss/python/langgraph/workflows-agents)也允许这种结合，固定处理与动态判断可以放在同一个业务流程里。\n\n这样，拆分工作不必对应更多代理。模型负责需要理解和取舍的部分，程序负责明确的查询与校验，也就少了一些“解释任务、重新理解、再整理一次”的往返。\n\n服务增加时，还可以收窄当前模型能看到的工具。[LangChain 的上下文工程文档](https://docs.langchain.com/oss/python/langchain/context-engineering#selecting-tools)提供了动态选择工具的机制。是否需要独立子代理，则要看领域知识、工具规模与上下文隔离的收益，[多代理文档](https://docs.langchain.com/oss/python/langchain/multi-agent/index)也把这些列为选型依据。单凭 MCP 的数量，还不能决定代理应该有几层。\n\n## 数据进来以后，模型还在处理什么\n\n等待之外，我最初提到的“内容又多又杂”，在工具返回里也能找到具体例子。\n\n一次故宫搜索，除了故宫博物院，还返回了检票处、午门、角楼和多个院内建筑，许多条目带着照片链接、分类代码和空字段。天气查询也返回了多个日期，以及重复表示的温度。两日游真正需要的，只是选定景点的必要信息和行程日期内的天气，原始响应明显超出了这个范围。\n\n这些内容全部进入上下文，模型就要先从大量候选中挑选，再判断哪些字段值得保留。工具返回得越多，后续需要阅读和整理的材料也越多。因此，限制应该同时落在查询行为和返回数据上。\n\n提示词可以先约束查询范围与数量。例如，只查询指定城市和日期，先筛出少量符合行程的景点，再查详情，不主动扩展到所有附属地点。对子代理的最终返回，也可以约定候选条数和必要字段，保留地点、POI ID、位置及路线所需信息，避免再附上一整篇攻略。这能减少无关查询和交给主代理的冗余内容。\n\n对于一次就返回大量数据的 MCP 工具，还需要在调用参数或代码里控制体量。工具支持时，设置条数、分页和返回字段；不支持时，在结果进入模型前，按已确定的条件筛选候选，去掉照片链接、空字段和重复数据。只要求模型“最后回答简短”，整份原始响应仍然已经被读入。筛选时也要保留后续规划所需的标识与坐标，避免为了压缩内容又补查一轮。\n\n## 写在最后\n\n这次八分多钟的运行，让最初那个“再加一点并行”的想法有了具体边界。两个子任务同时开始，地图助手仍然要完成一整份攻略研究，处理大量候选和原始字段，期间还遇到了限流。这些已经看到的工作与错误，比代理数量更能帮助判断下一步该改哪里。\n\n对这个旅行助手，值得继续验证的方向是保留地图与票务的业务分工，先收窄每次派发的任务，再控制外部请求的节奏。确定的查询、筛选和校验交给代码，需要理解与取舍的地方再让模型参与。业务扩展时，工具可以按需提供，避免每增加一个服务，就增加一层模型往返。\n\n这些调整能省下多少时间和 token，还需要用相同问题重跑才能回答。核对时既要看等待有没有缩短，也要看景点、车站和时间条件是否仍然正确。少查无关内容、少做重复判断，同时保留规划所需的依据，才是这次分析之后值得检验的改进。\n\n---\n\n本文根据[与 DeepSeek 的聊天](https://chat.deepseek.com/share/8umyd0q2hvx4y5irkd)及 2026-10-28 读取的 LangSmith 页面整理。已核对上述节点耗时、地图任务输入，以及页面可见的工具返回和汇总调用树；没有完成全部叶子节点的耗时、重试次数和 token 核算，也没有执行改造后的性能对比。请求控制、字段筛选与域内工作流均为待验证建议。详细依据见[核验记录](https://github.com/xiaocha653830-tech/xiaocha653830-tech.github.io/blob/main/content/references/deepagent-latency.md)。\n",
      "charCount": 4964,
      "minutes": 15
    },
    {
      "id": "llm-wiki-business",
      "title": "聊到最后，我暂时不给问数项目加 Wiki",
      "summary": "从 Wiki 的写入、读取和维护机制出发，讨论它在文档型 RAG 与 NL2SQL 中分别能承担什么工作。",
      "category": "RAG 与检索",
      "topic": "rag",
      "tags": [
        "LLM Wiki",
        "RAG",
        "NL2SQL",
        "知识管理"
      ],
      "kind": "方案讨论",
      "date": "2026-10-26",
      "updated": "2026-10-26",
      "order": 0,
      "level": "入门",
      "status": "机制与方案分析",
      "scope": "基于既有 DeepSeek 对话和公开技术资料的方案分析，未验证问数效果或性能收益。",
      "sources": [
        {
          "path": "content/references/llm-wiki-business.md",
          "start": 1,
          "end": 15,
          "repository": "xiaocha653830-tech.github.io",
          "url": "https://github.com/xiaocha653830-tech/xiaocha653830-tech.github.io/blob/main/content/references/llm-wiki-business.md#L1-L15"
        }
      ],
      "markdown": "在进行 NL2SQL 的项目时，我和 DeepSeek 讨论过一个问题，Wiki 未来会替代 RAG 吗？聊到后面，我又说了一句“那就不用 Wiki 了”。\r\n\r\n这两句话之间，我还问了模型怎么读 Wiki，以及它和给知识库加索引有什么区别。等问题落到自己的问数项目，数据源变成了数据仓库，讨论也跟着具体起来。\r\n\r\n## LLM Wiki 是什么？\r\n\r\n这里讨论的 LLM Wiki，是 Andrej Karpathy 在 2026 年 4 月提出的一种知识库组织方式。它的核心主张是，**让 LLM 在文档摄入时就把知识整理成相互关联的 Wiki 页面，供后续查询继续使用**。\r\n\r\n最常见的原文切片 RAG，会在提问时查找相关片段，再把片段交给模型推理。如果一次跨文档分析只留在聊天记录里，下一次问到相关问题，系统往往还要重新查找和归纳。这里讨论的重复工作，主要就是这部分综合分析。\r\n\r\nLLM Wiki 会把一部分工作提前。**新文档进来时，LLM 读取资料，把有关内容合并进已有知识页，并记录新旧说法的联系与冲突**。之后用户提问，可以优先读取整理过的页面；页面没有覆盖的问题，仍要回查原始材料。[Karpathy 的原始说明](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)讨论的就是这种持续维护方式。\r\n\r\n所以我就开始假设，如果将 Wiki 的概念架构放到常见的 NL2SQL 问数或文档问答项目里，应该如何设计？\r\n\r\n## Wiki 是怎么写入的？\r\n\r\nWiki 怎样导入数据，要先从它的结构说起。Karpathy 给出的模式分成**三层**，分别保存原始素材、整理后的知识，以及约束 LLM 维护行为的规则。具体目录和工具可以按项目调整。\r\n\r\n### 三层架构\r\n\r\n| 层级          | 目录/文件                  | 内容                                                         | 谁维护            |\r\n| ------------ | ------------------------- | ----------------------------------------------------------- | ---------------- |\r\n| **Schema 层** | `CLAUDE.md` 或 `AGENTS.md` | 页面类型、命名规范、工作流（ingest/query/lint）、交叉引用规则 | 人与 LLM 共同演进 |\r\n| **Raw 层**    | `raw/`                     | 原始文档、文章、图片等，不可变，LLM 只读                     | 人放入            |\r\n| **Wiki 层**   | `wiki/`                    | LLM 生成的摘要页、实体页、概念页、索引、日志                 | LLM 生成和维护，人复核 |\r\n\r\n模型回答问题时优先使用的知识放在 Wiki 层。我认为，先把 Schema 层对这些页面的约定写清楚，是建库时最重要的一步。相同概念怎样命名、结论需要附什么来源，都应该有共同规则，否则资料越多，后面查找和核对就越麻烦。\r\n\r\n这里的 Schema 指 Wiki 的组织与维护规则。数据库的表结构、字段说明属于问数需要的**业务元数据**，可以成为 Wiki 的输入，随后被整理成知识页。两者需要分别准备，也可以随着接入的资料逐步完善，不必等全部业务元数据提取完成才开始写第一篇页面。\r\n\r\n## 一份新资料进来后，要改哪些地方？\r\n\r\n按这套模式，一份资料进入 `raw/` 后，LLM 先读取内容，再检查已有页面。已经介绍过的概念，应当把新材料补进原有页面；遇到尚未整理的主题，再建立新页。处理结果还要反映在目录和操作日志里，让后续查询能够找到。\r\n\r\n所以，写入一份资料可能会改动多个页面。资料自身有一页摘要，其中涉及的业务术语又可能需要补进已有说明。只给每份文档各写一篇摘要，跨资料的关系仍然要等查询时重新查找。\r\n\r\n新旧资料发生冲突时，也需要有处理约定。放到业务问数项目中，可以要求页面保留来源与适用日期，由业务人员确认当前规则。模型能够指出两份材料说法不同，但哪份已经生效，往往还需要资料之外的确认。\r\n\r\n这就让 Schema 层的约定有了具体用途。它需要让模型知道，一次写入应当检查哪些相关页面，以及遇到无法判断的冲突时该停在哪里。把文件夹建好，只完成了存放资料这一步。\r\n\r\n## LLM 如何读取 Wiki 库？\r\n\r\n“直接读”很容易让人略过中间的动作。文件还在电脑里，模型仍需要通过程序或工具拿到其中的文字。一个小规模 Wiki，可以先让模型读 `index.md`，根据页面名称和简介选择相关条目，再用文件读取工具取得正文。\r\n\r\n读到某个术语需要另一页解释时，模型可以沿链接继续读。已有页面证据不足，就回到原始材料核对。最后交给模型的上下文，仍然是这次找到的文字，已经整理好的页面也要经过选择才能进入回答过程。\r\n\r\n这也意味着，Wiki 的积累保存在文件里。换一个会话，只要仍然能访问这些页面，就有机会接着已有分析往下做；把文件放进目录，并不会让模型自动知道里面的全部内容。\r\n\r\n资料多了，先读完整目录也会变慢。可以给 Wiki 页面加全文搜索，或使用向量检索缩小范围，再读取有关页面。检索的对象变成了整理过的知识，查找这一步仍然存在。\r\n\r\n可问题也就跟着来了。我在对话里接着问，这和在常规知识库里添加索引有什么区别？\r\n\r\n## 加个索引，不就也能找到了吗？\r\n\r\n如果只是给原始文档建立向量索引，系统主要保存的是内容的检索入口。Wiki 还会改写和更新供查询使用的知识页，把分散在不同资料里的说明整理到一起。\r\n\r\n对话中的“特供款”可以用来说明这项差别。专业术语在 RAG 项目中可能需要额外的业务解释，Wiki 可以在导入时先整理有关说明，再通过索引帮助查询找到它们。这有机会减少检索时遗漏相关解释的问题，实际效果仍需评测。如果要维护一篇可复用的术语页，还得把已有定义与适用范围整理出来，指出哪些说法仍有冲突，并保留回查来源的入口。\r\n\r\n下一次有人问到这个词，模型有机会先用这份解释，少做一次跨资料归纳。但如果定义更新了，页面也要跟着更新，否则保存下来的结论会继续影响后面的回答。每次都要重新理解几份资料之间的关系，持续维护知识页才有更直接的价值。已经有了维护清楚的业务说明，也未必需要再建一套 Wiki。\r\n\r\n于是，对话走到了业务。我先问 Wiki 相比于传统 RAG 项目有什么优势与短板，随后把问题放进自己的问数项目。\r\n\r\n“私域”这个词很大，具体到项目，先要讲清楚系统拿什么回答问题。我在对话里指出，问数项目的数据源是**数据仓库**，而 Wiki 经常处理的是 **Markdown**、**Word** 这些文档。\r\n\r\n## 业务说明能看文档，数字还要去哪里找？\r\n\r\n“特供款”指哪些商品，可以写进业务说明。模型读懂说明后，才知道查询时要把哪些商品算进去。但具体卖了多少，仍然要到数据库里查。\r\n\r\n数据仓库里的表结构和字段注释，可以帮助模型理解数据怎样存放。业务文档则要补充表结构未必能表达的含义，例如一个术语对应什么筛选范围。Wiki 能整理这些说明，实际的销售记录仍留在数据仓库中。\r\n\r\n[LangChain 的问数示例](https://docs.langchain.com/oss/python/langchain/sql-agent)展示了从查看表和字段到生成 SQL、执行查询，再根据结果回答的过程。Wiki 如果加入其中，可以在生成 SQL 前提供有关的业务说明，帮助确定查询条件。它能承担这部分上下文整理，执行 SQL 和获取数据的工作还要保留。\r\n\r\n所以，文档问答与业务问数使用 Wiki 的位置会有差别。文档问答有些问题读完知识页就能回答；业务问数即使已经理解业务，通常还要查询对应的数据。把某次查到的数字存进页面，也只能表示那个时间、那组条件下的结果。\r\n\r\n如果把这套设计放回问数项目，就需要分别检查两件事。模型有没有拿到正确的业务说明，以及它有没有按照说明生成并执行查询。页面写得通顺，不能证明 SQL 中的过滤条件已经正确；SQL 能执行，也不能证明业务口径已经选对。\r\n\r\n## 整理过的知识，后面还要维护什么？\r\n\r\n业务口径变化以后，影响可能会沿着页面之间的引用扩散。一篇术语说明更新了，引用它的查询示例仍可能保留旧条件。只改首页上的一句定义，无法保证其他页面已经一致。\r\n\r\nKarpathy 给出的流程包含定期检查，用来查找过时说法和页面之间的矛盾。这能提供维护入口，但检查能否发现问题，还取决于系统有没有拿到新资料，以及页面有没有留下可追溯的依据。\r\n\r\n放到问数设计中，规则页需要说明适用范围，并能找到确认这项规则的材料。涉及业务判断的变更，还应有人复核。模型生成一篇解释，与确认它可以用于当前查询，是两项不同的工作。\r\n\r\n这些工作也会影响成本。提前整理知识有机会减少重复归纳，建库和更新同样需要投入。查询时还可能连续读多个页面，所以仅凭“已经提前编译”，无法保证每次回答更快或更便宜。本文讨论的是可采用的分工，还没有对这个问数项目做效果与成本对比。\r\n\r\n## 所以 Wiki 无法真正进入业务？\r\n\r\n我认为，在以文档或文本为主要数据源的 RAG 项目中，完全可以尝试引入 Wiki。尤其当一个业务问题需要对照多份资料，专业术语又缺少统一解释时，提前整理知识页，有机会减少查询时反复拼接和理解材料的工作。\r\n\r\n具体做法可以从已有 RAG 流程中增加知识整理开始。原始文档继续保留，导入时让模型更新相关的术语页和业务说明，查询时把这些页面也作为检索材料。需要跨文档归纳的问题，可以先参考整理结果；涉及具体条款或页面没有覆盖的细节，再回到原文核对。这样既能尝试复用已有分析，也保留了检查依据的入口。\r\n\r\n放到 NL2SQL 项目里，Wiki 的作用则更集中在业务解释上。它可以帮助模型理解“特供款”对应什么范围，但具体销售数据仍要通过 SQL 查询。我的问数项目是否需要它，要看这些说明是否已经足够清楚，以及跨资料整理是不是反复发生。这里暂时不加 Wiki 的选择，也就不能直接推广到文档问答项目。\r\n\r\n所以，我更愿意把 Wiki 看作一种可以融入 RAG 的知识维护方式。它把一部分跨文档理解提前到资料导入和更新时，查询时仍需要找到相关页面，必要时回查原文。在以文档或文本为主要数据源的业务中，可以尝试用它积累可复用的解释；在 NL2SQL 中，它可以补充业务上下文，具体数字仍要查询数据库。是否引入 Wiki，要看这些积累能省下多少重复工作，以及项目能否承担持续核对和更新的成本。\r\n\r\n## 相关链接\r\n\r\n- [Karpathy 的 LLM Wiki 原始说明](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)。\r\n- [LangChain 的问数流程示例](https://docs.langchain.com/oss/python/langchain/sql-agent)。\r\n- [GraphRAG 的索引流程](https://microsoft.github.io/graphrag/index/overview/)。\r\n\r\n公开技术说明复核于 2026 年 10 月 26 日。DeepSeek 分享页在本轮未能重新读取，对话部分沿用原稿，未补写新的对话内容。Wiki 的具体实现或业务规则变化后，需要重新检查本文的适用范围。\r\n",
      "charCount": 4410,
      "minutes": 13
    },
    {
      "id": "rag-pipelines",
      "title": "RAG 双管线：从文档导入到四路检索",
      "summary": "对照当前代码重新画出知识库的数据流，修正旧笔记中的节点数量、共享状态与断点恢复假设。",
      "category": "RAG 与检索",
      "topic": "rag",
      "tags": [
        "RAG",
        "LangGraph",
        "架构设计"
      ],
      "kind": "源码解读",
      "date": "2026-10-20",
      "order": 1,
      "level": "进阶",
      "status": "已核对源码",
      "scope": "静态核对当前图结构与字段流向，未运行模型或数据库。",
      "sources": [
        {
          "path": "app/import_process/agent/main_graph.py",
          "start": 18,
          "end": 68,
          "repository": "RAG-KnowledgeBase",
          "url": "https://github.com/xiaocha653830-tech/RAG-KnowledgeBase/blob/main/app/import_process/agent/main_graph.py#L18-L68"
        },
        {
          "path": "app/import_process/agent/state.py",
          "start": 5,
          "end": 66,
          "repository": "RAG-KnowledgeBase",
          "url": "https://github.com/xiaocha653830-tech/RAG-KnowledgeBase/blob/main/app/import_process/agent/state.py#L5-L66"
        },
        {
          "path": "app/query_process/agent/main_graph.py",
          "start": 18,
          "end": 86,
          "repository": "RAG-KnowledgeBase",
          "url": "https://github.com/xiaocha653830-tech/RAG-KnowledgeBase/blob/main/app/query_process/agent/main_graph.py#L18-L86"
        }
      ],
      "markdown": "## 从两个入口理解 RAG\r\n\r\n阅读知识库代码时，先分清两个时间尺度。导入流程处理文件、文本和向量，通常在资料更新时运行；查询流程处理用户问题，必须从已有索引中找到可用证据。把两者放在同一条请求链路里，很容易把解析成本和检索延迟混为一谈。\r\n\r\n[RAG-KnowledgeBase](https://github.com/xiaocha653830-tech/RAG-KnowledgeBase) 正好将这两部分拆开：导入图使用 `ImportGraphState`，查询图使用 `QueryGraphState`。**两张图通过持久化知识库衔接，并不共享同一个运行时 State 对象。** 这是核对旧文章草稿时首先需要修正的地方。\r\n\r\n## 导入图：七个节点，一条内容加工链\r\n\r\n导入图注册了七个节点。入口根据 Markdown 和 PDF 标记选择路径，之后依次处理图片、切分、主体识别、向量化与 Milvus 写入。\r\n\r\n```text\r\n文件入口\r\n  ├─ Markdown ─────────┐\r\n  └─ PDF → 转 Markdown ┤\r\n                       ↓\r\n图片处理 → 文档切分 → 主体识别 → 向量化 → Milvus\r\n```\r\n\r\n对应的代码位于 `import_process/agent/main_graph.py:21–68`。入口条件函数先检查 Markdown 标记，再检查 PDF 标记；两者都未命中时返回 `END`。这描述的是当前实现，不代表输入校验已经足够完备。\r\n\r\nState 中比较重要的字段，可以按职责而不是按声明顺序阅读：\r\n\r\n| 职责 | 字段 | 阅读时要问的问题 |\r\n| --- | --- | --- |\r\n| 追踪 | `task_id` | 能否定位一次导入？ |\r\n| 路由 | `is_md_read_enabled`、`is_pdf_read_enabled` | 标记由谁设置，是否互斥？ |\r\n| 文件 | `local_file_path`、`md_path` | 下游读的是原始文件还是处理产物？ |\r\n| 内容 | `md_content`、`chunks`、`item_name` | 元数据是否跟着内容一起传递？ |\r\n\r\n如果图片处理改写了 Markdown 路径，切分节点仍然读取旧路径，就会出现“前一步成功，后一步读不到新内容”的问题。理解图，不只是看节点之间的箭头，还要看每条边上传递的数据。\r\n\r\n## 查询图：当前版本已经是四路\r\n\r\n旧草稿描述三路召回，当前代码还注册了 `node_query_kg`，因此实际分叉是四路：\r\n\r\n```text\r\n商品确认\r\n  ├─ 已有 answer → 输出\r\n  └─ 多路搜索\r\n       ├─ 普通向量\r\n       ├─ HyDE\r\n       ├─ Web 搜索\r\n       └─ 知识图谱\r\n          ↓ node_join\r\n       RRF → Rerank → 答案输出\r\n```\r\n\r\n查询图包含十个注册节点，其中两个是组织流程的中转节点。这个数字只对应本次读取的本地版本，不应作为项目永久不变的属性。\r\n\r\n`route_after_item_confirm` 检查 `answer` 是否已经存在。如果前面的节点决定澄清或拒答，后续检索会被跳过。把短路逻辑放在图中，读代码时就能直接看到哪些成本可以避免。\r\n\r\n## 图上有边，不等于数据被消费\r\n\r\n`node_join` 返回空字典，表示它不新增状态字段。后面的 RRF 节点只读取 `embedding_chunks` 和 `hyde_embedding_chunks`；Web 结果在重排节点才被合并。知识图谱分支虽然出现在图里，但不能据此推断它参与了 RRF 或最终答案。\r\n\r\n排查这类流程时，建议画两张表：一张列控制流，另一张列字段的生产者与消费者。两者不一致的地方，往往就是解释不清或功能未接通的地方。\r\n\r\n## 拆成节点，不自动获得断点恢复\r\n\r\n这两张图调用的是不带 checkpointer 的 `compile()`。因此，不能仅凭“图由独立节点组成”，就宣称进程重启后可以自动从失败节点恢复。\r\n\r\n真正的恢复能力还需要状态持久化、稳定的任务标识、外部副作用的幂等处理，以及失败后的恢复入口。本篇完成的是源码结构核对，没有启动模型、数据库或完整工作流。\r\n\r\n## 一份可复用的阅读顺序\r\n\r\n1. 找到图的构建入口，确认注册了哪些节点。\r\n2. 阅读条件边，找出提前结束与分叉条件。\r\n3. 对照 State，标注关键字段由谁写入、谁读取。\r\n4. 跟踪持久化边界，区分内存数据与外部存储。\r\n5. 最后检查异常分支和恢复机制，避免从模块拆分推导运行保证。\r\n\r\n先建立这张地图，再深入单个模型调用，比从某个长函数一路读下去更容易理解系统。\r\n",
      "charCount": 1591,
      "minutes": 5
    },
    {
      "id": "outbox-fencing",
      "title": "Outbox 与租约守卫：让后台任务有据可查",
      "summary": "消息为什么会重复投递，旧 Worker 为什么还能醒来？沿着 ETL-Agent 的运行事实、认领与终态写入逐层拆解。",
      "category": "数据工程",
      "topic": "engineering",
      "tags": [
        "Outbox",
        "SQLAlchemy",
        "并发",
        "ETL"
      ],
      "kind": "工程实践",
      "date": "2026-10-20",
      "order": 2,
      "level": "进阶",
      "status": "已核对源码",
      "scope": "核对 Commit、Outbox、认领与租约辅助函数；未重跑外部数据面。",
      "sources": [
        {
          "path": "api/app/services/commit.py",
          "start": 117,
          "end": 223,
          "repository": "ETL-Agent",
          "url": "https://github.com/xiaocha653830-tech/ETL-Agent/blob/main/api/app/services/commit.py#L117-L223"
        },
        {
          "path": "api/app/services/outbox.py",
          "start": 79,
          "end": 229,
          "repository": "ETL-Agent",
          "url": "https://github.com/xiaocha653830-tech/ETL-Agent/blob/main/api/app/services/outbox.py#L79-L229"
        },
        {
          "path": "api/app/services/execution.py",
          "start": 131,
          "end": 166,
          "repository": "ETL-Agent",
          "url": "https://github.com/xiaocha653830-tech/ETL-Agent/blob/main/api/app/services/execution.py#L131-L166"
        },
        {
          "path": "api/app/services/lease.py",
          "start": 52,
          "end": 153,
          "repository": "ETL-Agent",
          "url": "https://github.com/xiaocha653830-tech/ETL-Agent/blob/main/api/app/services/lease.py#L52-L153"
        }
      ],
      "markdown": "## 从“数据库写完了，消息没发出去”开始\r\n\r\n创建一个后台作业通常涉及两个系统：数据库记录运行事实，消息队列通知 Worker 执行。如果两步独立进行，进程可能在中间崩溃，留下已经创建、却永远没有被调度的任务。\r\n\r\nETL-Agent 的 Commit 服务把运行记录与 Outbox 事件放在同一个数据库事务内提交。它先确保“有一个待执行事实”，再由分发器处理消息投递。\r\n\r\n## Outbox 管理投递意图\r\n\r\n`commit_preparation` 在添加运行记录之后调用 `enqueue`，最后统一提交。`execution_run_key` 使用运行 ID 构造稳定键，避免把同一逻辑运行误当成多个新事件。\r\n\r\n```text\r\nAPI 事务：运行记录 + Outbox 事件 → 一起提交\r\n                                      ↓\r\n分发器：读取到期事件 → 投递 Celery → 标记已投递\r\n                                      ↓\r\nWorker：条件认领 → 执行 → 带守卫写终态\r\n```\r\n\r\n分发器按 `available_at` 取到期事件。失败时增加尝试次数，并按有上限的指数退避推迟下一次执行；重试耗尽后标记失败。这个状态必须被维护任务或运维界面看见，不能把“有重试”表述为“最终一定成功”。\r\n\r\n## 投递与标记之间仍然有重复窗口\r\n\r\n消息已经发出，但数据库还没记录成功时，进程可能退出。下一轮扫描会再次投递同一个事件。\r\n\r\n因此，Outbox 本身不提供端到端“恰好一次”。消费者需要处理重复投递，外部系统的副作用也要有自己的幂等机制。\r\n\r\n本地 `claim_run` 用带状态条件的 UPDATE 认领运行。两个 Worker 同时竞争时，只有符合条件的更新能够影响目标行。`rowcount` 是判断认领是否成功的依据，不能先 SELECT 再假设自己的结果仍然有效。\r\n\r\n## fencing 防止旧 Worker 改写新结果\r\n\r\nWorker 失联后可能被接管，但旧进程并不一定真正退出。它恢复后继续写终态，就可能覆盖新 Worker 的结果。\r\n\r\n项目中的 `fenced_update` 把运行 ID、运行状态与租约持有者写入同一条 UPDATE 的条件。这相当于把“我仍有资格写”与“实际写入”合并。\r\n\r\n```sql\r\n-- 按本地实现简化的 SQL 示意\r\nUPDATE execution_runs\r\nSET status = 'succeeded'\r\nWHERE id = :run_id\r\n  AND status = 'running'\r\n  AND worker_lease_owner = :worker_id;\r\n```\r\n\r\n如果影响行数不是 1，调用方就必须停止按成功路径推进。当前辅助函数在守卫失败时回滚；成功时把提交权留给上层，便于把终态与事件记录一起落定。\r\n\r\n## 租约过期与租约易主不是同一个条件\r\n\r\n这套实现的终态写入守卫检查持有者，不直接用时间是否过期判定。过期回收由维护任务处理；回收时还比较先前观察到的到期时间，避免与刚完成续期的 Worker 冲突。\r\n\r\n这是一种具体的工程约定。它保护的是相应数据库更新，不能直接推出所有外部数据面操作也获得相同保护。外部提交、取消、发布仍需要检查它们各自的授权和幂等边界。\r\n\r\n## 有用的故障注入位置\r\n\r\n| 故障位置 | 应检查的行为 |\r\n| --- | --- |\r\n| API 提交前失败 | 运行与事件一起回滚 |\r\n| 消息发出后、标记前失败 | 允许重复投递，但重复认领不应推进 |\r\n| Worker 长时间无心跳 | 能回收，且回收不能覆盖刚续期的租约 |\r\n| 旧 Worker 恢复 | 旧持有者不能写入终态 |\r\n| 持续投递失败 | 重试耗尽可见，有明确后续处理 |\r\n\r\n这些是建议验证场景。本篇只核对控制面代码，没有重跑消息队列、SeaTunnel 或真实数据库，因此不沿用 README 中的历史测试数量作为本次验收结果。\r\n",
      "charCount": 1228,
      "minutes": 4
    },
    {
      "id": "rrf-rerank",
      "title": "RRF 与 Rerank：多路结果到底在哪里汇合",
      "summary": "四路检索不等于四路融合。追踪 RRF、Web 候选与重排输入，区分算法能力和本地实现的取舍。",
      "category": "RAG 与检索",
      "topic": "rag",
      "tags": [
        "RAG",
        "RRF",
        "Rerank",
        "HyDE"
      ],
      "kind": "源码解读",
      "date": "2026-10-20",
      "order": 3,
      "level": "进阶",
      "status": "已核对源码",
      "scope": "核对候选消费关系与降级分支，没有运行检索质量评测。",
      "sources": [
        {
          "path": "app/query_process/agent/nodes/node_rrf.py",
          "start": 80,
          "end": 160,
          "repository": "RAG-KnowledgeBase",
          "url": "https://github.com/xiaocha653830-tech/RAG-KnowledgeBase/blob/main/app/query_process/agent/nodes/node_rrf.py#L80-L160"
        },
        {
          "path": "app/query_process/agent/nodes/node_rerank.py",
          "start": 44,
          "end": 199,
          "repository": "RAG-KnowledgeBase",
          "url": "https://github.com/xiaocha653830-tech/RAG-KnowledgeBase/blob/main/app/query_process/agent/nodes/node_rerank.py#L44-L199"
        }
      ],
      "markdown": "## 先回答：究竟融合了什么\r\n\r\n笔记中曾留下一个问题：网络搜索是否参与 RRF 融合？只看查询图，多个分支都汇聚在一起；只看概述，又容易把“多路召回”理解成“所有结果使用同一种融合”。\r\n\r\n当前本地实现给出的答案很明确：`node_rrf` 只读取普通向量检索和 HyDE 检索的结果。Web 结果由 `node_rerank` 另外取出，随后一起送入重排模型。这是本项目当前的实现选择，不是 RRF 算法的固有限制。\r\n\r\n## RRF 使用名次，不直接比较原始分数\r\n\r\n本地节点对两路结果各赋予 `1.0` 的权重，调用 `step_2_rrf(..., k=60, max_results=None)`。这意味着旧草稿中的“RRF 固定最多十条”不能直接套用到当前版本。\r\n\r\nRRF 的核心可以写成：\r\n\r\n```text\r\nscore(document) = Σ weight_i / (k + rank_i(document))\r\n```\r\n\r\n排名从 1 开始。在两个榜单中都靠前的文档会得到多次贡献；只出现在一路中的文档也可以保留。\r\n\r\n下面是独立的算法演示，使用文档 ID 去重，不依赖项目运行环境：\r\n\r\n```python\r\ndef rrf(rankings, k=60):\r\n    scores = {}\r\n    for ranking in rankings:\r\n        # 同一榜单内重复 ID 只贡献一次\r\n        unique_ids = dict.fromkeys(ranking)\r\n        for rank, doc_id in enumerate(unique_ids, start=1):\r\n            scores[doc_id] = scores.get(doc_id, 0.0) + 1 / (k + rank)\r\n    return sorted(scores.items(), key=lambda item: (-item[1], item[0]))\r\n\r\nprint(rrf([[\"a\", \"b\", \"c\"], [\"b\", \"d\", \"a\"]]))\r\n```\r\n\r\nRRF 本来就可以用于不同检索方式得到的有序列表。跨源使用时，需要定义文档身份、重复文档的对应关系和缺失结果的处理方式；不能简单断言“网络文档不能参与 RRF”。算法说明可参考 [Microsoft 的 RRF 排名文档](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)。\r\n\r\n## Web 结果在重排阶段进入\r\n\r\n`step_1_merge_docs` 将本地切片转换为带 `text`、`doc_id`、`title`、`source` 的对象，再将 Web 的摘要、标题和 URL 加入同一个候选列表。\r\n\r\n| 来源 | 正文来源 | 追踪字段 |\r\n| --- | --- | --- |\r\n| 本地切片 | `content` | `chunk_id` / `doc_id` |\r\n| Web 搜索 | `snippet` 或 `content` | `url` |\r\n\r\n随后以改写后的查询为优先输入，为每个候选构造查询—文本对，调用 reranker 打分，再按得分降序排序。\r\n\r\n这种组织方式把两件事分开：RRF 合并已有排名；reranker 对候选文本重新计算相关性。两层都有价值，但它们回答的问题不同。\r\n\r\n## 动态截断如何工作\r\n\r\n当前重排代码在配置的上下界内扫描相邻分数。绝对差值或相对差值达到阈值时，就在该位置截断。相对差值的分母使用前一分数的绝对值，再加一个很小的数避免除零。\r\n\r\n这是一种启发式策略。它能响应分数曲线的变化，但分差不是可靠性的证明，更不是答案正确率。不同模型、不同查询类型，可能需要分别校准阈值。\r\n\r\n还要注意异常分支：模型打分失败时，代码把候选得分设为零后返回。此时后续结果并没有经过有效的模型排序。接口或日志应能区分“重排成功”和“降级保留候选”。\r\n\r\n## 怎么验证这条链路\r\n\r\n建议为每个问题保存四份中间结果：原始召回列表、融合列表、重排分数和最终引用。这样才能判断错误发生在召回、融合、截断还是回答阶段。\r\n\r\n本篇核对了数据消费关系与函数实现，未运行检索基准。没有标注数据集时，不将某个权重、阈值或候选条数描述为最优值。\r\n",
      "charCount": 1234,
      "minutes": 4
    },
    {
      "id": "langgraph-interrupt",
      "title": "LangGraph 人工介入：暂停之后如何安全恢复",
      "summary": "从一个本地演示理解 interrupt、线程标识与恢复载荷，找出默认批准和副作用重复执行的边界。",
      "category": "Agent 工作流",
      "topic": "agent",
      "tags": [
        "LangGraph",
        "HITL",
        "状态机"
      ],
      "kind": "学习笔记",
      "date": "2026-10-20",
      "order": 4,
      "level": "入门",
      "status": "已核对源码",
      "scope": "基于本地模拟演示与官方恢复语义，不涉及真实转账。",
      "sources": [
        {
          "path": "content/references/langgraph-hitl-demo.md",
          "start": 1,
          "end": 37,
          "repository": "xiaocha653830-tech.github.io",
          "url": "https://github.com/xiaocha653830-tech/xiaocha653830-tech.github.io/blob/main/content/references/langgraph-hitl-demo.md#L1-L37"
        }
      ],
      "markdown": "## 一个演示里包含的三种状态\r\n\r\n本地 `langgraph_hitl/demo.py` 用一个模拟转账流程展示人工介入：先生成待审核信息，通过 `interrupt()` 暂停，再用 `Command(resume=...)` 传回决定。\r\n\r\n这个例子只是字符串状态演示，没有真正调用支付接口。它仍然适合说明三个概念：业务状态、暂停载荷和恢复载荷。\r\n\r\n| 概念 | 作用 |\r\n| --- | --- |\r\n| `TransferState` | 保存收款人、金额、审核结果等业务字段 |\r\n| `interrupt(...)` 载荷 | 告诉外部调用方目前需要确认什么 |\r\n| `Command(resume=...)` | 将外部决定传回暂停点 |\r\n\r\n把三者分开，才能避免将前端显示状态直接当作后端授权事实。\r\n\r\n## 线程标识是恢复入口\r\n\r\n示例使用 `InMemorySaver` 编译图，并在两次调用中复用同一个 `thread_id`。没有稳定的线程标识，后续调用就无法定位之前暂停的那次运行。\r\n\r\n```python\r\n# 简化示意：graph 已配置 checkpointer\r\nconfig = {\"configurable\": {\"thread_id\": \"review-demo\"}}\r\n\r\nresult = graph.invoke(initial_state, config=config)\r\nif result.get(\"__interrupt__\"):\r\n    decision = {\"approved\": False}\r\n    result = graph.invoke(Command(resume=decision), config=config)\r\n```\r\n\r\n内存保存器适合演示，不代表进程重启后还能找回状态。需要跨进程或重启恢复时，应选择持久化存储并设计线程与用户的归属关系。\r\n\r\n## 恢复会重新进入中断节点\r\n\r\n根据 [LangGraph 的 interrupts 文档](https://docs.langchain.com/oss/python/langgraph/interrupts)，恢复时会从发生中断的节点开头重新执行。因此，放在 `interrupt()` 之前的代码可能再次运行。\r\n\r\n这直接影响外部副作用的放置位置。纯粹整理待审核信息通常可以重复；创建外部任务、写入账单或发送通知，则需要移到合适的阶段，或使用业务幂等键保护。\r\n\r\n不要把“从暂停点恢复”理解成 Python 在某一行保留调用栈后继续。图的持久化状态和普通函数的内存执行现场是不同层面的概念。\r\n\r\n## 示例中的默认批准需要改进\r\n\r\n本地示例对字典载荷采用：\r\n\r\n```python\r\napproved = bool(interrupt_result.get(\"approved\", True))\r\n```\r\n\r\n这有两个值得记录的边界：缺少 `approved` 时默认批准；字符串 `\"false\"` 经过 `bool()` 后也会得到真值。在正式授权流程中，建议使用显式字段与严格布尔类型校验。\r\n\r\n```python\r\ndef validate_decision(payload):\r\n    if not isinstance(payload, dict):\r\n        raise ValueError(\"审核结果必须是对象\")\r\n    if type(payload.get(\"approved\")) is not bool:\r\n        raise ValueError(\"approved 必须显式提供布尔值\")\r\n    return payload[\"approved\"]\r\n```\r\n\r\n这段是建议实现，未改动原演示。若审核期间允许修改业务参数，还需要重新校验修改后的金额、目标与权限，不能把“同意修改”直接等同于“修改结果合法”。\r\n\r\n## 最小验证场景\r\n\r\n- 明确拒绝：后续节点不能报告成功。\r\n- 缺少审批字段：返回校验错误，而非默认通过。\r\n- 字符串布尔值：拒绝 `\"false\"` 这样的含糊输入。\r\n- 重复恢复或重复请求：外部动作不能重复产生。\r\n- 服务重启：验证持久化与线程定位，而非只在单进程内演示。\r\n\r\n人工介入不仅需要一个暂停按钮，还需要清楚的恢复契约和执行边界。本文基于本地演示与官方恢复语义整理，没有执行任何转账或外部任务。\r\n",
      "charCount": 1112,
      "minutes": 4
    },
    {
      "id": "chunk-contract",
      "title": "文档切片的契约：长度之外，还要保留什么",
      "summary": "标题、代码缩进、来源元数据和失败批次，决定一个 chunk 是否能被检索、引用与排障。",
      "category": "RAG 与检索",
      "topic": "rag",
      "tags": [
        "RAG",
        "文档切分",
        "BGE-M3",
        "Python"
      ],
      "kind": "工程实践",
      "date": "2026-10-20",
      "order": 5,
      "level": "入门",
      "status": "已核对源码",
      "scope": "核对切分与向量化节点；建议代码为独立示例，未修改来源项目。",
      "sources": [
        {
          "path": "app/import_process/agent/nodes/node_document_split.py",
          "start": 34,
          "end": 171,
          "repository": "RAG-KnowledgeBase",
          "url": "https://github.com/xiaocha653830-tech/RAG-KnowledgeBase/blob/main/app/import_process/agent/nodes/node_document_split.py#L34-L171"
        },
        {
          "path": "app/import_process/agent/nodes/node_bge_embedding.py",
          "start": 35,
          "end": 85,
          "repository": "RAG-KnowledgeBase",
          "url": "https://github.com/xiaocha653830-tech/RAG-KnowledgeBase/blob/main/app/import_process/agent/nodes/node_bge_embedding.py#L35-L85"
        }
      ],
      "markdown": "## 切片的输出应该是一个契约\r\n\r\n“把长文档切小”只说明了操作，没有说明结果应该满足什么条件。在 RAG 中，一条切片既是检索对象，也是引用与排障的最小单位。除了正文，它还需要携带来源、标题和所属分段。\r\n\r\n本地切分节点采用两阶段策略：先按 Markdown 标题划分章节，再用 `RecursiveCharacterTextSplitter` 处理过长章节。这个顺序可以保留结构信息，但仍有边界需要核查。\r\n\r\n## 第一阶段：区分标题与代码\r\n\r\n`step_2_split_by_title` 用正则识别一到六级标题，同时维护 `is_code_block` 标记。遇到代码围栏时切换状态，在围栏内不把 `#` 开头的行当作标题。\r\n\r\n这个处理很实用，因为 Python 注释、Shell 注释和 Markdown 示例都可能以 `#` 开头。如果只用标题正则，代码示例会被错误地切成章节。\r\n\r\n不过，当前实现每行调用 `strip()`，会丢失行首缩进。它适合部分自然语言资料，直接用于技术代码文档时则需要谨慎：Python 代码的缩进本身就是语义。更完整的解析应保留原始行，围栏识别与标题判断使用单独的视图。\r\n\r\n## 第二阶段：控制长度并保留上下文\r\n\r\n当前节点把章节交给递归切分器，并为子块保存：\r\n\r\n```json\r\n{\r\n  \"title\": \"章节标题_1\",\r\n  \"content\": \"这一块的正文\",\r\n  \"parent_title\": \"章节标题\",\r\n  \"file_title\": \"原始文档名称\",\r\n  \"part\": 1\r\n}\r\n```\r\n\r\n这是按源码字段归纳的结构示意。`part` 在每个父章节内重新编号，不能单独充当全库唯一标识。\r\n\r\n切分器的长度限制还取决于分隔符配置。本地代码使用换行、中文标点和空格，但没有最后的空字符串兜底。因此，不含这些分隔符的超长文本，需要专门检查，不能只看 `chunk_size` 参数就认定所有输出都严格小于阈值。\r\n\r\n下面是面向普通文本的改进示例，数值用于演示，不是经过评测的最优配置：\r\n\r\n```python\r\nfrom langchain_text_splitters import RecursiveCharacterTextSplitter\r\n\r\nsplitter = RecursiveCharacterTextSplitter(\r\n    chunk_size=600,\r\n    chunk_overlap=80,\r\n    length_function=len,\r\n    separators=[\"\\n\\n\", \"\\n\", \"。\", \"！\", \"；\", \" \", \"\"],\r\n)\r\n```\r\n\r\n按字符计数与按模型 token 计数是两种约束。要控制模型输入上限，应使用目标模型对应的分词器测量，而不是套用固定的“中文字与 token 换算比例”。\r\n\r\n## 向量化之后，不能只数切片数量\r\n\r\n`node_bge_embedding.py` 在批次异常或向量结果为空时，会把原始切片追加到输出。这保留了文本，但这些对象可能没有 `dense_vector` 和 `sparse_vector`。\r\n\r\n于是两个看似相近的检查，回答的是不同问题：\r\n\r\n| 检查 | 能说明什么 | 不能说明什么 |\r\n| --- | --- | --- |\r\n| 输入与输出条数一致 | 文本对象没有因该分支被丢弃 | 每条都完成了向量化 |\r\n| 所有对象有向量字段 | 必要字段存在 | 维度、数值和索引写入一定正确 |\r\n| 数据库写入成功 | 写操作返回成功 | 检索质量达到要求 |\r\n\r\n建议在入库前增加明确的结果校验，把失败批次记录为可重试任务。以下是字段级检查示例，还需要结合实际向量类型扩展：\r\n\r\n```python\r\ndef incomplete_chunks(chunks):\r\n    required = {\"dense_vector\", \"sparse_vector\"}\r\n    return [\r\n        index\r\n        for index, chunk in enumerate(chunks)\r\n        if not required.issubset(chunk)\r\n    ]\r\n```\r\n\r\n## 为切分准备有针对性的样例\r\n\r\n比起只用一篇正常文档，以下输入更能暴露问题：\r\n\r\n- 首个标题之前有导言的 Markdown，检查导言是否保留。\r\n- 含缩进代码和 `#` 注释的章节，检查代码语义。\r\n- 超长 URL、连续字符或缺少空格的文本，检查长度上限。\r\n- 相同章节标题反复出现的文档，检查引用标识。\r\n- 向量模型某一批次失败，检查是否阻止不完整数据进入后续流程。\r\n\r\n切片质量不能仅凭数量判断。让每个阶段清楚地说明“输入是什么、输出保证什么、失败留下什么”，才能把切分参数变成可验证的工程行为。\r\n",
      "charCount": 1305,
      "minutes": 4
    },
    {
      "id": "unicode-roundtrip",
      "title": "一个中文正则的变形：为什么成功状态还不够",
      "summary": "一条仍然语法合法的规则，可能已在提交链路中改变含义。根据 ETL 故障记录理解提交后回读校验。",
      "category": "数据工程",
      "topic": "engineering",
      "tags": [
        "ETL",
        "Unicode",
        "故障排查",
        "Python"
      ],
      "kind": "故障复盘",
      "date": "2026-10-20",
      "order": 6,
      "level": "入门",
      "status": "记录与代码核对",
      "scope": "故障来自 README 历史记录；回读分支已静态核对，本次未复跑 ETL。",
      "sources": [
        {
          "path": "README.md",
          "start": 145,
          "end": 195,
          "repository": "ETL-Agent",
          "url": "https://github.com/xiaocha653830-tech/ETL-Agent/blob/main/README.md#L145-L195"
        },
        {
          "path": "api/app/scripts/run_demo_managed_flow.py",
          "start": 1,
          "end": 14,
          "repository": "ETL-Agent",
          "url": "https://github.com/xiaocha653830-tech/ETL-Agent/blob/main/api/app/scripts/run_demo_managed_flow.py#L1-L14"
        },
        {
          "path": "api/app/scripts/run_demo_managed_flow.py",
          "start": 150,
          "end": 167,
          "repository": "ETL-Agent",
          "url": "https://github.com/xiaocha653830-tech/ETL-Agent/blob/main/api/app/scripts/run_demo_managed_flow.py#L150-L167"
        }
      ],
      "markdown": "## 语法合法，也可能已经变了意思\r\n\r\nETL-Agent 的 README 记录了一次质量分流异常：原本要拒绝特定姓氏的正则，在 Windows 提交链路中发生了字符替换。规则仍然能通过语法校验，作业也报告成功，但它检查的已经不是原来的条件。\r\n\r\n这是一条文档记录的故障，不是本次重新执行得到的结果。代码中能确认的是：演示脚本已经把规则定义放在 Python 文件里，并增加提交后回读比较。\r\n\r\n## 两条规则都能编译\r\n\r\n问题可以用一个不涉及真实业务数据的小例子复现：\r\n\r\n```python\r\nimport re\r\n\r\nexpected = r\"^[^吴].*$\"\r\nchanged = r\"^[^?].*$\"\r\n\r\nprint(bool(re.match(expected, \"吴某\")))  # False\r\nprint(bool(re.match(changed, \"吴某\")))   # True\r\nprint(len(expected.encode(\"utf-8\")))    # 10\r\nprint(len(changed.encode(\"utf-8\")))     # 8\r\n```\r\n\r\n第一条拒绝以“吴”开头的字符串，第二条拒绝以问号开头的字符串。两条规则语法都合法，业务含义却不同。\r\n\r\n这解释了为什么“API 返回 200”“JSON 能解析”“任务状态为 succeeded”都不足以证明业务目标达成。每项检查覆盖的是不同层次。\r\n\r\n## 提交后回读，把含义核对放在边界上\r\n\r\n本地脚本读取响应中的 `quality_rules`，取出正则，与期望值逐字比较。若不同，则在继续流程前退出。\r\n\r\n```python\r\n# 从实际服务响应中读取已保存规则\r\nstored = reply.json()[\"quality_rules\"]\r\nexpected = DEMO_RULES[0][\"params\"][\"pattern\"]\r\nactual = stored[0][\"params\"][\"pattern\"]\r\n\r\nif actual != expected:\r\n    raise ValueError(\"质量规则回读结果与提交内容不一致\")\r\n```\r\n\r\n回读比较的价值在于它覆盖了序列化、传输、服务端处理和返回表示之间的一段边界。日志同时显示字符数与 UTF-8 字节数，可以帮助发现替换，但长度相等仍不代表内容相同，最终还是要比较值。\r\n\r\n## 不要把编码问题一律归因给 JSON\r\n\r\n字符可以在进入 JSON 序列化之前就被破坏。例如终端、管道、脚本文件与子进程使用不同编码时，替换可能已经发生。之后的 JSON 编码器只会忠实保存那个错误字符。\r\n\r\n比较稳妥的做法是让结构化对象经客户端的 JSON 参数发送，减少手工拼接字符串与跨 shell 传递。对于关键规则，再加入回读和业务正反例校验。\r\n\r\n`ensure_ascii=True` 与 `False` 控制的是序列化表示方式；正确解码后应该得到相同字符串。它不能修复进入编码器前已经被替换的字符。\r\n\r\n## 从一个正则扩展到配置验证\r\n\r\n可以把规则验证拆成四层：\r\n\r\n1. **结构校验**：字段是否齐全，类型是否正确。\r\n2. **值的回读**：关键配置是否与提交前一致。\r\n3. **行为样例**：一条应该通过，一条应该拒绝。\r\n4. **业务结果**：有效行、错误行与最终发布结果是否符合预期。\r\n\r\n对 SQL 模板、路径、Unicode 标识符和复杂过滤条件，也可以采用相同思路。不要只观察“系统有没有报错”，还要核对它是否执行了原来要表达的规则。\r\n\r\n## 这篇文章验证到哪一步\r\n\r\n已静态核对演示脚本中的规则定义与回读分支；本文的小例子可以独立运行，不依赖 ETL 平台。历史分流结果来自项目 README，本次没有再次启动数据库或执行数据搬运。\r\n",
      "charCount": 1025,
      "minutes": 3
    },
    {
      "id": "metadata-boundaries",
      "title": "数据智能体的元数据：三种存储，三种职责",
      "summary": "从 deep-agent 的依赖边界出发，整理字段、指标与字段值的分工，也明确当前构建能力仍是骨架。",
      "category": "Agent 工作流",
      "topic": "agent",
      "tags": [
        "元数据",
        "Qdrant",
        "Elasticsearch",
        "架构设计"
      ],
      "kind": "架构笔记",
      "date": "2026-10-20",
      "order": 7,
      "level": "入门",
      "status": "骨架分析",
      "scope": "区分已存在的构造函数与尚未实现的构建链路，后续方案为建议。",
      "sources": [
        {
          "path": "app/services/meta_knowledge_service.py",
          "start": 1,
          "end": 31,
          "repository": "Deep-Agent",
          "url": "https://github.com/xiaocha653830-tech/Deep-Agent/blob/master/app/services/meta_knowledge_service.py#L1-L31"
        },
        {
          "path": "app/repositories/qdrant/column_qdrant_repository.py",
          "start": 1,
          "end": 9,
          "repository": "Deep-Agent",
          "url": "https://github.com/xiaocha653830-tech/Deep-Agent/blob/master/app/repositories/qdrant/column_qdrant_repository.py#L1-L9"
        },
        {
          "path": "app/repositories/es/value_es_repository.py",
          "start": 1,
          "end": 10,
          "repository": "Deep-Agent",
          "url": "https://github.com/xiaocha653830-tech/Deep-Agent/blob/master/app/repositories/es/value_es_repository.py#L1-L10"
        }
      ],
      "markdown": "## 先分清项目的完成度\r\n\r\n`deep-agent` 的目录已经包含 MySQL、Qdrant 和 Elasticsearch 的客户端、模型与仓储。仅从名字看，容易以为一套完整的数据问答知识库已经就绪。\r\n\r\n但实际读取后，`MetaKnowledgeService.build()` 目前只记录一条日志；字段向量仓储与字段值全文仓储也只保存客户端引用。**这篇文章把它当作架构学习笔记，而不是已完成的产品实现。**\r\n\r\n## 三种数据，各自解决不同问题\r\n\r\n从服务构造函数的依赖可以看出，它计划接收数据仓库、元数据库、字段值全文索引、字段向量索引、指标向量索引和 embedding 客户端。\r\n\r\n按照这些命名，能够整理出一个待实现的职责划分：\r\n\r\n| 数据 | 计划承载位置 | 主要用途 |\r\n| --- | --- | --- |\r\n| 表、字段、指标定义 | MySQL 元数据仓储 | 保存结构与关联关系 |\r\n| 字段和指标的语义表示 | Qdrant | 按问题语义找到候选字段或指标 |\r\n| 字段值索引 | Elasticsearch | 对名称、枚举值等做文本匹配 |\r\n| 业务事实数据 | 数据仓库 | 执行最终受约束的数据查询 |\r\n\r\n表中是从接口依赖推导的设计意图，不能据此宣称索引已经建好，或 SQL 已经能正确生成。\r\n\r\n## 为什么元数据不能只存一段描述\r\n\r\n自然语言中的“销售额”可能对应多个指标：含税还是不含税，按下单还是支付时间，退款是否扣除。只召回一个相似字段名，不足以确定口径。\r\n\r\n因此，后续实现需要保存稳定 ID、数据源、表与列、类型、业务含义、指标口径和更新时间。向量索引可以帮助找候选，结构化元数据负责把候选约束回可执行对象。\r\n\r\n```json\r\n{\r\n  \"field_id\": \"orders.net_amount\",\r\n  \"table\": \"orders\",\r\n  \"column\": \"net_amount\",\r\n  \"data_type\": \"decimal\",\r\n  \"description\": \"订单净额\",\r\n  \"definition\": \"示意口径，实际以业务定义为准\",\r\n  \"schema_version\": \"v1\"\r\n}\r\n```\r\n\r\n这是建议的数据契约，不是当前仓库中已经实现的模型。\r\n\r\n## 从骨架走向可用，需要哪些闭环\r\n\r\n建议先实现一条最小构建链：读取结构化元数据，规范化字段标识，生成向量，写入索引，再按 ID 回查校验。全文字段值索引可以作为另一条明确的管线，避免把所有构建逻辑塞进一个巨大函数。\r\n\r\n接着处理更新：字段删除之后，旧向量如何失效；同一字段重建是否产生重复；描述修改后如何找到对应的索引记录。若缺少稳定 ID，后续删除和版本对齐会变得困难。\r\n\r\n最后才是检索侧：候选召回、置信度不足时的澄清、字段合法性检查，以及查询执行权限。模型生成 SQL 与允许执行 SQL，需要独立判断。\r\n\r\n## 一个合理的首批验证集\r\n\r\n- 两个同名字段属于不同表，结果应保留所属表。\r\n- 一个指标有两个口径，系统应要求确认或展示差异。\r\n- 元数据字段被删除，旧索引不应继续作为有效证据。\r\n- 某批向量化失败，构建状态应明确报告部分失败。\r\n- 重复构建相同输入，逻辑对象数量不应无故增长。\r\n\r\n先把这些可检查的行为写清楚，才能判断代码增加的是目录数量，还是实际可用能力。当前文章提供的是实现路线与边界说明，不把规划伪装成项目成绩。\r\n",
      "charCount": 1112,
      "minutes": 4
    },
    {
      "id": "docx-markdown",
      "title": "Word 转 Markdown：保住顺序，也认清损失",
      "summary": "从本地转换工具理解段落顺序、样式识别、代码围栏与表格，建立转换后的质量检查。",
      "category": "Python 工具",
      "topic": "python",
      "tags": [
        "Python",
        "Markdown",
        "文档处理"
      ],
      "kind": "工具拆解",
      "date": "2026-10-20",
      "order": 8,
      "level": "入门",
      "status": "已核对源码",
      "scope": "静态阅读转换与质检脚本，未重新转换课程原文件。",
      "sources": [
        {
          "path": "content/references/docx2md-tools.md",
          "start": 1,
          "end": 32,
          "repository": "xiaocha653830-tech.github.io",
          "url": "https://github.com/xiaocha653830-tech/xiaocha653830-tech.github.io/blob/main/content/references/docx2md-tools.md#L1-L32"
        }
      ],
      "markdown": "## 格式转换首先要保留阅读顺序\r\n\r\n整理课程文档时，Word 中往往交替出现段落、表格和代码。若先遍历全部段落，再遍历全部表格，内容虽然没有丢失，顺序却已经错了。\r\n\r\n项目内的[工具核对笔记](https://github.com/xiaocha653830-tech/xiaocha653830-tech.github.io/blob/main/content/references/docx2md-tools.md)记录了这一做法：转换工具遍历文档 body 的子元素，按顺序识别 `w:p` 与 `w:tbl`。这比简单拼接 `document.paragraphs` 和 `document.tables` 更贴近原始叙述。\r\n\r\n```python\r\n# 按本地工具整理的核心片段\r\ndef blocks(doc):\r\n    for child in doc.element.body.iterchildren():\r\n        if child.tag == qn(\"w:p\"):\r\n            yield Paragraph(child, doc)\r\n        elif child.tag == qn(\"w:tbl\"):\r\n            yield Table(child, doc)\r\n```\r\n\r\n这段覆盖的是顶层段落和表格，不应据此认为所有 Word 布局结构都被完整支持。\r\n\r\n## 用样式识别代码，比猜内容更可靠\r\n\r\n工具先检查段落样式是否包含代码样式名称，再根据等宽字体字符比例判断。比例达到 `0.85` 时，会把段落视为代码。\r\n\r\n识别后，它连续收集代码段，在切换回正文或表格之前关闭围栏。这样的状态机可以避免每行代码都生成一个独立代码块，也保留原始代码行的缩进。\r\n\r\n但这是启发式识别：正文可能使用等宽字体，代码也可能缺失统一样式。转换之后仍需要抽查，尤其是代码与普通说明交替出现的位置。\r\n\r\n## 表格转换做了哪些取舍\r\n\r\n工具将单元格中的多行文字合并，以首行生成 Markdown 表头，再补充分隔行。单元格里的竖线被替换为斜杠，避免破坏 Markdown 表格结构。\r\n\r\n这能产生容易阅读的表格，却改变了原始内容表示。若竖线属于代码、逻辑表达式或业务值，就不应静默替换。另一种策略是转义竖线，并明确处理换行和代码片段。\r\n\r\nWord 中合并单元格、复杂嵌套或跨页布局，也不一定能无损映射到普通 Markdown 表格。转换的目标应该事先说清楚：保留技术内容结构，还是追求版式还原。\r\n\r\n## 标题识别也需要边界测试\r\n\r\n现有函数先判断样式名是否含中文“标题”，之后才尝试匹配英文 `heading`。这意味着纯英文 `Heading 1` 样式可能在前面的条件就被排除。\r\n\r\n中文级别映射中也存在非常规映射，例如“二”对应 3，需要确认它是否是针对某份模板的有意设计。将工具推广到其他文档前，应把“模板约定”与“通用标题规则”分开。\r\n\r\n改进时可以先识别标准英文 Heading，再匹配中文自定义样式，并对无法识别的样式输出提示，避免把标题静默转换成正文。\r\n\r\n## 自动质检能做什么\r\n\r\n配套的 `qc.py` 统计标题、围栏和表格数量，并检查围栏数是否为偶数。这是有价值的初筛，但偶数不等于配对一定正确：围栏位置可能不对，内容中也可能出现同样的符号。\r\n\r\n| 检查层次 | 合适的检查 |\r\n| --- | --- |\r\n| 文件层 | 编码、空文件、转换失败记录 |\r\n| 结构层 | 标题层级、围栏闭合、表格列数 |\r\n| 内容层 | 代码缩进、公式、链接、关键术语 |\r\n| 视觉层 | 抽样渲染长表格、嵌套列表与代码段 |\r\n\r\n当前工具会跳过图片样式段落，也没有完整图片资源导出流程。因此它生成的是文本导向的 Markdown，不能描述为保留所有插图的转换器。\r\n\r\n## 从资料到文章，还需要编辑\r\n\r\n转换出来的 Markdown 是素材，不等于适合直接发布的文章。技术博客还要重新组织问题、实现、取舍和验证方式，并标注来源。课程原文、占位配置与本机路径也需要经过整理。\r\n\r\n本博客采用单独的 Markdown 文章与元数据清单维护内容，让资料转换和文章发布成为两步明确的工作。这样后续修改标题、分类和正文，都不需要进入页面渲染函数。\r\n",
      "charCount": 1414,
      "minutes": 5
    }
  ]
};
