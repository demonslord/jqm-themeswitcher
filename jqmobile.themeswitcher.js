/*
 * JQuery Mobile ThemeSwitcher Plugin
 * https://github.com/demonslord/jqm-themeswitcher
 * Copyright (c) 2013 Alexander Bulei.
 * Licensed under the MIT, GPL licenses.
 * Version: V1.0
 */

;(function ($, window, document, undefined) {
    
    // Defaults
    var pluginName = "jqmthemeswitcher";
    // overrideable defaults
    var defaults = {
		themes: [],
		themesPath: '/',
		buttonSettings: {
			'icon': 'gear',
			'inline': true,
			'shadow': false,
			'theme': 'd'
		},
		dialogSettings: {
			'theme': 'a',
			'headerTitle': 'Switch Theme:',
			'headerTheme': 'b',
			'contentTheme': 'c',
			'closeBtn': 'left'
		},
		jqmVersion: '1.3.1',
		cookiename: "jquery-mobile-theme",
		cookieexpires: 365,
		cookiepath: '/'		
    };

    // plugin constructor
    function Plugin(element, options) {	
        this.element = element;
		this.$element = $(element);
        this.options = $.extend( true, defaults, options );		
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {			
			var self = this,
				themelist = ['default'],
				dataurl = this.element.id + '_tsdialog';
			if( this.options.themes.length ){
				$.merge(themelist, this.options.themes );
			}						
			
			// load the default theme or the theme stored in the cookie
			if( $.cookie(this.options.cookiename) ){
				this.updateTheme( $.cookie(this.options.cookiename) );
			}
				
			// create button
			this.$element.buttonMarkup(this.options.buttonSettings).attr('href','#'+dataurl);
			
			// create dialog
			var html = '';
			html += '<div data-url="'+dataurl+'" data-close-btn="'+this.options.dialogSettings.closeBtn+'" data-role="dialog" data-theme="'+this.options.dialogSettings.theme+'">';
			html += '<div data-role="header" data-theme="'+this.options.dialogSettings.headerTheme+'">';
			html += '<div class="ui-title">'+this.options.dialogSettings.headerTitle+'</div>';
			html += '</div>';
			html += '<div data-role="content" data-theme="'+this.options.dialogSettings.contentTheme+'">';
			html += '<ul data-role="listview" data-inset="true"></ul></div>';			
			html += '</div>';
			
			$dialog = this.element.tsdialog = $(html);
			var $pageContainer = $.mobile.pageContainer;
			$dialog.appendTo($pageContainer);
			var $list = $dialog.find('ul');
			$.each(themelist, function( i ){
						$('<li><a href="#" data-rel="back">' + themelist[ i ].charAt(0).toUpperCase() + themelist[ i ].substr(1) + '</a></li>')
							.bind("vclick", function(){								
								$dialog.dialog("close");
								self.updateTheme( themelist[i] );
								return false;
							})
							.appendTo($list);
					});
			$dialog.page();
			
        },
        
        updateTheme: function (theme) {
			var jqmver = this.options.jqmVersion || '1.3.1',
				cssfilename = 'jquery.mobile.theme-' + jqmver + '.css',
				currentStyle = $('link[href*="'+cssfilename+'"]').first() || [];
			var url = this.options.themesPath + theme + '/' + cssfilename; 
			
			if (currentStyle.length) {
				currentStyle[0].href = url;			
			} else {
				var style = $("<link/>")
					.attr("type","text/css")
					.attr("rel","stylesheet")
					.attr("href", url);	 			
				style.appendTo("head");			
			}

			$.cookie(this.options.cookiename, theme, 
                { expires: this.options.cookieexpires, path: this.options.cookiepath }
            );
        }		
    };

    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };
    
    $(function(){
        $( "." + pluginName )[ pluginName ]();
    });

})(jQuery, window, document);