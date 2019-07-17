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

const patch = "9.13.1";

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
  const file = fs.createWriteStream(dest);
  https
    .get(url, response => {
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

for (let champion in json.champions) {
  if (json.hasOwnProperty(champion)) {
    const newFilePath = path.resolve(
      __dirname,
      `../src/assets/tft/tft_${getId(json[champion].name)}.png`
    );
    download(
      `https://cdn.communitydragon.org/${patch}/champion/${champion}/square`,
      newFilePath,
      err => {
        if (err) {
          console.error(`Error writing file ${newFilePath}: ${err.message}`);
        } else {
          console.error(chalk.cyan(`Successfully downloaded ${newFilePath}.`));
        }
      }
    );
  }
}
