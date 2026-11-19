import { useLayoutEffect } from 'react'
import { Navigate, Outlet, createBrowserRouter, useLocation, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ProjectPage } from './pages/ProjectPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { isLanguage, site } from './config/site'
import { readStoredLanguage, storeLanguage } from './i18n/config'

/** Keeps i18next, <html lang> and the stored preference in sync with the URL. */
function AppShell() {
  const { i18n } = useTranslation()
  const { pathname } = useLocation()
  const segment = pathname.split('/')[1]
  const lang = isLanguage(segment) ? segment : (readStoredLanguage() ?? site.defaultLanguage)

  useLayoutEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang)
    document.documentElement.lang = lang === 'de' ? 'de-CH' : 'en'
    if (isLanguage(segment)) storeLanguage(segment)
  }, [i18n, lang, segment])

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function RootRedirect() {
  const { hash } = useLocation()
  return <Navigate to={`/${readStoredLanguage() ?? site.defaultLanguage}${hash}`} replace />
}

function LanguageGuard() {
  const { lang } = useParams()
  return isLanguage(lang) ? <Outlet /> : <NotFoundPage />
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <RootRedirect /> },
      {
        path: '/:lang',
        element: <LanguageGuard />,
        children: [
          { index: true, element: <HomePage /> },
          { path: ':segment/:slug', element: <ProjectPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
