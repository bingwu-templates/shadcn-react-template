import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection title='账户' desc='更新账户信息并查看界面语言。'>
      <AccountForm />
    </ContentSection>
  )
}
