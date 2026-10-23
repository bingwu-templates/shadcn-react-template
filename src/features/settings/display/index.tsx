import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'

export function SettingsDisplay() {
  return (
    <ContentSection title='显示' desc='选择要在应用中显示的项目。'>
      <DisplayForm />
    </ContentSection>
  )
}
