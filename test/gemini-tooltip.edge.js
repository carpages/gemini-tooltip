/* eslint key-spacing: ["error", { "align": "colon" }] */
requirejs.config({
  baseUrl: '../',
  paths  : {
    'underscore'    : 'bower_components/underscore/underscore',
    'jquery'        : 'bower_components/jquery/dist/jquery',
    'jquery.boiler' : 'bower_components/jquery-boiler/jquery.boiler',
    'gemini'        : 'bower_components/gemini-loader/gemini',
    'gemini.support': 'bower_components/gemini-support/gemini.support'
  }
});

require([ 'gemini', 'gemini.tooltip' ], function( G ) {
  $( '.js-tooltip' ).tooltip({
    tip: 'Test Tip'
  });
});
