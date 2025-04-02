import type { LocaleMessages } from '@byjohann/vue-i18n'
import { createI18n } from '@byjohann/vue-i18n'

// Auto-load translations
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<LocaleMessages>('./locales/*.json', { eager: true }),
  ).map(([key, value]) => [key.slice(10, -5), value]),
)

const i18n = createI18n({
  defaultLocale: 'de',
  locales: [...Object.keys(messages), 'fr'],
  messages,
})

export { i18n }
