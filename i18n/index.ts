// i18n/index.ts
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

// Configurar i18n
const i18n = new I18n({
  es,
  en,
  pt,
});

// Obtener el idioma del dispositivo
const deviceLanguage = getLocales()[0]?.languageCode || 'es';

// Establecer el idioma por defecto basado en el dispositivo
i18n.locale = deviceLanguage;

// Habilitar fallback al español si no encuentra la traducción
i18n.enableFallback = true;
i18n.defaultLocale = 'es';

export default i18n;