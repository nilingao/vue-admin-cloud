# Vue Vben Admin 项目概览

这是一个基于 Vue Vben Admin 是 Vue Vben Admin 的升级版本。作为一个免费开源的中后台模板，它采用了最新的 Vue 3、Vite、TypeScript 等主流技术开发，开箱即用，可用于中后台前端开发。

## 项目特点

- **最新技术栈**：使用 `Vue3`、`Vite`、`TypeScript` 等前端前沿技术开发。
- **国际化**：内置完善的国际化方案，支持多语言切换。
- **权限验证**：完善的权限验证方案，按钮级别权限控制。
- **多主题**：内置多种主题配置和黑暗模式，满足个性化需求。
- **动态菜单**：支持动态菜单，可以根据权限配置显示菜单。
- **组件丰富**：提供了丰富的组件，可以满足大部分的业务需求。
- **规范**：代码规范，使用 `ESLint`、`Prettier`、`Stylelint`、`Publint`、`CSpell` 等工具保证代码质量。
- **UI库支持**：支持 `Ant Design Vue` 主流 UI 库。

## 核心配置文件

- [package.json](mdc:package.json) - 项目依赖和脚本配置
- [vitest.config.ts](mdc:vitest.config.ts) - Vitest 构建配置

## 主要目录结构

```bash
├── README.md # 项目说明文档
├── apps # 项目应用目录
│   ├── web-antd # 基于 Ant Design Vue 的前端应用
├── cspell.json # CSpell 配置文件
├── eslint.config.mjs # ESLint 配置文件
├── internal # 内部工具目录
│   ├── lint-configs # 代码检查配置
│   │   ├── commitlint-config # Commitlint 配置
│   │   ├── eslint-config # ESLint 配置
│   │   ├── prettier-config # Prettier 配置
│   │   └── stylelint-config # Stylelint 配置
│   ├── node-utils # Node.js 工具
│   ├── tailwind-config # Tailwind 配置
│   ├── tsconfig # 通用 tsconfig 配置
│   └── vite-config # 通用Vite 配置
├── package.json # 项目依赖配置
├── packages # 项目包目录
│   ├── @core # 核心包
│   │   ├── base # 基础包
│   │   │   ├── design # 设计相关
│   │   │   ├── icons # 图标
│   │   │   ├── shared # 共享
│   │   │   └── typings # 类型定义
│   │   ├── composables # 组合式 API
│   │   ├── preferences # 偏好设置
│   │   └── ui-kit # UI 组件集合
│   │       ├── layout-ui # 布局 UI
│   │       ├── menu-ui  # 菜单 UI
│   │       ├── shadcn-ui # shadcn UI
│   │       └── tabs-ui # 标签页 UI
│   ├── constants # 常量
│   ├── effects # 副作用相关包
│   │   ├── access # 访问控制
│   │   ├── plugins # 第三方大型依赖插件
│   │   ├── common-ui # 通用 UI
│   │   ├── hooks # 组合式 API
│   │   ├── layouts # 布局
│   │   └── request # 请求
│   ├── icons # 图标
│   ├── locales # 国际化
│   ├── preferences  # 偏好设置
│   ├── stores # 状态管理
│   ├── styles # 样式
│   ├── types # 类型定义
│   └── utils # 工具
├── playground # 演示目录
├── pnpm-lock.yaml # pnpm 锁定文件
├── pnpm-workspace.yaml # pnpm 工作区配置文件
├── scripts # 脚本目录
│   ├── turbo-run # Turbo 运行脚本
│   └── vsh # VSH 脚本
├── stylelint.config.mjs # Stylelint 配置文件
├── turbo.json # Turbo 配置文件
├── vben-admin.code-workspace # VS Code 工作区配置文件
└── vitest.config.ts # Vite 配置文件
```

## 开发命令

- `npm i -g corepack` - 安装 corepack
- `pnpm install` - 安装依赖
- `pnpm dev` - 开发环境启动
- `pnpm build` - 构建生产版本

## Vue 组件规范

- 使用 Composition API 和 `<script setup>` 语法
- 组件文件使用 PascalCase 命名
- 页面文件放在 `apps/web-antd/src/views/` 目录下
- 组件文件放在 `apps/web-antd/src/components/` 目录下

## TypeScript 规范

- 严格使用 TypeScript，避免使用 `any` 类型
- 为 API 响应数据定义接口类型
- 使用 `interface` 定义对象类型，`type` 定义联合类型
- 导入类型时使用 `import type` 语法

## 国际化支持

- 在组件中使用国际化
- 国际化文件放在 `apps/web-antd/src/locales` 目录下
- 保证 zh-CN 为默认语言，其他语言为扩展语言 都要添加
- 使用 `$t` 函数进行国际化

```vue
<script lang="ts" setup>
import { $t } from '@vben/locales';
$t('system.role.editRole');
</script>
```

## 状态管理

- 使用 Pinia 进行状态管理
- Store 文件放在 `apps/web-antd/src/store/` 目录下
- 使用 `defineStore` 定义 store
- 支持持久化存储

## Tailwind 原子化 CSS

- 项目使用 Tailwind 作为原子化 CSS 框架
- 配置在 [uno.config.ts](mdc:internal/tailwind-config/src/index.ts)
- 支持预设和自定义规则
- 优先使用原子化类名，减少自定义 CSS

## Vue SFC 组件规范

- `<script setup>` 标签必须是第一个子元素
- `<template>` 标签必须是第二个子元素
- `<style scoped>` 标签必须是最后一个子元素（因为推荐使用原子化类名，所以很可能没有）

## 页面开发

- 页面文件放在 [apps/web-antd/src/views/](mdc:apps/web-antd/src/views/) 目录下

## 组件开发

- 组件文件放在 [apps/web-antd/src/components/](mdc:apps/web-antd/src/) 目录下
- 使用 项目 内置组件
- 支持 Ant Design Vue 第三方组件库
- 自定义组件遵循 `Vue3`、`Vite`、`TypeScript` 组件规范

## 平台适配

- web平台适配
- 注意平台的 API 差异

## Git 贡献提交规范

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `ci` 持续集成
- `types` 类型定义文件更改

## 示例代码结构

```vue
<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doDelete,
  doExportEntityInfo,
  doExportUrl,
  getUserPage,
} from '#/api/sys/user';

import ExportCommonModel from './component/export/ExportCommonModel.vue';
import { useColumns, useGridFormSchema } from './component/model';
import Form from './component/SettingUserModel.vue';

const router = useRouter();
const state = reactive({
  formValues: {},
});
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [ExportModel, exportModalApi] = useVbenModal({
  connectedComponent: ExportCommonModel,
  destroyOnClose: true,
});

/**
 * 编辑用户
 * @param row
 */
function onEdit(row: TenantModel) {
  formModalApi.setData(row).open();
}

/**
 * 创建用户
 */
function onCreate() {
  formModalApi.setData(null).open();
}
/**
 * 导出用户
 */
function onExport() {
  // 获取查询参数
  exportModalApi
    .setData({
      searchParam: state.formValues,
      paramApi: doExportEntityInfo,
      exportApi: doExportUrl,
    })
    .open();
}
const successExport = () => {
  message.success('导出成功');
};

/**
 * 删除用户
 */
function onDelete(row: any) {
  const hideLoading = message.loading({
    content: `正在删除 昵称为：${row.nickName}`,
    duration: 0,
    key: 'action_process_msg',
  });
  doDelete({ id: row.id })
    .then(() => {
      message.success({
        content: '删除成功',
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({ code, row }: OnActionClickParams<TenantModel>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'detail': {
      router.push(`/system/user/user_detail/${row.id}`);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    // fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          state.formValues = formValues;
          return await getUserPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions,
});

/**
 * 刷新表格
 */
function refreshGrid() {
  gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <ExportModel @success="successExport" />
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          class="mr-2"
          v-access:code="'system.user:add'"
          @click="onCreate"
        >
          <Plus class="size-5" />
          添加
        </Button>
        <Button
          type="primary"
          v-access:code="'system.user:export'"
          @click="onExport"
        >
          <Plus class="size-5" />
          导出
        </Button>
      </template>
    </Grid>
  </Page>
</template>
```

## 生命周期

- 使用 vue3 页面生命周期
- onMounted、onBeforeUnmount、onUnmounted、onBeforeMount、onBeforeUpdate、onUpdated
- 组件生命周期遵循 Vue3 规范
- 注意页面栈和导航管理
