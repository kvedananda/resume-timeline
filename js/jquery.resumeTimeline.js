(function($,undefined) {
  var widget_name = 'resumeTimeline';
  var widget = {
    options: {
      data: undefined,
      styles: {
        prefix: 'resume-timeline', 
        svg: 'svg',
        vizContainer: 'viz-container'
      },
      resizeDelay: 250
    },

    _create: function() {
      var elements = this.elements = {},
        container = elements.container = this.element,
        styles = this.options.styles,
        resizeTimeout, _this = this;

      elements.svg = d3
        .select(container.get(0))
          .append('svg')
            .attr('class', styles.prefix + '-' + styles.svg);

      elements.vizContainer = elements.svg
        .append('g')
          .attr('class', styles.prefix + '-' + styles.vizContainer);

      this.render();

      $(window).resize(function() {
        if(resizeTimeout) {
          clearInterval(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
          _this.render();
        }, _this.options.resizeDelay);
      });

    },

    render: function() {
      var margin = {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        elements = this.elements,
        availableWidth = elements.container.innerWidth(),
        availableHeight = elements.container.innerHeight(),
        width = availableWidth - margin.left - margin.right,
        height = availableHeight - margin.top - margin.bottom;

      elements.svg
        .attr('width', availableWidth)
        .attr('height', availableHeight);

      elements.vizContainer
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      
    },

    _determineOrientation: function() {
      var height = this.element.innerHeight(),
        width = this.element.innerWidth(),
        orientation = height > width ? 'portrait' : 'landscape';
      return orientation;
    }


  };

  $.simpleWidget = function( widget_name, widget ) {
    // Create selector.
    $.expr[':'][ widget_name ] = function( elem ) {
      return !!$.data( elem, widget_name );
    };
    
    // Create plugin method.
    $.fn[ widget_name ] = function( options ) {
      var args,
        args_to_slice = 0,
        method_name = '_create',
        result;
      
      // Was a method name passed as the first argument?
      if ( typeof options === 'string' && $.isFunction( widget[ options ] ) ) {
        method_name = options;
        args_to_slice = 1;
      }
      
      // Parse the passed arguments.
      args = Array.prototype.slice.call( arguments, args_to_slice );
      
      // Call the appropriate method in the context of each passed element's
      // instance.
      this.each(function(){
        var elem = $(this),
          data = elem.data( widget_name ),
          created = data,
          method;
        
        // If widget has no data, initialize instance data.
        data || elem.data( widget_name, data = $.extend(true, {}, widget, {
          element: elem,
          options: options
        }));
        
        // Only execute method when appropriate.
        if ( created ? method_name !== '_create' : method_name !== 'destroy' ) {
          method = data[ method_name ];
          result = $.isFunction( method ) && method.apply( data, args );
        }
        
        if ( method_name === 'destroy' ) {
          // If destroying a widget, remove instance data.
          elem.removeData( widget_name );
          
        } else if ( result !== undefined ) {
          // If method returned a non-undefined value, break out of the each.
          return false;
        }
      });
      
      // If method returned a non-undefined value, return that value (this will
      // break the chain).
      return result !== undefined ? result : this;
    };
  };

  $.simpleWidget(widget_name, widget);
  
})(jQuery);

