# Copilot 项目指令

## ⚠️⚠️⚠️ 最高优先级规则 — 会话开始第一件事必读 ⚠️⚠️⚠️

> **本项目已建立 CodeGraph 索引（`.codegraph/` 目录）。**
>
> 在理解代码、定位符号、分析调用链或进行代码修改前，**必须优先使用 `codegraph_explore` 工具**，而非手动 grep 或逐个读取文件。
>
> **违反此规则属于严重错误。** 不要用 `read_file` / `list_dir` / `grep_search` 去摸索代码结构——这些工具仅用于 codegraph 未覆盖的场景（配置文件 `.env`、文档 `.md` 等）。
>
> ### 正确流程
> 1. 分析项目/代码 → 先 `codegraph_explore` 查询架构/入口/核心符号
> 2. 定位符号 → `codegraph_explore` 传入符号名或文件名
> 3. 分析调用链 → `codegraph_explore` 命名流程两端符号
> 4. 编辑前 → `codegraph_explore` 查看源码 + blast radius
> 5. 仅配置文件/文档 → 才用 `read_file` / `grep_search`

## ⚡ 优先使用 CodeGraph

本项目已建立 CodeGraph 索引（`.codegraph/` 目录）。在理解代码、定位符号、分析调用链或进行代码修改前，**必须优先使用 `codegraph_explore` 工具**，而非手动 grep 或逐个读取文件。

- **查询代码** → 用 `codegraph_explore`，传入符号名、文件名或自然语言问题
- **分析调用链/流程** → 用 `codegraph_explore`，命名流程两端的符号，它会返回调用路径
- **编辑前** → 先用 `codegraph_explore` 查看目标符号源码及影响范围（blast radius）
- 仅在 codegraph 未覆盖的场景（配置文件、文档等）才使用 `read_file` / `grep_search`

## 📖 使用工具/技术前先加载已有文档

本项目在 `.github/instructions/` 目录下维护了完整的工具用法指令文件（`.instructions.md`，带 YAML frontmatter）。这些文件会根据 `applyTo` 模式**自动附加**到匹配的文件上下文中，也可手动 `read_file` 加载。**在编写任何涉及插件、工具函数、组件、API、Store 的代码前，必须先加载对应指令文档，按文档中已验证的用法编写，不得自行摸索新写法。**

> **违反此规则属于严重错误。** 不要凭记忆或猜测编写工具调用代码——先加载文档确认正确用法。
