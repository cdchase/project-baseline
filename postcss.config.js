const webpack = require('webpack');

module.exports = {
  plugins: [
    require('postcss-smart-import')({/* ...options */}),
    require('postcss-cssnext')({"browserslist": [
      "> 1%",
      "last 2 versions",
      "Firefox ESR"
    ]}),
    require('postcss-browser-reporter')({/* ...options */}),
    require('postcss-reporter')({/* ...options */})
  ]
};
