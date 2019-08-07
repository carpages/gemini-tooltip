/**
 * @fileoverview

A Gemini plugin to add tooltips to elements on the page

### Notes
- You can alter all the properties using the ``data`` property
- The tip will be in relation to the element, so it's suggested that you use
it primarily on ``<span>`` elements

### Features
- You can position the tip ``top``, ``right``, ``bottom``, or ``left``

 *
 * @namespace gemini.tooltip
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires gemini
 *
 * @prop {string} tip {@link gemini.tooltip#tip}
 * @prop {string} place {@link gemini.tooltip#place}
 *
 * @example
  <html>
    <span class="js-tooltip" data-tip="This is a tip!" data-place="left">Hover me!</span>
    <span class="js-tooltip" data-tip="This is a tip!">Hover me!</span>
    <span class="js-tooltip" data-tip="This is a tip!" data-place="bottom">Hover me!</span>
    <span class="js-tooltip" data-tip="This is a tip!" data-place="right">Hover me!</span>
  </html>
 *
 * @example
  G('.js-tooltip').tooltip();
 */
( function( factory ) {
  if ( typeof define === 'function' && define.amd ) {
    // AMD. Register as an anonymous module.
    define([ 'gemini' ], factory );
  } else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    module.exports = factory( require( 'gemini-loader' ));
  } else {
    // Browser globals
    factory( G );
  }
})( function( G ) {
  G.boiler( 'tooltip', {
    defaults: {
      /**
       * The tip that you want to show the user
       *
       * @name gemini.tooltip#tip
       * @type string
       * @default false
       */
      tip: false,

      /**
       * The placement of the tooltip. (top, right, bottom, or left)
       *
       * @name gemini.tooltip#place
       * @type string
       * @default 'top'
       */
      place: 'top',

      /**
       * An extension class to add to the tooltip
       *
       * @name gemini.tooltip#extension
       * @type string
       * @default false
       */
      extension: false
    },

    data: [ 'tip', 'place', 'extension' ],

    init: function() {
      var plugin = this;

      if ( !plugin.settings.tip ) return;

      /*
       * -----------------
       * BUILD THE TOOLTIP
       * -----------------
       */
      plugin.$tip = $( '<div class="tooltip__tip">' ).html( plugin.settings.tip );
      plugin.$tooltip = $( '<div class="tooltip">' ).html( plugin.$tip );
      if ( plugin.settings.extension ) plugin.$tooltip.addClass( plugin.settings.extension );
      plugin.$el.addClass( 'w-tooltip' ).append( plugin.$tooltip );

      /*
       * ---------------
       * PLACE THE ARROW
       * ---------------
       */
      var arrowPlacement = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      }[plugin.settings.place];

      plugin.$tip.addClass( 'tooltip__tip--arrow-' + arrowPlacement );

      /*
       * -----------------------------
       * PLACE THE TOOLTIP ACCORDINGLY
       * -----------------------------
       */
      plugin._position();

      /*
       * ---------------
       * ADD HOVER EVENT
       * ---------------
       */
      // Add event to activate
      plugin.$el
        .on( 'mouseenter', function() {
          plugin.$tooltip.addClass( 'is-active' );
        })
        .on( 'mouseleave', function() {
          plugin.$tooltip.removeClass( 'is-active' );
        });
    },

    /**
     * Calculate and set the positioning for the tooltip
     *
     * @method
     * @name gemini.tooltip#position
     **/
    _position: function() {
      var plugin = this;

      // Cache dem dimensions
      var tw = plugin.$tip.outerWidth();
      var th = plugin.$tip.outerHeight();
      var ew = plugin.$el.outerWidth();
      var eh = plugin.$el.outerHeight();

      // Align center
      switch ( plugin.settings.place ) {
        case 'top':
        case 'bottom':
          // Align horizontally center
          plugin.$tooltip.css( 'left', ( ew - tw ) / 2 );
          break;
        case 'left':
        case 'right':
          // Align vertically center
          plugin.$tooltip.css( 'top', ( eh - th ) / 2 );
          break;
      }

      // Position
      switch ( plugin.settings.place ) {
        case 'top':
          plugin.$tooltip.css( 'top', -th );
          break;
        case 'bottom':
          plugin.$tooltip.css( 'bottom', -th );
          break;
        case 'left':
          plugin.$tooltip.css( 'left', -tw );
          break;
        case 'right':
          plugin.$tooltip.css( 'right', -tw );
          break;
      }
    },

    /**
     * Force open the tooltip
     *
     * @method
     * @name gemini.tooltip#open
     **/
    open: function() {
      this.$tooltip.addClass( 'is-forced-active' );
    },

    /**
     * Force close the tooltip
     *
     * @method
     * @name gemini.tooltip#close
     **/
    close: function() {
      this.$tooltip.removeClass( 'is-forced-active' );
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;
});
