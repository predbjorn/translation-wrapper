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

exports.INDEX = `export { default } from "./dist/translate";
export { FALL_BACK, LANGUAGES, getLocale, getLang, TEMPLATE_LOCALE_LANGUAGE, localeToLang } from './configLocale';
`;

exports.i18File = (languagesArray) => `import i18n from "i18n-js";
import { getLang } from "../configLocale";
import moment from 'moment';

${languagesArray
  .map((lang) => `import ${lang} from "../languages/${lang}.json";`)
  .join("\n")}


i18n.locale = getLang();
i18n.fallbacks = true;
i18n.translations = {${languagesArray}};

const setMomemtLocale = languagesCode => {
	// Localizing momentjs
	if (languagesCode === 'nb' || languagesCode === 'no') {
		require('moment/locale/nb.js');
		moment.updateLocale('nb');
	} else {
		moment.updateLocale(languagesCode);
	}
	};

export const setI18nLanguage = language => {
	i18n.locale = language;
	setMomemtLocale(language);
};


export function strings(name) {
  return i18n.t(name);
}

export default i18n;`;
