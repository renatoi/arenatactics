const getChampionId = name =>
  name
    .replace(/'/g, "")
    .replace(/\s/g, "-")
    .toLowerCase();

module.exports = { getChampionId };
