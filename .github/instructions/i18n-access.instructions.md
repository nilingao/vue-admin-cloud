---
description: "Use when writing UI text, labels, messages, permission checks, or access-controlled buttons in apps/web-antd. Covers i18n $t() conventions, locale json organization, v-access directive, and hasAccessByCodes."
applyTo: "apps/web-antd/src/**"
---

# i18n 与权限约定

## i18n

- 界面文案一律 `$t()`，**禁止硬编码**；导入统一用 `import { $t } from '#/locales';`
- key 格式 `<模块>.<实体>.<字段>`（如 `system.menu.menuName`）；通用文案复用现有 key：
  - `ui.formRules.required` / `ui.formRules.selectRequired` / `ui.formRules.minLength` / `ui.formRules.maxLength`
  - `ui.actionMessage.deleting` 等操作提示
  - `common.enabled` / `common.disabled` / `common.delete` / `common.edit` / `common.detail`
- 语言包按模块分 json：`src/locales/langs/zh-CN/<模块>.json` 与 `en-US/<模块>.json`，**新增 key 必须两个语言文件同步添加**（`import.meta.glob` 自动加载，无需注册）
- 模板中直接用 `$t('key')`（全局注入）；`.ts` 文件中需显式导入

## 权限

- 路由/菜单由后端动态生成（`accessMode: 'backend'`），前端**不要**为业务页面添加静态路由
- 按钮级权限：模板用 `v-access:code="'模块.实体:add'"`；脚本/列配置用：

```ts
import { useAccess } from '@vben/access';
const { hasAccessByCodes } = useAccess();
// 如 CellOperation 列：show: () => hasAccessByCodes(['system.position:update'])
```

- 权限码格式 `<模块>.<实体>:<动作>`，动作取 `add` / `update` / `delete` / `query` 等，与后端菜单管理中的权限标识一致
