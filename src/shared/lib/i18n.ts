import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: navigator.language,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
