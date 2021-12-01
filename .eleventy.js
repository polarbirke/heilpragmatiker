const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

    // Filters
    // --------------------------------------------------------
    eleventyConfig.addFilter("readableDate", dateObj => {
        const d = DateTime.fromISO(dateObj);
        return d.setLocale('de').toLocaleString(DateTime.DATETIME_MED);
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
