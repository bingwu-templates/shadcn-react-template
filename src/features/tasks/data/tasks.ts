import { faker } from '@faker-js/faker'

const taskExamples = [
  {
    title: '完善用户注册表单校验',
    description: '补充邮箱格式、密码强度和必填项校验，并优化错误提示。',
  },
  {
    title: '修复移动端导航菜单显示异常',
    description: '检查小屏幕下的菜单展开与收起行为，确保所有导航项可正常访问。',
  },
  {
    title: '更新项目部署文档',
    description: '整理构建步骤、环境配置和发布流程，补充常见问题说明。',
  },
  {
    title: '优化仪表盘图表加载体验',
    description: '检查数据加载状态，减少布局跳动并改善图表在不同屏幕下的显示。',
  },
  {
    title: '新增任务筛选功能',
    description: '支持按任务状态、优先级和关键字筛选，保留筛选结果及分页状态。',
  },
  {
    title: '排查用户权限配置问题',
    description: '核对不同角色的访问范围，修复权限判断与界面提示不一致的问题。',
  },
  {
    title: '整理组件使用说明',
    description: '为常用表单、弹窗和表格组件补充示例，统一交互与文案规范。',
  },
  {
    title: '改进账户安全通知',
    description: '完善登录提醒和安全设置说明，确保通知内容清晰易懂。',
  },
  {
    title: '修复任务列表分页问题',
    description: '检查筛选后的页码边界，确保切换每页条数时列表显示正确。',
  },
  {
    title: '优化深色主题对比度',
    description: '调整文字、边框和状态标记的对比度，提升深色模式下的可读性。',
  },
] as const

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const tasks = Array.from({ length: 100 }, () => {
  const statuses = [
    'todo',
    'in progress',
    'done',
    'canceled',
    'backlog',
  ] as const
  const labels = ['bug', 'feature', 'documentation'] as const
  const priorities = ['low', 'medium', 'high'] as const

  return {
    id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: faker.lorem.sentence({ min: 5, max: 15 }),
    status: faker.helpers.arrayElement(statuses),
    label: faker.helpers.arrayElement(labels),
    priority: faker.helpers.arrayElement(priorities),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    assignee: faker.person.fullName(),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    dueDate: faker.date.future(),
  }
}).map((task, index) => ({
  ...task,
  ...taskExamples[index % taskExamples.length],
}))
