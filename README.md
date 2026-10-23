# Admin Workspace

基于 React、TypeScript、Vite、Tailwind CSS 和 shadcn/ui 的后台开发骨架。

## 本地开发

使用 Node.js 22.22.1+（推荐 Node.js 24）和 pnpm 10。

```bash
pnpm install
pnpm dev
```

无需配置环境变量。文件路由由 TanStack Router 在开发和构建时自动生成，勿手动编辑 `src/routeTree.gen.ts`。

## 保留功能

- 仪表盘与图表、任务表格、用户管理。
- 资料、账户、外观、通知和显示设置，以及帮助中心占位页。
- 登录、注册、找回密码、OTP 和错误页面。
- 响应式侧栏、公共顶栏、浅色/深色/跟随系统主题。
- React Query 与 axios 请求基础，Zustand 状态管理。

页面继续使用模拟数据；表单、增删改和认证操作保留演示行为。登录会在本地写入模拟令牌，后台路由当前没有认证守卫。实际业务使用前需接入后端与认证校验。

已移除聊天、应用集成、Clerk、双栏登录页，以及全局命令搜索、RTL、字体切换和布局配置面板。

## 项目结构

| 目录                    | 用途                          |
| ----------------------- | ----------------------------- |
| `src/routes`            | 文件路由与路由参数校验        |
| `src/features`          | 页面、业务组件及模拟数据      |
| `src/components/layout` | 公共布局与侧栏导航            |
| `src/components/ui`     | 当前页面使用的 shadcn/ui 组件 |
| `src/context`           | 主题状态                      |
| `src/stores`            | 本地模拟认证状态              |
| `src/lib`、`src/hooks`  | 公共工具与 hooks              |
| `src/test-utils`        | 浏览器测试辅助工具            |

导航配置位于 `src/components/layout/data/sidebar-data.ts`。新增组件和依赖按业务需要引入。

## 检查与构建

```bash
pnpm lint
pnpm lint:fix # 自动修复 lint 问题
pnpm format:check
pnpm knip
pnpm test:browser:install # 首次运行测试时安装 Chromium
pnpm test
pnpm build
pnpm preview
```

测试使用 Vitest 浏览器模式和 Playwright Chromium；`pnpm test:watch` 用于监听测试，`pnpm test:coverage` 生成覆盖率报告。`pnpm format` 自动格式化代码。

代码检查使用 Oxlint，格式化使用 Oxfmt，配置分别位于 `oxlint.config.ts`、`oxfmt.config.ts`。Oxlint 优先使用原生规则，TanStack Query 和尚无原生实现的 React Hooks 规则通过 JS 插件补齐。保留现有 import 分组与 Tailwind 类名排序，副作用 import 保持原位置。

`pnpm install` 会通过 `prepare` 自动安装 simple-git-hooks。提交前，`lint-staged.config.ts` 仅检查暂存文件：TypeScript 文件先执行 lint 自动修复，再格式化；其他受支持的文件只格式化。修复结果会自动暂存，检查失败会阻止提交；部分暂存文件中尚未暂存的修改由 lint-staged 自动保护和恢复。也可运行 `pnpm lint:staged` 手动检查。

lint 继续跳过 `src/components/ui`，格式化沿用原有文件范围；两者都跳过自动生成的 `src/routeTree.gen.ts`。CI 使用 Node.js 24，执行代码检查、格式检查、未使用代码检查、浏览器测试和构建。

## 许可

基于 [shadcn-admin](https://github.com/satnaing/shadcn-admin) 改造。保留原作者版权声明，使用 [MIT License](LICENSE)。
