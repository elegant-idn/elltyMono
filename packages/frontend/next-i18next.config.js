/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'mx', 'ru', 'br', 'uk'],
    fallbackLng: false,
  },
  debug: process.env.NODE_ENV === 'development',
};