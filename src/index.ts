import type { I18nInstance } from './types'

declare module 'vue' {
  interface ComponentCustomProperties {
    $i18n: I18nInstance
    $t: I18nInstance['t']
  }
}

export { useI18n } from './composables'
export { createI18n } from './i18n'
export * from './types'
