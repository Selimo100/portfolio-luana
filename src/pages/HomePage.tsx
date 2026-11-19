import { useTranslation } from 'react-i18next'
import { Hero } from '../sections/Hero/Hero'
import { SelectedWork } from '../sections/SelectedWork/SelectedWork'
import { About } from '../sections/About/About'
import { Expertise } from '../sections/Expertise/Expertise'
import { Journey } from '../sections/Journey/Journey'
import { Contact } from '../sections/Contact/Contact'
import { useSeo } from '../hooks/useSeo'
import { useLanguage } from '../hooks/useLanguage'
import { homePath } from '../lib/routes'

const alternates = { de: homePath('de'), en: homePath('en') }

export function HomePage() {
  const { t } = useTranslation()
  const lang = useLanguage()
  useSeo({ title: t('meta.homeTitle'), description: t('meta.homeDescription'), lang, alternates })

  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <Expertise />
      <Journey />
      <Contact />
    </>
  )
}
