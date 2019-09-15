#!/usr/bin/env ts-node

"use strict";

process.title = "normalize champions";

const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

function groupBestBuild(locale) {
  const [lang, region] = locale.split("_");
  const out = [];
  const directory = path.resolve(
    __dirname,
    `data/JSON - ${lang.toUpperCase()}`
  );
  console.log(`Reading files from directory ${chalk.cyan(directory)}`);
  fs.readdir(directory, function(err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files.forEach(function(file) {
      console.log(`Reading file ${chalk.cyan(file)}`);
      const filePath = path.join(directory, file);
      const fileContent = fs.readFileSync(filePath, {
        encoding: "utf-8"
      });
      const fileContentJSON = JSON.parse(fileContent);
      out.push(fileContentJSON);
    });

    // write
    const writeToPath = path.resolve(
      __dirname,
      `data/${locale}_TFT_best-builds.json`
    );
    fs.writeFileSync(writeToPath, JSON.stringify(out));
    const stats = fs.statSync(writeToPath);
    const fileSizeInKilobytes = stats.size * 0.001;
    console.log(
      `JSON successfully normalized at ${chalk.cyan(
        writeToPath
      )}.\nFile size: ${chalk.cyan(fileSizeInKilobytes)}kb`
    );
  });
}

groupBestBuild("en_us");
groupBestBuild("pt_br");
