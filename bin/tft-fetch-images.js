#!/usr/bin/env ts-node

"use strict";

process.title = "tft - fetch images";

var path = require("path");
var fs = require("fs");
var https = require("https");
var chalk = require("chalk");

const filePath = path.resolve(__dirname, "tft-en_us.json");
const fileContents = fs.readFileSync(filePath, { encoding: "utf-8" });
const json = JSON.parse(fileContents);

const patch = "9.15.1";

const getId = name =>
  name
    .replace(/'/g, "")
    .replace(/\s/g, "-")
    .toLowerCase();

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
  https
    .get(url, response => {
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on("finish", function() {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on("error", function(err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
};

// CHAMPIONS + SPLASH
for (let champion in json.champions) {
  if (json.champions.hasOwnProperty(champion)) {
    // download square
    const championSquarePath = path.resolve(
      __dirname,
      `../public/tft/tft_${getId(json.champions[champion].name)}.png`
    );
    download(
      `https://cdn.communitydragon.org/${patch}/champion/${champion}/square`,
      championSquarePath,
      err => {
        if (err) {
          console.error(
            `Error writing file ${championSquarePath}: ${err.message}`
          );
        } else {
          console.error(
            chalk.cyan(`Successfully downloaded ${championSquarePath}.`)
          );
        }
      }
    );

    // download splash
    const championSplashPath = path.resolve(
      __dirname,
      `../public/tft/tft_${getId(json.champions[champion].name)}_splash.png`
    );
    download(
      `https://cdn.communitydragon.org/${patch}/champion/${champion}/splash-art/centered`,
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
    const traitPath = path.resolve(
      __dirname,
      `../public/tft/trait_icon_${getId(json.traits[trait].name)}.png`
    );
    download(
      `https://raw.communitydragon.org/pbe/game/assets/ux/traiticons/trait_icon_${getId(
        json.traits[trait].name
      )}.png`,
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
