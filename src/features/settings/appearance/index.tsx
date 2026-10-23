import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title='外观'
      desc='自定义应用外观，支持浅色、深色主题及跟随系统设置。'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
