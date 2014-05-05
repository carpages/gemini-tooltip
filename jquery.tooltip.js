define(['jquery.boiler', 'jquery.activator'], function($){

	$.boiler('tooltip', {
		defaults: {
			tip: false,
			align: 'center',
			place: 'top'
		},

		data: ['tip', 'place', 'align'],

		init: function(){
			var plugin = this;

			if (!plugin.settings.tip) return;

			//Add tooltip
			plugin.$tip = $('<div class="tooltip__tip tooltip__tip--place-' + plugin.settings.place + '">').html(plugin.settings.tip);
			plugin.$tooltip = $('<div class="tooltip__wrapper">').html(plugin.$tip);
			plugin.$el.addClass('tooltip').append(plugin.$tooltip);

			//Place the wrapper
			if(plugin.settings.place == 'top'){
				plugin.$tooltip.css('bottom', '100%');
			}else if(plugin.settings.place == 'right'){
				plugin.$tooltip.css('left', '100%');
			}else if(plugin.settings.place == 'bottom'){
				plugin.$tooltip.css('top', '100%');
			}else if(plugin.settings.place == 'left'){
				plugin.$tooltip.css('right', '100%');
			}

			//Align the wrapper
			if(plugin.settings.place == 'top' || plugin.settings.place == 'bottom'){
				//Top or bottom
				if(plugin.settings.align == 'center'){
					plugin.$tooltip.css('left', ( plugin.$el.width() - plugin.$tip.width() ) / 2);
				}else if(plugin.settings.align == 'left'){
					plugin.$tooltip.css('left', 0);
				}else if(plugin.settings.align == 'right'){
					plugin.$tooltip.css('right', 0);
				}
			}else if(plugin.settings.place == 'left' || plugin.settings.place == 'right'){
				//Left or right
				if(plugin.settings.align == 'center'){
					plugin.$tooltip.css('top', ( plugin.$el.height() - plugin.$tip.height() ) / 2);
				}else if(plugin.settings.align == 'top'){
					plugin.$tooltip.css('top', 0);
				}else if(plugin.settings.align == 'bottom'){
					plugin.$tooltip.css('bottom', 0);
				}
			}

			//Add event to activate
			plugin.$el
				.mouseenter(function(){
					plugin.$tooltip.addClass('is-active');
				})
				.mouseleave(function(){
					plugin.$tooltip.removeClass('is-active');
				});
		}
	});

	// Return the jquery object
	// This way you don't need to require both jquery and the plugin
	return $;

});