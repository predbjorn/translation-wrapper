const FALL_BACK = "en";
const TEMPLATE_LOCALE_LANGUAGE = "en"; // Set which language you are templating in
const LANGUAGES = ["en"]; // sequenced by priority

/**
 * Returns the language set by your client
 *
 * Edit to fill your needs
 *
 * See examples under
 */
const defaultLocale = () => "en";

///////////////////////////////////////////
// example of react native implementation:
///////////////////////////////////////////
// import * as RNLocalize from "react-native-localize";

// const defaultLocale = () =>
//   RNLocalize.findBestAvailableLanguage(LANGUAGES) !== undefined
//     ? RNLocalize.findBestAvailableLanguage(LANGUAGES).languageTag
//     : FALL_BACK;
///////////////////////////////////////////

module.exports = {
  FALL_BACK,
  LANGUAGES,
  defaultLocale,
  TEMPLATE_LOCALE_LANGUAGE,
};
