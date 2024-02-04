import { SSRConfig } from "next-i18next";
import { StringLocale } from "yup/lib/locale";

export const localeNSExists = (
  config: SSRConfig,
  locale: string | string[],
  ns: string
) => {
  const translations = config._nextI18Next.initialI18nStore;

  const locales = Array.isArray(locale) ? locale : [locale];

  for (let i = 0; i < locales.length; i++) {
    const currentLocale = locales[i];

    const currentLocaleTranslations = translations[currentLocale][ns];

    if (Object.keys(currentLocaleTranslations).length === 0) {
      return false;
    }
  }

  return true;
};
