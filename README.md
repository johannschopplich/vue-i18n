# @byjohann/vue-i18n

[![npm version](https://img.shields.io/npm/v/@byjohann/vue-i18n?color=a1b858&label=)](https://www.npmjs.com/package/@byjohann/vue-i18n)

> Lightweight internationalization plugin for Vue.

Why bother creating another i18n library if [Vue I18n](https://vue-i18n.intlify.dev) seems to be the de-facto standard? Well, I was looking for a lightweight solution that is easy to use and does not require any additional dependencies. I also wanted to learn, how the most basic i18n implementation could look like.

## Key Features

- 🔃 Lazily add new translations at runtime
- 🗜 Composable usage with [`useI18n`](#usei18n)
- 📯 Global properties [`$t`](#t--i18n) and [`$i18n`](#t--i18n) accessible in templates
- 🌬️ Zero dependencies

## Setup

```bash
# pnpm
pnpm add @byjohann/vue-i18n

# npm
npm i @byjohann/vue-i18n

# yarn
yarn add @byjohann/vue-i18n
```

## Usage

> [📖 Check out the playground](./playground/)

To make use of `@byjohann/vue-i18n` in your components, initialize the `i18n` instance:

```ts
// plugins/i18n.ts
import { createI18n } from '@byjohann/vue-i18n'

const i18n = createI18n({
  defaultLocale: 'en',
  messages: {
    en: {
      intro: 'Welcome, {name}',
    },
    de: {
      intro: 'Willkommen, {name}',
    },
  },
})

export default i18n
```

Inside your app's entry point, import the `i18n` instance and add it you Vue:

```ts
// main.ts
import { createApp } from 'vue'
import i18n from './i18n'

const app = createApp(App)
app.use(i18n)
app.mount('#app')
```

Done! Now you can retrieve translated keys in your components:

```ts
const { locale, t, setLocale } = useI18n()

locale.value // `en`
t('intro', { name: 'World' }) // `Welcome, World`

// Set new locale
setLocale('de')

locale.value // `de`
t('intro', { name: 'World' }) // `Willkommen, World`
```

## Message Formatting

<table><tr><td width="500px" valign="top">

### General Formatting

```ts
const messages = {
  en: {
    intro: 'Hello World',
  },
}
```

</td><td width="500px"><br>

**Template**

```html
<p>{{ $t('intro') }}</p>
```

**Output**

```html
<p>Hello World</p>
```

</td></tr><tr><td width="500px" valign="top">

### Named Formatting

```ts
const messages = {
  en: {
    intro: '{msg} World'
  }
}
```

</td><td width="500px"><br>

**Template**

```html
<p>{{ $t('intro', { msg: 'My' }) }}</p>
```

**Output**

```html
<p>My World</p>
```

</td></tr><tr><td width="500px" valign="top">

### List Formatting

```ts
const messages = {
  en: {
    intro: '{0} World',
  },
}
```

</td><td width="500px"><br>

**Template**

```html
<p>{{ $t('intro', ['My']) }}</p>
```

**Output**

```html
<p>My World</p>
```

---

List formatting also accepts array-like objects:

**Template**

```html
<p>{{ $t('intro', {'0': 'My'}) }}</p>
```

**Output**

```html
<p>My World</p>
```

</td></tr></table>

## Advanced Usage

### Auto-Load Translations

To automatically load translations, you can use [import.meta.glob](https://vitejs.dev/guide/features.html#glob-import) to load all translation files from a directory.

```ts
import { createI18n } from '@byjohann/vue-i18n'

// Auto-load translations
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<Record<string, any>>('./locales/*.json', { eager: true }),
  ).map(([key, value]) => [key.slice(10, -5), value]),
)

const i18n = createI18n({
  defaultLocale: 'en',
  locales: Object.keys(messages),
  messages,
})

export { i18n }
```

## API

### `$t` & `$i18n`

The properties `$t` as well as `$i18n` are available globally in your templates.

Example:

```html
<p>{{ $t('intro') }}</p>
```

### `useI18n`

To access the current i18n instance, you can import the `useI18n` composable from `@byjohann/vue-i18n`. The `useI18n` composable is available your `<script setup>` blocks or the `setup` function of your components.

**Example**

```ts
import { useI18n } from '@byjohann/vue-i18n'

const i18n = useI18n()
const {
  defaultLocale,
  locale,
  locales,
  messages,
  t,
  setLocale,
  getLocale
} = i18n

console.log(defaultLocale === locale.value) // true
console.log(t('foo').value) // `bar`
```

**Type Declaration**

```ts
function useI18n(): UseI18n

interface UseI18n<Locale extends string = string> {
  defaultLocale: Locale
  locale: ComputedRef<Locale>
  locales: readonly Locale[]
  messages: LocaleMessages<Locale>
  t: (key: string, params?: Record<string, any>) => string
  setLocale: (locale: Locale) => void
  getLocale: () => string
}
```

## 💻 Development

1. Clone this repository
2. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
3. Install dependencies using `pnpm install`
4. Start development server using `pnpm run dev` inside `playground`

## License

[MIT](./LICENSE) License © 2022-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

[MIT](./LICENSE) License © 2022-2023 [LeanERA GmbH](https://github.com/leanera)

[MIT](./LICENSE) License © 2020 [webkong](https://github.com/webkong)
