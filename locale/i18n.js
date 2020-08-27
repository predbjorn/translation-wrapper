import i18n from "i18n-js";
import moment from "moment";

import en from "../languages/en.json";


i18n.locale = lang;
i18n.fallbacks = true;
i18n.translations = {en};

export function strings(name) {
  return i18n.t(name);
}

export default i18n;