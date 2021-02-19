// Infrastructure required to use next-i18next for translations.

const NextI18Next = require('next-i18next').default;
const path = require('path');

const NextI18NextInstance = new NextI18Next({
  // More options here: https://github.com/isaachinman/next-i18next#options
  defaultLanguage: 'en',
  fallbackLng: 'en',
  // TODO(hannah): Restore when we have Spanish translations!
  // otherLanguages: ['es'],

  // Our custom set up was leading to 404 errors or build errors (when using
  // static/locales or just locales, respectively). Solution inspired by
  // https://github.com/isaachinman/next-i18next/issues/596
  localePath: typeof window === 'undefined'
    ? path.resolve('./static/locales')
    : path.resolve('./locales'),
});

// NOTE(hannah): We could export NextI18NextInstance directly, but this gives
// us a better idea of what we're making available / using.
const {
  i18n,
  appWithTranslation,
  withTranslation,
} = NextI18NextInstance;

module.exports = {
  i18n,
  appWithTranslation,
  withTranslation,
};
