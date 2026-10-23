import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection title='个人资料' desc='设置其他用户看到的个人资料。'>
      <ProfileForm />
    </ContentSection>
  )
}
