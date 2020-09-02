exports.translatejs = (json) => `
import {strings} from './i18n';
const translate = ${json}
export default translate;`;

exports.DEFAULT_SHEET = `{
	"homePage": {
	  "helloWorld": "Hello World"
	}
}`;

exports.PACKAGE = `{
	"name": "tw",
	"version": "0.0.1",
	"main": "index.js"
}`;

exports.INDEX = `export { default } from "./dist/index";
export { FALL_BACK, LANGUAGES, getLocale, getLang, TEMPLATE_LOCALE_LANGUAGE, localeToLang } from './configLocale';
`;

exports.i18File = (languagesArray) => `import i18n from "i18n-js";
import { getLang } from "../configLocale";

${languagesArray
  .map((lang) => `import ${lang} from "../languages/${lang}.json";`)
  .join("\n")}


i18n.locale = getLang();
i18n.fallbacks = true;
i18n.translations = {${languagesArray}};

export function strings(name) {
  return i18n.t(name);
}

export default i18n;`;
