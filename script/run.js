#!/usr/bin/env node
const fs = require("fs");
const f = require("./functions");
const { watchTemplate, watchConfigFile } = require("./watch");
const { askQuestion } = require("./helpers");

// var dir = `${process.cwd()}/${process.env.npm_package_config_dir}`;
const configDir = "translationWrapper";
var dir = `${process.cwd()}/${configDir}`;
if (!fs.existsSync(dir) && !fs.existsSync(dir + "/dist")) {
  askQuestion(
    `No init folder found. Do you want to create here:\n${dir}? [y/n]`
  ).then((ans) => {
    if (ans === "y" || ans === "yes") {
      f.init(dir);
      watchTemplate(dir);
      watchConfigFile(dir);
    } else {
      console.log(
        "Change directory by setting $LOCALE. See Readme for more information"
      );
    }
  });
} else {
  watchTemplate(dir);
  watchConfigFile(dir);
}

//TODO: Create a script with arguments for changing location.
//TODO: Arguments for changing logging.
