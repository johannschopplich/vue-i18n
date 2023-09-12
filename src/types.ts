import type { App, ComputedRef } from 'vue'

export type LocaleMessageValue<Message = string> =
  | LocaleMessageDictionary<any, Message>
  | string

export declare type LocaleMessageType<T, Message = string> = T extends string
  ? string
  : T extends () => Promise<infer P>
    ? LocaleMessageDictionary<P, Message>
    : T extends (...args: infer Arguments) => any
      ? (...args: Arguments) => ReturnType<T>
      : T extends Record<string, unknown>
        ? LocaleMessageDictionary<T, Message>
        : T extends Array<T>
          ? { [K in keyof T]: T[K] }
          : T

export type LocaleMessageDictionary<T, Message = string> = {
  [K in keyof T]: LocaleMessageType<T[K], Message>;
}

export type LocaleMessage<Message = string> = Record<
  string,
  LocaleMessageValue<Message>
>

export type LocaleMessages<Locale extends string> = Record<Locale, LocaleMessage>

export interface I18nConfig<Locale extends string = string> {
  defaultLocale?: Locale
  locales?: Locale[]
  messages?: LocaleMessages<Locale>
  /** @default 'warn' */
  logLevel?: 'warn' | 'silent'
}

export interface I18nInstance<Locale extends string = string> {
  defaultLocale: Locale
  locale: ComputedRef<Locale>
  locales: readonly Locale[]
  messages: LocaleMessages<Locale>
  t: (key: string, params?: Record<string, any>) => string
  setLocale: (locale: Locale) => void
  getLocale: () => string
  install(app: App): void
}

export type UseI18n = Omit<I18nInstance, 'install'>
