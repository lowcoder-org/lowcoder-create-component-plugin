import { getI18nObjects, getValueByLocale, Translator } from "lowcoder-sdk";
import * as localeData from "./locales";
import { I18nObjects } from "./locales/types";

export const { trans, language } = new Translator<typeof localeData.en>(
  localeData,
  REACT_APP_LANGUAGES
);

export const i18nObjs = getI18nObjects<I18nObjects>(localeData, REACT_APP_LANGUAGES);

export function getScannerLocale() {
  return getValueByLocale("EN", (locale) => {
    switch (locale.language) {
      case "en":
        return "en-gb";
      case "zh":
        return "zh-cn";
    }
  });
}
