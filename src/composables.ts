import { inject } from 'vue'
import { injectionKey } from './i18n'
import type { I18nInstance } from './types'

export function useI18n<const Locale extends string = string>() {
  return inject(injectionKey) as unknown as I18nInstance<Locale>
}
