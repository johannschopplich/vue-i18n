import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { useI18n } from '../src/composables'
import { createI18n } from '../src/i18n'

describe('createI18n', () => {
  it('should apply defaults and infer locales from messages', () => {
    const i18n = createI18n({
      messages: {
        en: { hello: 'Hello' },
        de: { hello: 'Hallo' },
      },
    })
    expect(i18n.defaultLocale).toBe('en')
    expect(i18n.locales).toEqual(['en', 'de'])
    expect(i18n.t('hello')).toBe('Hello')
  })

  it('should use an explicitly provided locales list', () => {
    const i18n = createI18n({
      locales: ['en'],
      messages: {
        en: { hello: 'Hello' },
        de: { hello: 'Hallo' },
      },
    })
    expect(i18n.locales).toEqual(['en'])
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    i18n.setLocale('de')
    expect(warnSpy).toHaveBeenCalled()
    expect(i18n.locale.value).toBe('en')
    warnSpy.mockRestore()
  })
})

describe('t', () => {
  it('should interpolate named parameters', () => {
    const i18n = createI18n({
      messages: {
        en: { greeting: 'Hello, {name}!' },
      },
    })
    expect(i18n.t('greeting', { name: 'World' })).toBe('Hello, World!')
  })

  it('should warn and return empty string for non-string keys', () => {
    const i18n = createI18n({
      messages: { en: {} },
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(i18n.t(123 as any)).toBe('')
    expect(warnSpy).toHaveBeenCalledWith('[vue-i18n]', 'Message "123" must be a string')
    warnSpy.mockRestore()
  })

  it('should warn and return empty string for empty keys', () => {
    const i18n = createI18n({
      messages: { en: {} },
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(i18n.t('')).toBe('')
    expect(warnSpy).toHaveBeenCalledWith('[vue-i18n]', 'Message key is empty')
    warnSpy.mockRestore()
  })

  it('should return the key when the message is not found', () => {
    const i18n = createI18n({
      messages: { en: {} },
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(i18n.t('missing.key')).toBe('missing.key')
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('should suppress warnings when logLevel is silent', () => {
    const i18n = createI18n({
      logLevel: 'silent',
      messages: { en: {} },
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    i18n.t('missing')
    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('should return the key when no messages exist for the current locale', () => {
    const i18n = createI18n({
      defaultLocale: 'fr',
      locales: ['fr'],
      messages: {},
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(i18n.t('hello')).toBe('hello')
    expect(warnSpy).toHaveBeenCalledWith('[vue-i18n]', 'No messages found for locale "fr"')
    warnSpy.mockRestore()
  })
})

describe('setLocale / getLocale', () => {
  it('should update the current locale', () => {
    const i18n = createI18n({
      locales: ['en', 'de'],
      messages: {
        en: { hello: 'Hello' },
        de: { hello: 'Hallo' },
      },
    })
    i18n.setLocale('de')
    expect(i18n.getLocale()).toBe('de')
    expect(i18n.locale.value).toBe('de')
  })

  it('should reject an invalid locale with a warning', () => {
    const i18n = createI18n({
      locales: ['en'],
      messages: { en: {} },
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    i18n.setLocale('fr')
    expect(i18n.locale.value).toBe('en')
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('should translate with the new locale after switching', () => {
    const i18n = createI18n({
      locales: ['en', 'de'],
      messages: {
        en: { greeting: 'Hello' },
        de: { greeting: 'Hallo' },
      },
    })
    expect(i18n.t('greeting')).toBe('Hello')
    i18n.setLocale('de')
    expect(i18n.t('greeting')).toBe('Hallo')
  })
})

describe('install', () => {
  it('should register $t and $i18n as global properties', () => {
    const i18n = createI18n({
      messages: { en: { hello: 'Hello' } },
    })
    const app = createApp({ template: '<div />' })
    app.use(i18n)
    expect(app.config.globalProperties.$t).toBe(i18n.t)
    expect(app.config.globalProperties.$i18n).toBeDefined()
  })
})

describe('useI18n', () => {
  it('should throw when the plugin is not installed', () => {
    expect(() => useI18n()).toThrow(
      '[vue-i18n] No i18n instance found. Did you forget to call `app.use(i18n)`?',
    )
  })
})
