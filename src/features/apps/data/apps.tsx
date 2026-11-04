import { IconDiscord } from '@/assets/brand-icons/icon-discord'
import { IconDocker } from '@/assets/brand-icons/icon-docker'
import { IconFigma } from '@/assets/brand-icons/icon-figma'
import { IconGithub } from '@/assets/brand-icons/icon-github'
import { IconGitlab } from '@/assets/brand-icons/icon-gitlab'
import { IconGmail } from '@/assets/brand-icons/icon-gmail'
import { IconMedium } from '@/assets/brand-icons/icon-medium'
import { IconNotion } from '@/assets/brand-icons/icon-notion'
import { IconSkype } from '@/assets/brand-icons/icon-skype'
import { IconSlack } from '@/assets/brand-icons/icon-slack'
import { IconStripe } from '@/assets/brand-icons/icon-stripe'
import { IconTelegram } from '@/assets/brand-icons/icon-telegram'
import { IconTrello } from '@/assets/brand-icons/icon-trello'
import { IconWhatsapp } from '@/assets/brand-icons/icon-whatsapp'
import { IconZoom } from '@/assets/brand-icons/icon-zoom'

export const apps = [
  {
    name: 'Telegram',
    logo: <IconTelegram />,
    connected: false,
    desc: '连接 Telegram，随时进行实时沟通。',
  },
  {
    name: 'Notion',
    logo: <IconNotion />,
    connected: true,
    desc: '轻松同步 Notion 页面，让团队协作更顺畅。',
  },
  {
    name: 'Figma',
    logo: <IconFigma />,
    connected: true,
    desc: '集中查看 Figma 设计稿，与团队协同设计。',
  },
  {
    name: 'Trello',
    logo: <IconTrello />,
    connected: false,
    desc: '同步 Trello 卡片，让项目管理更高效。',
  },
  {
    name: 'Slack',
    logo: <IconSlack />,
    connected: false,
    desc: '集成 Slack，提升团队沟通效率。',
  },
  {
    name: 'Zoom',
    logo: <IconZoom />,
    connected: true,
    desc: '直接在工作台发起 Zoom 会议。',
  },
  {
    name: 'Stripe',
    logo: <IconStripe />,
    connected: false,
    desc: '轻松管理 Stripe 交易与收付款。',
  },
  {
    name: 'Gmail',
    logo: <IconGmail />,
    connected: true,
    desc: '便捷查看和管理 Gmail 邮件。',
  },
  {
    name: 'Medium',
    logo: <IconMedium />,
    connected: false,
    desc: '在工作台发现并分享 Medium 文章。',
  },
  {
    name: 'Skype',
    logo: <IconSkype />,
    connected: false,
    desc: '轻松联系 Skype 好友，保持沟通。',
  },
  {
    name: 'Docker',
    logo: <IconDocker />,
    connected: false,
    desc: '在工作台轻松管理 Docker 容器。',
  },
  {
    name: 'GitHub',
    logo: <IconGithub />,
    connected: false,
    desc: '集成 GitHub，让代码管理更便捷。',
  },
  {
    name: 'GitLab',
    logo: <IconGitlab />,
    connected: false,
    desc: '集成 GitLab，高效管理代码项目。',
  },
  {
    name: 'Discord',
    logo: <IconDiscord />,
    connected: false,
    desc: '连接 Discord，让团队交流更顺畅。',
  },
  {
    name: 'WhatsApp',
    logo: <IconWhatsapp />,
    connected: false,
    desc: '集成 WhatsApp，便捷收发即时消息。',
  },
]
