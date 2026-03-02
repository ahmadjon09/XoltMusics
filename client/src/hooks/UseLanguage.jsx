import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../locales/translations'

const LanguageContext = createContext()

export const LANGUAGES = {
  RU: 'ru',
  UZ: 'uz'
}

const isValidLang = (x) => Object.values(LANGUAGES).includes(x)

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return isValidLang(saved) ? saved : LANGUAGES.UZ
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => translations?.[language]?.[key] ?? key

  const changeLanguage = (lang) => {
    setLanguage(isValidLang(lang) ? lang : LANGUAGES.UZ)
  }

  const value = useMemo(() => ({
    language,
    changeLanguage,
    t,
    LANGUAGES
  }), [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider')
  return context
}
