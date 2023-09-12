<script setup lang="ts">
import { useI18n } from '@byjohann/vue-i18n'

const { locale, setLocale, t } = useI18n()

function switchLocale() {
  setLocale(locale.value === 'en' ? 'de' : 'en')
}
</script>

<template>
  <header>
    <h1>vue-i18n</h1>
    <p>
      Current locale: <mark>{{ locale }}</mark>
    </p>
  </header>

  <main>
    <p>
      <button @click="switchLocale()">
        Switch locale
      </button>
    </p>

    <h3>Translations</h3>
    <p>{{ t("test") }}</p>
    <!-- Array -->
    <p>{{ t("menu[0]") }}</p>
    <!-- Object -->
    <p>{{ t("object.foo") }}</p>
    <!-- Parse -->
    <p>{{ t("parse", { name: "vue-i18n" }) }}</p>
    <p>{{ t("parses.foo", { name: "vue-i18n" }) }}</p>
  </main>
</template>
