#!/usr/bin/env ts-node

"use strict";

process.title = "normalize champions";

var path = require("path");
var fs = require("fs");
var parse = require("csv-parse/lib/sync");
var chalk = require("chalk");
var { getNormalizedKey } = require("./utils");

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
    const championId = getNormalizedKey(record.Champion);
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
const newChampionsData = {
  byId: {},
  byKey: {}
};
for (let championId in championsData) {
  if (championsData.hasOwnProperty(championId)) {
    const championKey = getNormalizedKey(championsData[championId].name);
    newChampionsData.byKey[championKey] = championId;
    newChampionsData.byId[championId] = championsData[championId];
    newChampionsData.byId[championId].key = championKey;
    delete newChampionsData.byId[championId].splash;
    delete newChampionsData.byId[championId].ability.icon;
    if (!bestItemsDictionary.hasOwnProperty(championKey)) {
      throw new Error(`Missing best set data for ${championKey}`);
    }
    newChampionsData.byId[championId].bestSets =
      bestItemsDictionary[championKey];
  }
}

// process items data
const itemsData = sourceDataJSON.items;
const newItemsData = {
  byId: {},
  byKey: {}
};
for (let itemId in itemsData) {
  if (itemsData.hasOwnProperty(itemId)) {
    // 100: duplicate spatula
    // 541: mortal reminder
    if (itemId !== "100" && itemId !== "541") {
      const itemKey = getNormalizedKey(itemsData[itemId].name);
      newItemsData.byKey[itemKey] = itemId;
      newItemsData.byId[itemId] = itemsData[itemId];
      newItemsData.byId[itemId].id = itemId;
      newItemsData.byId[itemId].key = itemKey;
      newItemsData.byId[itemId].desc = newItemsData.byId[itemId].desc
        .replace(/\<i\>(.+)\<\/i\>/g, "$1")
        .replace(/\<br\>/g, " | ")
        .replace("%i:scaleHealth%", "health")
        .replace("%i:scaleAD%", "attack damage")
        .replace("%i:scaleAP%", "attack power")
        .replace("%i:scaleAS%", "attack speed")
        .replace("%i:scaleArmor%", "armor")
        .replace("%i:scaleMana%", "mana");
      delete newItemsData.icon;
    }
  }
}

const newData = {
  ...sourceDataJSON,
  champions: newChampionsData,
  items: newItemsData
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
