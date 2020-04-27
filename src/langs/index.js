import i18n from "i18n-js"
import en from "./en"
import fr from "./fr"
import ar from "./ar"

i18n.translations.en = en
i18n.translations.fr = fr
i18n.translations.ar = ar
i18n.defaultLocale = "en"
i18n.locale = localStorage.getItem("language") || "en"

const locales = {
  en: () => import("./en"),
  fr: () => import("./fr"),
  ar: () => import("./ar"),
}

export async function changeLangs(locale) {
  if (!i18n.translations[locale]) {
    i18n.translations[locale] = (await locales[locale]()).default
  }
  i18n.locale = locale
}