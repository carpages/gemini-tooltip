/**
 * @fileoverview

A jQuery plugin to add tooltips to elements on the page

### Notes
- You can alter all the properties using the ``data`` property
- The tip will be in relation to the elemnt, so it's suggested that you use
it primarily on ``<span>`` elements

### Features
- You can position the tip ``top``, ``right``, ``bottom``, or ``left``

 *
 * @namespace jquery.tooltip
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires jquery-loader
 * @requires jquery.boiler
 *
 * @prop {string} tip {@link jquery.tooltip#tip}
 * @prop {string} place {@link jquery.tooltip#place}
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
  $('.js-tooltip').tooltip();
 */
define(['jquery-loader', 'jquery.boiler'], function($){

  $.boiler('tooltip', {
    defaults: {
      /**
       * The tip that you want to show the user
       *
       * @name jquery.tooltip#tip
       * @type string
       * @default false
       */
      tip: false,
      /**
       * The placement of the tooltip. (top, right, bottom, or left)
       *
       * @name jquery.tooltip#place
       * @type string
       * @default 'top'
       */
      place: 'top'
    },

    data: ['tip', 'place'],

    init: function(){
      var plugin = this;

      if (!plugin.settings.tip) return;

      /*
       * -----------------
       * BUILD THE TOOLTIP
       * -----------------
       */
      plugin.$tip = $('<div class="tooltip__tip tooltip__tip--arrow-' + arrowPlacement + '">').html(plugin.settings.tip);
      plugin.$tooltip = $('<div class="tooltip">').html(plugin.$tip);
      plugin.$el.addClass('w-tooltip').append(plugin.$tooltip);

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

      plugin.$tip.addClass('tooltip__tip--arrow-' + arrowPlacement);

      /*
       * -----------------------------
       * PLACE THE TOOLTIP ACCORDINGLY
       * -----------------------------
       */
      // Cache dem dimensions
      var tw = plugin.$tip.outerWidth(),
          th = plugin.$tip.outerHeight(),
          ew = plugin.$el.outerWidth(),
          eh = plugin.$el.outerHeight();

      // Align center
      switch (plugin.settings.place) {
        case 'top':
        case 'bottom':
          // Align horizontally center
          plugin.$tooltip.css('left', ( ew - tw ) / 2);
          break;
        case 'left':
        case 'right':
          // Align vertically center
          plugin.$tooltip.css('top', ( eh - th ) / 2);
          break;
      }

      // Position
      switch (plugin.settings.place) {
        case 'top':
          plugin.$tooltip.css('top', -th);
          break;
        case 'bottom':
          plugin.$tooltip.css('bottom', -th);
          break;
        case 'left':
          plugin.$tooltip.css('left', -tw);
          break;
        case 'right':
          plugin.$tooltip.css('right', -tw);
          break;
      }

      /*
       * ---------------
       * ADD HOVER EVENT
       * ---------------
       */
      //Add event to activate
      plugin.$el
        .mouseenter(function(){
          plugin.$tooltip.addClass('is-active');
        })
        .mouseleave(function(){
          plugin.$tooltip.removeClass('is-active');
        });
    },

    /**
     * Force open the tooltip
     *
     * @method
     * @name jquery.tooltip#open
    **/
    open: function(){
      this.$tooltip.addClass('is-forced-active');
    },

    /**
     * Force close the tooltip
     *
     * @method
     * @name jquery.tooltip#close
    **/
    close: function(){
      this.$tooltip.removeClass('is-forced-active');
    }

  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;

});
