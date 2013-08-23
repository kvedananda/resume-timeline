(function($,undefined) {
  var widget_name = 'resumeTimeline';
  var widget = {
    options: {
      data: undefined,
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      styles: {
        prefix: 'resume-timeline-', 
        svg: 'svg',
        vizContainer: 'viz-container',
        itemsContainer: 'items-container',
        yearsContainer: 'years-container'
      },
      resizeDelay: 250
    },
    elements: {},
    data: {
      resumeData: [],
      dates: {}
    },

    _create: function() {
      var elements = this.elements = {},
        container = elements.container = this.element,
        styles = this.options.styles,
        resizeTimeout, self = this;

      elements.svg = d3
        .select(container.get(0))
          .append('svg')
            .attr('class', styles.prefix + styles.svg);

      elements.vizContainer = elements.svg
        .append('g')
          .attr('class', styles.prefix + styles.vizContainer);

      elements.itemsContainer = elements.vizContainer
        .append('g')
          .attr('class', styles.prefix + styles.itemsContainer);

      elements.yearsContainer = elements.vizContainer
        .append('g')
          .attr('class', styles.prefix + styles.yearsContainer);

      if(self.options.data != undefined) {
        self._prepareData(self.options.data);
        self._buildTimeline()
      }

      self.render();

      $(window).resize(function() {
        if(resizeTimeout) {
          clearInterval(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
          self.render();
        }, self.options.resizeDelay);
      });

    },

    _prepareData: function(userData) {
      var self = this,
        data = self.data = {},
        resumeData = userData.slice(0),
        min = Infinity,
        max = -Infinity,
        maxDate, minDate, i, item, minYear;

      data.resumeData = resumeData
      for(i = 0; i < resumeData.length; i++) {
        item = resumeData[i];
        item['startDateObj'] = new Date(item['startDate']);
        if(item['startDateObj'].getTime() < min) {
          min = item['startDateObj'].getTime();
          minDate = item['startDateObj'];
        }
        item['endDateObj'] = new Date(item['endDate']);
        if(item['endDateObj'].getTime() > max)
          max = item['endDateObj'].getTime();
          maxDate = item['endDateObj'];
      }

      data.dates = {
        minYearStart: new Date("January 01 " + minDate.getFullYear()),
        maxYearEnd: new Date(maxDate.getFullYear(), 11, 31, 23, 59, 59, 999),
        years: []
      }
      minYear = data.dates.minYearStart;
      while(minYear.getTime() <= data.dates.maxYearEnd.getTime()) {
        data.dates.years.push(new Date(minYear.getFullYear(), 0));
        minYear = new Date(minYear.getFullYear() + 1, 0);
      }
    },

    _buildTimeline: function() {
      if(this.data.resumeData.length > 0) {
        this.elements.itemsContainer
          .selectAll("rect")
            .data(this.data.resumeData)
            .enter().append("rect")
        this.elements.yearsContainer
          .selectAll("rect")
            .data(this.data.dates.years)
            .enter().append("rect")
      }
    },

    setOptions: function(options) {
      $.extend(true, this.options, options);
      if(options.data != undefined) {
        this.options.data = options.data;
      }
      this._prepareData(this.options.data);
      this._buildTimeline();
      this.render();
    },

    resize: function() {
      this.render();
    },

    render: function() {
      var elements = this.elements,
        options = this.options,
        margins = options.margins,
        availableWidth = elements.container.innerWidth(),
        availableHeight = elements.container.innerHeight(),
        width = availableWidth - margins.left - margins.right,
        height = availableHeight - margins.top - margins.bottom;

      elements.svg
        .attr('width', availableWidth)
        .attr('height', availableHeight);

      elements.vizContainer
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')
        .attr('width', width)
        .attr('height', height);
      
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

