# V2 Views Migration Design

## Goal

Develop the non-dashboard pages from the v2 project at `F:\work\vue\ThirdParty\vue-admin-cloud\src\views` in the v5 project at `F:\work\vue\Autonomy\vue-admin-cloud\apps\web-antd\src\views`.

The v2 `dashboard` folder is out of scope. Existing v5 pages stay in place, but pages with garbled Chinese copy or incomplete v5 adaptation are included for cleanup when their module is reached.

## Scope

The source page inventory is all v2 `src/views/**/index.vue` pages except those under `dashboard`. The v5 target uses the `apps/web-antd` app structure.

Initial inventory:

- `fs/call`
- `fs/logic_flow`
- `index/home/workbench`
- `index/system/config`
- `index/system/department` already exists in v5
- `index/system/dictionary`
- `index/system/logs`
- `index/system/menu` already exists in v5
- `index/system/notice`
- `index/system/oauth_client`
- `index/system/position` already exists in v5
- `index/system/privilege` already exists in v5
- `index/system/role` already exists in v5
- `index/system/sms/mobile_message`
- `index/system/sms/mobile_message_template`
- `index/system/sms/sms_config`
- `index/system/tenant` already exists in v5
- `index/system/user` already exists in v5
- `oa/deploy`
- `oa/historic`
- `oa/need`
- `oa/repository`
- `sys/about` covered by v5 `_core/about`
- `sys/error-log`
- `sys/iframe`
- `sys/lock`
- `sys/redirect`
- `video/dispatch`
- `video/media`
- `video/platform`
- `video/play`
- `video/play/channel`
- `video/play/record`
- `video/proxy`
- `video/push`
- `work/leave`
- `work/oa`
- `work/personal`

## Migration Order

Use the v2 directory order as the working order:

1. `fs`
2. `index/home`
3. `index/system`
4. `oa`
5. `sys`
6. `video`
7. `work`

Within each module, implement pages in the source inventory order above. This gives predictable progress and makes it easy to compare against the v2 source tree.

## Architecture

Each migrated page is a v5-native implementation, not a direct component copy. v2 components such as `BasicTable`, `BasicForm`, drawers, upload wrappers, and old layout components are replaced with v5 equivalents already used in the current codebase.

Default page structure:

- View entry: `apps/web-antd/src/views/<module>/<page>/index.vue`
- Page-local schema/helpers: `data.ts` or `modules/data.ts`
- Page-local modal/drawer/form components: `modules/*.vue`
- API wrapper: `apps/web-antd/src/api/<domain>/<resource>.ts`
- Shared exports: update `apps/web-antd/src/api/<domain>/index.ts` only when a domain index exists and the local pattern uses it

The implementation should follow existing v5 system pages:

- `Page` from `@vben/common-ui`
- `useVbenVxeGrid` from `#/adapter/vxe-table`
- `useVbenModal` for modal forms
- `VbenFormSchema` and `z` from `#/adapter/form`
- `requestClient` from `#/api/request`
- `ant-design-vue` for confirmation, feedback, and specialized controls
- v5 permission checks with `v-access:code` and `useAccess`

## Data Flow

List pages load data through v5 API wrappers. Table pagination maps vxe-table page state to the backend's `pageNumber` and `pageSize` parameters, matching existing v5 pages.

Create, update, delete, detail, tree, and auxiliary operations are implemented through typed API functions. API endpoint paths are taken from v2 unless v5 already has the endpoint wrapper.

For backend-driven menus, page component paths must be available under v5 `apps/web-antd/src/views` so the existing dynamic route loader can resolve them. Do not add static routes unless a page is not backend-menu driven or is part of v5 core routing.

## Existing Page Cleanup

When an existing v5 page is reached in the migration order, check it against v2 behavior and current v5 conventions. Cleanup includes:

- Fix garbled Chinese text in labels, titles, messages, and comments.
- Keep or improve existing i18n use where it is already present.
- Align permission codes with the v2/v5 menu permission format.
- Confirm API wrappers return the data shape expected by the v5 grid or form.
- Avoid unrelated refactors.

Known current cleanup target: `apps/web-antd/src/views/index/system/tenant`.

## Error Handling

Destructive actions use `Modal.confirm` where the user needs a choice, then show loading feedback while the backend request is in progress. On success, refresh the grid or tree. On failure, close loading feedback and show an error message when the existing module pattern does so.

Forms validate required fields and obvious field formats before saving. Validation should use v5 form schemas and `z` refinements, not ad hoc checks in submit handlers unless the field is inherently custom.

## Testing And Verification

Use focused verification per batch:

- TypeScript or project type check for touched app code.
- Lint/format checks for changed files where repo scripts support them.
- Unit tests only when a page introduces extractable logic worth testing.
- Manual browser verification for complex pages with special UI, such as video playback, logic flow, and call controls.

For page batches that are mostly schema-driven CRUD, verification can rely on type/lint checks plus smoke testing that the route component loads and grid queries are wired.

## Out Of Scope

- v2 `dashboard` pages.
- Backend schema changes.
- Replacing the backend-driven menu system.
- Large redesigns unrelated to v2 feature parity.
- Rewriting already working v5 core pages unless a backend menu path requires a compatibility page.

## Acceptance Criteria

- Every non-dashboard v2 view page has a v5-native page or a documented v5 equivalent.
- Backend menu component paths resolve to existing v5 view components.
- Existing migrated pages touched during the process no longer display garbled Chinese text.
- CRUD pages use v5 table, form, modal, API, and permission patterns.
- Each completed batch has run relevant verification commands and has a concise result recorded in the implementation notes or commit message.
