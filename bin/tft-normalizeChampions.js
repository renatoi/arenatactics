#!/usr/bin/env ts-node

"use strict";

process.title = "normalize champions";

var path = require("path");
var fs = require("fs");
var chalk = require("chalk");

const filePath = path.resolve(__dirname, "tft-champions-raw-en_us.json");
const fileContents = fs.readFileSync(filePath, { encoding: "utf-8" });
const json = JSON.parse(fileContents);
const newObj = {};

const getId = name =>
  name
    .replace(/'/g, "")
    .replace(/\s/g, "-")
    .toLowerCase();

for (let champion in json) {
  if (json.hasOwnProperty(champion)) {
    const nameId = getId(json[champion].name);
    newObj[nameId] = json[champion];
    newObj[nameId].id = parseInt(champion);
  }
}

// write
const writeToPath = path.resolve(
  __dirname,
  "../public/data/tft-champions.json"
);
fs.writeFileSync(writeToPath, JSON.stringify(newObj));

const stats = fs.statSync(writeToPath);
const fileSizeInKilobytes = stats.size * 0.001;

console.log(
  `JSON successfully normalized at ${chalk.cyan(
    writeToPath
  )}.\nFile size: ${chalk.cyan(fileSizeInKilobytes)}kb`
);
