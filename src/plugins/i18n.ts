import { nextTick, Ref } from 'vue';
import { createI18n, I18nOptions, I18n } from 'vue-i18n';

import { useLocalStorage } from '@vueuse/core';

const lang = useLocalStorage('app-lang', 'en');

const SUPPORT_LOCALES = ['en', 'ru'];

const I18N_OPTIONS: I18nOptions = {
  locale: (lang as Ref<string>).value,
  fallbackLocale: 'en',
  availableLocales: SUPPORT_LOCALES,
};

function setI18nLanguage(i18n: I18n, locale: string): void {
  i18n.global.locale = locale;
  (lang as Ref<string>).value = locale;

  const html: HTMLElement | null = document.querySelector('html');
  html?.setAttribute('lang', locale);
}

async function loadLocaleMessages(i18n: I18n, locale: string): Promise<void> {
  const message = await import(
    /* webpackChunkName: "locale-[request]" */ `@/locales/${locale}.json`
  );

  i18n.global.setLocaleMessage(locale, message.default);

  return nextTick();
}

const i18n = createI18n(I18N_OPTIONS);
setI18nLanguage(i18n, i18n.global.locale);

export { i18n, setI18nLanguage, loadLocaleMessages };
