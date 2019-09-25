#!/usr/bin/env ts-node

"use strict";

process.title = "tft - fetch images";

var path = require("path");
var fs = require("fs");
var https = require("https");
var chalk = require("chalk");
var getNormalizedKey = require("./utils.js").getNormalizedKey;

const filePath = path.resolve(__dirname, "data/en_us_TFT.json");
const fileContents = fs.readFileSync(filePath, { encoding: "utf-8" });
const json = JSON.parse(fileContents);

const patch = "latest";

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const download = (url, dest, cb) => {
  ensureDirectoryExistence(dest);
  console.log(`Downloading: ${url}`);
  https
    .get(url, response => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on("finish", function() {
          file.close(cb); // close() is async, call cb after close completes.
        });
      } else {
        if (cb) cb(`Error status code is ${response.statusCode}`);
      }
    })
    .on("error", function(err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
};

// CHAMPIONS + SPLASH
for (let championId in json.champions) {
  if (json.champions.hasOwnProperty(championId)) {
    // download square
    const squareUrl = `https://cdn.communitydragon.org/${patch}/champion/${championId}/square`;
    const championSquarePath = path.resolve(
      __dirname,
      `./images/tft_champion_${getNormalizedKey(
        json.champions[championId].name
      )}.png`
    );
    const cb = err => {
      if (err) {
        console.error(
          `Error writing file ${championSquarePath}: ${err.message}`
        );
      } else {
        console.error(
          chalk.cyan(`Successfully downloaded ${championSquarePath}.`)
        );
      }
    };
    download(squareUrl, championSquarePath, cb);

    // download splash
    const championSplashPath = path.resolve(
      __dirname,
      `../public/tft/tft_${getNormalizedKey(
        json.champions[championId].name
      )}_splash.png`
    );
    download(
      `https://cdn.communitydragon.org/${patch}/champion/${championId}/splash-art/centered`,
      championSplashPath,
      err => {
        if (err) {
          console.error(
            `Error writing file ${championSplashPath}: ${err.message}`
          );
        } else {
          console.error(
            chalk.cyan(`Successfully downloaded ${championSplashPath}.`)
          );
        }
      }
    );
  }
}

// http://raw.communitydragon.org/pbe/game/assets/ux/traiticons/
// TRAITS
for (let trait in json.traits) {
  if (json.traits.hasOwnProperty(trait)) {
    // download square
    const traitName = getNormalizedKey(json.traits[trait].name);
    const traitPath = path.resolve(
      __dirname,
      `./images/trait_icon_${traitName}.png`
    );
    download(
      `https://raw.communitydragon.org/pbe/game/assets/ux/traiticons/trait_icon_${traitName}.png`,
      traitPath,
      err => {
        if (err) {
          console.error(`Error writing file ${traitPath}: ${err.message}`);
        } else {
          console.error(chalk.cyan(`Successfully downloaded ${traitPath}.`));
        }
      }
    );
  }
}
