const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy({ "public": "." });

  // Collections
  eleventyConfig.addCollection("milestones", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/milestones/*.md")
      .sort((a, b) => b.date - a.date); // newest first
  });

  eleventyConfig.addCollection("songs", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/songs/*.md")
      .sort((a, b) => {
        const da = a.data.dateLearned || "";
        const db = b.data.dateLearned || "";
        if (!da && !db) return 0;
        if (!da) return 1;  // nulls (currently learning) last
        if (!db) return -1;
        return db.localeCompare(da); // newest learned first
      });
  });

  eleventyConfig.addCollection("learnedYears", function (collectionApi) {
    const songs = collectionApi.getFilteredByGlob("content/songs/*.md");
    const years = new Set();
    songs.forEach((s) => {
      if (s.data.status === "learned" && s.data.dateLearned) {
        years.add(String(s.data.dateLearned).slice(0, 4));
      }
    });
    return [...years].sort((a, b) => b - a); // newest year first
  });

  // Filters
  eleventyConfig.addFilter("dateDisplay", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMMM d, yyyy");
  });

  eleventyConfig.addFilter("yearMonth", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMM yyyy");
  });

  eleventyConfig.addFilter("year", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy");
  });

  eleventyConfig.addFilter("yearFromDate", (str) => {
    if (!str) return null;
    return String(str).slice(0, 4);
  });

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  eleventyConfig.addFilter("learnedSongs", (songs) =>
    songs.filter((s) => s.data.status === "learned")
  );

  eleventyConfig.addFilter("learnedByYear", (songs) => {
    const byYear = {};
    songs
      .filter((s) => s.data && s.data.status === "learned" && s.data.dateLearned)
      .forEach((s) => {
        const yr = String(s.data.dateLearned).slice(0, 4);
        byYear[yr] = (byYear[yr] || 0) + 1;
      });
    return Object.keys(byYear)
      .sort((a, b) => b - a)
      .map((yr) => ({ year: yr, count: byYear[yr] }));
  });

  // htmlDateString was removed in 11ty v3 — add it back for <time datetime="...">
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-MM-dd");
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
