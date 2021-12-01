const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

    // Filters
    // --------------------------------------------------------
    eleventyConfig.addFilter("readableDate", dateObj => {
        const d = DateTime.fromISO(dateObj);
        return d.setLocale('ru').toLocaleString(DateTime.DATETIME_SHORT);
    });

    // Base setup
    // --------------------------------------------------------
    return {
        dir: {
            input: "src",
            output: "_site",
        },
        templateFormats : ["njk", "md"],
        htmlTemplateEngine : "njk",
        markdownTemplateEngine : "njk"
    };

};
