const fs = require("fs");
var chokidar = require("chokidar");
const f = require("./functions");
const changeDebugger = require("debug")("app:changes");
const { askQuestion } = require("./helpers");

const localeStringsPath = (dir) => `${dir}/localeStrings.json`;
const configPath = (dir) => `${dir}/configLocale.js`;
const config = (dir) => require(configPath(dir));

exports.watchTemplate = (dir) => {
  const localeStrings = localeStringsPath(dir);
  const { TEMPLATE_LOCALE_LANGUAGE } = config(dir);
  f.run(dir, localeStrings, TEMPLATE_LOCALE_LANGUAGE);
  chokidar
    .watch(localeStrings, { ignored: /(^|[\/\\])\../ })
    .on("all", (event, path) => {
      if (event != "add") {
        changeDebugger("Changes found in: ", localeStrings);
        f.run(dir, localeStrings, TEMPLATE_LOCALE_LANGUAGE);
      }
    });
};

// TODO:Detect if changes is made.
exports.watchConfigFile = (dir) =>
  chokidar
    .watch(configPath(dir), { ignored: /(^|[\/\\])\../ })
    .on("all", (event, path) => {
      if (event != "add") {
        askQuestion(
          "Config updated. Do you want to update config files and languagefolders? [y/n]"
        ).then((ans) => {
          if (ans === "y" || ans === "yes") {
            // f.createOrUpdatei18File(config(dir).LANGUAGES);
            // do more stuff here...
          }
        });
      }
    });
