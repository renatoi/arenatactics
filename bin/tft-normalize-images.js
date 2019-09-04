#!/usr/bin/env ts-node

"use strict";

process.title = "tft - normalize images";

var path = require("path");
var fs = require("fs");
var chalk = require("chalk");

const directoryPath = path.join(__dirname, "images");
//passsing directoryPath and callback function
fs.readdir(directoryPath, function(err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach(function(file) {
    const newFileName = file
      .replace("Jeweled_Gauntlet", "jeweledgauntlet")
      .replace(/Icon_|TFT_Item_/g, "tft_item_")
      .toLowerCase();
    const src = path.join(directoryPath, file);
    const dest = path.join(__dirname, "../public/tft/", newFileName);
    fs.copyFile(src, dest, err => {
      if (err) throw err;
      console.log(`${src} was copied to ${dest}`);
    });
  });
});
