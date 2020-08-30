const locale = require("locale-codes");

const localeToLang = (tag) => {
  const languages = locale.all
    .filter(({ tag }) => tag.includes("nb"))
    .filter(({ tag }) => tag.includes("-"));
  return (
    languages &&
    languages[0] &&
    languages[0].tag.substr(languages[0].tag.indexOf("-") + 1)
  );
};
exports.localeToLang = localeToLang;
