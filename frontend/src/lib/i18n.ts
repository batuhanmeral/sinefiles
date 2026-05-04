import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const defaultLang = (import.meta.env.VITE_DEFAULT_LANGUAGE as string | undefined) ?? 'tr';

void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: defaultLang,
    supportedLngs: ['tr', 'en'],
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;
