const fs = require("fs");
const {
  translatejs,
  DEFAULT_SHEET,
  PACKAGE,
  i18File,
} = require("./filesTemplate");
const R = require("ramda");
const { askQuestion } = require("./helpers");
const configTemplate = require("./configTemplate");
const startupDebugger = require("debug")("app:startup");

copyStructure = (newStructure, translation) => {
  Object.keys(newStructure).forEach((key) => {
    if (typeof newStructure[key] === "object") {
      newStructure[key] = copyStructure(newStructure[key], translation[key]);
    } else {
      if (
        !(translation && translation[key]) ||
        typeof translation[key] === "object"
      ) {
        newStructure[key] = "";
      } else {
        newStructure[key] = translation[key];
      }
    }
  });
  return newStructure;
};

makeTranslation = (path, tree) => {
  Object.keys(tree).forEach((key) => {
    if (typeof tree[key] === "object") {
      const newPath = path + (path.length == 0 ? "" : ".") + key;
      tree[key] = makeTranslation(newPath, tree[key]);
    } else {
      tree[key] = `strings("${path}.${key}")`;
    }
  });
  return tree;
};

splitLines = (lines) => {
  let tabs = 0;
  let output = "";
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("}") > -1) {
      tabs--;
    }
    let space = "";
    let y = 0;
    while (y < tabs) {
      space += "  ";
      y++;
    }
    if (lines[i].indexOf("{") > -1) {
      tabs++;
    }
    output += space + lines[i] + "\n";
  }
  return output;
};

const writeReadableJson = R.pipe(
  JSON.stringify,
  R.replace(/\\",/g, "&&&"),
  R.replace(/{/g, "{\n"),
  R.replace(/},/g, "\n},\n"),
  R.replace(/",/g, '",\n'),
  R.replace(/}}/g, "\n}\n}"),
  R.replace(/&&&/g, '\\"'),
  R.replace(/":"/g, '": "'),
  R.replace(/":{/g, '": {'),
  R.split("\n"),
  splitLines
);

const translate = R.pipe(
  JSON.parse,
  R.curry(makeTranslation)(""),
  writeReadableJson,
  R.replace(/"/g, ""),
  R.replace(/\\/g, '"'),
  translatejs
);

const writeToLanguage = (file, stringsJSON) => {
  const jsonlike = fs.readFileSync(file, "utf8");
  try {
    const translation = JSON.parse(jsonlike);
    try {
      let newStructure = JSON.parse(stringsJSON);
      newStructure = copyStructure(newStructure, translation);
      let json = writeReadableJson(newStructure);
      fs.writeFileSync(file, json, "utf8");
    } catch (err) {
      console.error(`JSON in file ${file} is not valid json...`, err);
    }
  } catch (err) {
    console.error(`JSON in file ${file} is not valid json...`, err);
  }
};

exports.run = (dir, localeStringsPath, templateLanguge) => {
  const pathToLanguages = `${dir}/languages`;
  const stringsJSON = fs.readFileSync(localeStringsPath, "utf8");
  fs.readdirSync(pathToLanguages).forEach((file) =>
    writeToLanguage(`${pathToLanguages}/${file}`, stringsJSON)
  );
  fs.writeFileSync(
    `${pathToLanguages}/${templateLanguge}.json`,
    stringsJSON,
    "utf8"
  );
  var i = stringsJSON;
  fs.writeFileSync(`${dir}/dist/translate.js`, translate(stringsJSON), "utf8");
};

createOrDeleteLanguages = (dir, languages) => {
  const pathToLanguages = `${dir}/languages`;
  const languagesInFolder = fs
    .readdirSync(pathToLanguages)
    .map((lang) => lang.replace(".json", ""));
  languages.forEach((lang) => {
    const index = languagesInFolder.indexOf(lang);
    if (index > -1) languagesInFolder.splice(index, 1);
    else fs.writeFileSync(`${pathToLanguages}/${lang}.json`, "{}");
  });

  if (languagesInFolder.length)
    askQuestion(
      `Delete theese languages: [${languagesInFolder.join(", ")}]? [y/n]`
    ).then((ans) => {
      if (ans[0] === "y") {
        languagesInFolder.forEach((lang) => {
          fs.unlink(`${pathToLanguages}/${lang}.json`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
      }
    });
  // .filter((file) => languages.indexOf(file.replace(".json", "")))
  // .
  // .forEach((file) => writeToLanguage(`${pathToLanguages}/${file}`));
};

const createOrUpdatei18File = (path, languages) => {
  fs.writeFileSync(`${path}/dist/i18n.js`, i18File(languages), "utf8");
  createOrDeleteLanguages(path, languages);
};
exports.createOrUpdatei18File = createOrUpdatei18File;

exports.init = (path) => {
  startupDebugger(`Setting path: ${path}`);
  fs.mkdirSync(path);
  fs.mkdirSync(`${path}/languages`);
  fs.mkdirSync(`${path}/dist`);
  fs.writeFileSync(`${path}/localeStrings.json`, DEFAULT_SHEET, "utf8");
  fs.writeFileSync(`${path}/package.json`, PACKAGE, "utf8");
  fs.copyFile(
    `${__dirname}/configTemplate.js`,
    `${path}/configLocale.js`,
    (err) => {
      if (err) {
        startupDebugger(`setup failed:`, err);
        throw err;
      }
    }
  );
  // setting to init values:
  createOrUpdatei18File(path, configTemplate.LANGUAGES);
  startupDebugger(`Setup complete`);
};
