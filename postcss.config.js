const webpack = require('webpack');

module.exports = {
  plugins: [
    require('postcss-smart-import')({from: 'css/landing-page-main.css'}),
    require('postcss-cssnext')({
      'browserslist': [
        '> 1%',
        'last 2 versions',
        'Firefox ESR'
      ]
    }),
    require("postcss-url")({
      /* ...options */
    }),
    require('postcss-browser-reporter')({/* ...options */}),
    require('postcss-reporter')({/* ...options */}),
    /*require('postcss-uncss')({
      html: ['locations.html', 'lm-undergraduate.html', 'src/!*.html'],
      ignore: [
        /list-unstyled/, /sub-open/, /sub-slide js-slide-hidden/,
        /no-opener/, /active/, /on/, /video-playing/, /visibility-hidden/,
        /hide-bar/, /no-alt-header/, /hide-breadcrumb/, /moving-box-attached/,
        /has-drop-down/, /gallery-js-ready/, /disabled/, /autorotation/, /js-slide-hidden/,
        /fixed-position/, /hover/, /fancybox-/, /no-margin-bottom/, /alert-success/, /error/

      ]
    })*/
  ]
};
