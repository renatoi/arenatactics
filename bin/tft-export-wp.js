#!/usr/bin/env ts-node

"use strict";

process.title = "normalize champions";

const path = require("path");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const chalk = require("chalk");
const { getNormalizedKey, hashFnv32a } = require("./utils");

function exportData(locale) {
  const baseDataPath = path.resolve(__dirname, "data");

  const sourceDataPath = path.resolve(baseDataPath, `${locale}_TFT.json`);
  const sourceDataContents = fs.readFileSync(sourceDataPath, {
    encoding: "utf-8"
  });
  const sourceDataJSON = JSON.parse(sourceDataContents);

  const championsData = sourceDataJSON.champions;
  let output = '';

  if (locale == "en_us") {
      const championsOut = [];
      for (let championId in championsData) {
        if (championsData.hasOwnProperty(championId)) {
          const championName = sourceDataJSON.champions[championId].name;
          const championKey = getNormalizedKey(championName);
          championsOut.push({key: championKey, name: championName.replace("'", "\\'") });
        }
      }
      championsOut.sort((a, b) => {
          if (a.key > b.key) {
              return 1;
          }
          if (a.key < b.key) {
              return -1;
          }
          return 0;
      }).forEach(champion => output += `'${champion.key}' => '${champion.name}'\n`);
  }

  // write
  const writeToPath = path.resolve(
    __dirname,
    `./data/tft-${locale}-wp`
  );
  fs.writeFileSync(writeToPath, output);
  const stats = fs.statSync(writeToPath);
  const fileSizeInKilobytes = stats.size * 0.001;
  console.log(
    `Successfully exported to Wordpress at ${chalk.cyan(
      writeToPath
    )}.\nFile size: ${chalk.cyan(fileSizeInKilobytes)}kb`
  );
}

exportData("en_us");
exportData("pt_br");
