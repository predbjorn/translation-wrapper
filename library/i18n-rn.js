// import * as RNLocalize from "react-native-localize";
// import i18n from "i18n-js";
// import moment from "moment";

// import en from "../languages/en.json";
// import nb from "../languages/nb.json";

// const lang = __DEV__
//   ? RNLocalize.findBestAvailableLanguage(["nb", "en"]) !== undefined
//     ? RNLocalize.findBestAvailableLanguage(["nb", "en"]).languageTag
//     : "nb"
//   : "nb";

// i18n.locale = lang;
// i18n.locales.no = ["nb", "en"];
// i18n.locales.en = ["en", "nb"];
// i18n.fallbacks = true;
// i18n.translations = {
//   en,
//   nb,
// };

// // Localizing momentjs
// if (lang === "nb") {
//   require("moment/locale/nb.js");
//   moment.locale("nb");
// } else {
//   moment.locale("en");
// }

// export function strings(name) {
//   return i18n.t(name);
// }

// export const getLocale = () => {
//   const current = i18n.currentLocale();
//   if (current.indexOf("nb") === 0 || current.indexOf("nn") === 0) {
//     return "no";
//   } else {
//     return "en";
//   }
// };

// export default i18n;
