module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: "usage",
                corejs: "3.8.3",
            },
        ],
    ],
    sourceType: "unambiguous",
};
