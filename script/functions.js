const fs = require("fs");
const {
  translatejs,
  DEFAULT_SHEET,
  PACKAGE,
  i18File,
} = require("./filesTemplate");
const R = require("ramda");
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
  splitLines,
  R.replace(/"/g, ""),
  R.replace(/\\/g, '"')
);

const partTranslate = R.pipe(
  JSON.parse,
  R.curry(makeTranslation)(""),
  writeReadableJson,
  translatejs
);

const writeToLanguage = (file) => {
  const translation = JSON.parse(fs.readFileSync(file, "utf8"));
  let newStructure = JSON.parse(stringsJSON);
  newStructure = copyStructure(newStructure, translation);
  let json = writeReadableJson(newStructure);
  // json = json.replace(/}}/g, "}\n}\n")
  fs.writeFileSync(file, json, "utf8");
};

exports.run = (dir, localeStringsPath, templateLanguge) => {
  const pathToLanguages = `${dir}/languages`;
  const stringsJSON = fs.readFileSync(localeStringsPath, "utf8");
  fs.readdirSync(pathToLanguages)
    .filter((file) => file !== `${templateLanguge}.json`)
    .forEach((file) => writeToLanguage(`${pathToLanguages}/${file}`));
  fs.writeFileSync(
    `${pathToLanguages}/${templateLanguge}.json`,
    stringsJSON,
    "utf8"
  );
  fs.writeFileSync(
    `${dir}/dist/translate.js`,
    partTranslate(stringsJSON),
    "utf8"
  );
};
const createOrUpdatei18File = (path, languages) => {
  fs.writeFileSync(`${path}/dist/i18n.js`, i18File(languages), "utf8");
};
exports.createOrUpdatei18File = createOrUpdatei18File;

exports.init = (path) => {
  startupDebugger(`Setting path: ${path}`);
  fs.mkdirSync(path);
  fs.mkdirSync(`${path}/languages`);
  fs.mkdirSync(`${path}/dist`);
  fs.writeFileSync(`${path}/localeStrings.json`, DEFAULT_SHEET, "utf8");
  fs.writeFileSync(`${path}/package.json`, PACKAGE, "utf8");

  // destination.txt will be created or overwritten by default.
  fs.copyFile(
    `${__dirname}/script/configTemplate.js`,
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
