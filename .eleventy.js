const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("public");

  // Collections
  eleventyConfig.addCollection("milestones", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/milestones/*.md")
      .sort((a, b) => b.date - a.date); // newest first
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

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  eleventyConfig.addFilter("learnedSongs", (songs) =>
    songs.filter((s) => s.status === "learned")
  );

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
