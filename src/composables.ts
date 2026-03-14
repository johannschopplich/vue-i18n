import type { I18nInstance } from './types'
import { inject } from 'vue'
import { injectionKey } from './i18n'

export function useI18n<
  Locale extends string = string,
  Messages extends Record<string, unknown> = Record<string, unknown>,
>() {
  const i18n = inject(injectionKey)
  if (!i18n)
    throw new Error('[vue-i18n] No i18n instance found. Did you forget to call `app.use(i18n)`?')
  return i18n as unknown as I18nInstance<Locale, Messages>
}
