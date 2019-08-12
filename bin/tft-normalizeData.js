#!/usr/bin/env ts-node

"use strict";

process.title = "normalize champions";

const path = require("path");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const chalk = require("chalk");
const { getNormalizedKey, hashFnv32a } = require("./utils");

// process best builds data
const bestBuildsPath = path.resolve(__dirname, "tft-best-builds-en_us.json");
const bestBuildsContent = fs.readFileSync(bestBuildsPath, {
  encoding: "utf-8"
});
const bestBuildsJSON = JSON.parse(bestBuildsContent);
const newBuildsData = { byId: {}, byKey: {} };

bestBuildsJSON.forEach(bestBuild => {
  const newBestBuild = { ...bestBuild };
  const key = getNormalizedKey(newBestBuild.name);
  const id = hashFnv32a(key, true);
  newBestBuild.key = key;
  newBestBuild.id = id;
  newBuildsData.byId[id] = newBestBuild;
  newBuildsData.byKey[key] = id;
});

// process best-items data
const bestItemsPath = path.resolve(__dirname, "tft-best-sets.csv");
const bestItemsContents = fs.readFileSync(bestItemsPath, { encoding: "utf-8" });
const bestItemsDictionary = {};

const records = parse(bestItemsContents, {
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
    newChampionsData.byId[championId].id = championId;
    delete newChampionsData.byId[championId].splash;
    delete newChampionsData.byId[championId].ability.icon;
    delete newChampionsData.byId[championId].icon;
    delete newChampionsData.byId[championId].stats.initalMana;
    if (bestItemsDictionary.hasOwnProperty(championKey)) {
      newChampionsData.byId[championId].bestSets =
        bestItemsDictionary[championKey];
    }
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
    // 10002: Jammed (new item?)
    if (itemId !== "100" && itemId !== "541" && itemId !== "10002") {
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
      delete newItemsData.byId[itemId].icon;
    }
  }
}

// process traits data
const traitsData = sourceDataJSON.traits;
const newTraitsData = {
  byId: {}
};
traitsData.forEach(trait => {
  newTraitsData.byId[trait.name] = trait;
  delete newTraitsData.byId[trait.name].icon;
});

// put them all together
const newData = {
  ...sourceDataJSON,
  champions: newChampionsData,
  items: newItemsData,
  traits: newTraitsData,
  builds: newBuildsData
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
