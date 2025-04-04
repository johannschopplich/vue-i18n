import type { I18nInstance } from './types'
import { inject } from 'vue'
import { injectionKey } from './i18n'

export function useI18n<
  Locale extends string = string,
  Messages extends Record<string, unknown> = Record<string, unknown>,
>() {
  return inject(injectionKey)! as unknown as I18nInstance<Locale, Messages>
}
