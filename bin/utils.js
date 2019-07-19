const getNormalizedKey = name =>
  name
    .replace(/'|\./g, "")
    .replace(/\s/g, "-")
    .toLowerCase();

module.exports = { getNormalizedKey };
