#!/usr/bin/env ts-node

"use strict";

process.title = "normalize champions";

var path = require("path");
var fs = require("fs");
var parse = require("csv-parse/lib/sync");
var chalk = require("chalk");
var { getChampionId } = require("./utils");

// process best-items data
const csvPath = path.resolve(__dirname, "tft-best-sets.csv");
const csvContents = fs.readFileSync(csvPath, { encoding: "utf-8" });
const bestItemsDictionary = {};

const records = parse(csvContents, {
  columns: true,
  skip_empty_lines: true
});

records.forEach(record => {
  if (record.CODE && record.Champion) {
    const bestItemSetsContent = record.CODE.replace(/\\n/g).replace(
      /"bestSets":/,
      ""
    );
    const championId = getChampionId(record.Champion);
    try {
      const bestItemSetsJSON = JSON.parse(bestItemSetsContent);
      bestItemsDictionary[championId] = bestItemSetsJSON;
    } catch (e) {
      console.error(`Error trying to parse JSON for champion ${championId}.`);
    }
  }
});

// process champion data
const sourceDataPath = path.resolve(__dirname, "tft-en_us.json");
const sourceDataContents = fs.readFileSync(sourceDataPath, {
  encoding: "utf-8"
});
const sourceDataJSON = JSON.parse(sourceDataContents);

const championsData = sourceDataJSON.champions;
const newChampionsData = {};
for (let champion in championsData) {
  if (championsData.hasOwnProperty(champion)) {
    const nameId = getChampionId(championsData[champion].name);
    newChampionsData[nameId] = championsData[champion];
    newChampionsData[nameId].id = parseInt(champion);
    if (!bestItemsDictionary.hasOwnProperty(nameId)) {
      throw new Error(`Missing best set data for ${nameId}`);
    }
    newChampionsData[nameId].bestSets = bestItemsDictionary[nameId];
  }
}

const newData = {
  ...sourceDataJSON,
  champions: newChampionsData
};

// write
const writeToPath = path.resolve(__dirname, "../public/data/tft-en_us.json");
fs.writeFileSync(writeToPath, JSON.stringify(newData));

const stats = fs.statSync(writeToPath);
const fileSizeInKilobytes = stats.size * 0.001;

console.log(
  `JSON successfully normalized at ${chalk.cyan(
    writeToPath
  )}.\nFile size: ${chalk.cyan(fileSizeInKilobytes)}kb`
);
