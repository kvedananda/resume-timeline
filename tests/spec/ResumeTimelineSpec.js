$(document).ready(function() {
  describe("ResumeTimeline", function() {

    function getTestElement() {
      var element = $('<div>').css({ 'width': '400px', 'height': '100px' });
      $('body').append(element);
      return element;
    }

    describe("instantiation", function() {
      var element = getTestElement();

      it("should create an instance of ResumeTimeline", function() {
        expect(element.data('resumeTimeline')).toEqual(undefined);
        element.resumeTimeline();
        expect(typeof(element.data('resumeTimeline'))).toEqual("object");
      })

      it("should create chainable plugins", function() {
        expect(element.resumeTimeline().hasClass('test-class')).toBeFalsy();
        element.resumeTimeline().addClass('test-class');
        expect(element.resumeTimeline().hasClass('test-class')).toBeTruthy();
      });

      element.remove();
    });

    describe("Basic initialization with no data", function() {
      var element = getTestElement(),
        margins = {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        },
        styles = {
          prefix: '',
          svg: 'test-svg',
          vizContainer: 'test-viz-container',
          itemsContainer: 'test-item-container'
        },
        options = {
          resizeDelay: 200,
          margins: margins,
          styles: styles
        };
      element.resumeTimeline(options);

      it("should create an svg container", function() {
        var svgElement = element.find('svg.' + styles.svg);
        expect(svgElement.length).toEqual(1);
      });

      it("should create a g element to provide margins", function() {
        var gElement = element.find('g.' + styles.vizContainer);
        expect(gElement.length).toEqual(1);
      });

      it("should create a g element for containing resume items", function() {
        var gElement = element.find('g.' + styles.itemsContainer);
        expect(gElement.length).toEqual(1);
      });

      it("should set the svg element to use all available space", function() {
        var svgElement = element.find('svg.' + styles.svg);
        expect(svgElement.width()).toEqual(400);
        expect(svgElement.height()).toEqual(100);
      });

      it("should move main g element to provide proper margins", function() {
        var gElement = element.find('g.' + styles.vizContainer);
        expect(gElement.attr('transform')).toEqual('translate(' + margins.left + ',' + margins.top + ')');
      });

      it("should resize the svg container on resize event", function() {
        var svgElement = element.find('svg.' + styles.svg);
        expect(svgElement.width()).toEqual(400);
        runs(function() {
          element.css('width', '300px');
          $(window).trigger('resize');
        });
        waits(options.resizeDelay + 10);
        runs(function() {
          expect(svgElement.width()).toEqual(300);
        });
        this.after(function() {
          element.remove();
        });
      });
    });

    describe("Initialization with data", function() {
      var element = getTestElement(),
        styles = {
          prefix: '',
          itemsContainer: 'item-container',
          yearsContainer: 'years-container'
        },
        data = [ 
          {
            "title": "Education",
            "location": "Boston, MA",
            "startDate": "01 January 2003",
            "endDate": "01 June 2003"
          },
          {
            "title": "Internship",
            "location": "Lexington, MA",
            "startDate": "01 January 2004",
            "endDate": "31 August 2004"
          }
        ];

      element.resumeTimeline({
        styles: styles,
        data: data,
        margins: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      });

      it("should create rect elements for each data item", function() {
        var resumeItems = element.find("g." + styles.itemsContainer).find("rect");
        expect(resumeItems.length).toEqual(data.length);
      });

      it("should create rect elements for each year in the timeline range", function() {
        var years = element.find("g." + styles.yearsContainer).find("rect");
        expect(years.length).toEqual(2);
      });

      it("should set rect elements to the right width", function() {
        var years = element.find("g." + styles.yearsContainer).find("rect");
        for(var i = 0; i < years.length; i++) {
          expect(Math.round($(years[i]).attr('width'))).toEqual(190);
        }
        this.after(function() {
          element.remove();
        });
      });

    });



  /*
    describe("_determineOrientation method", function() {

      it("should detect landscape orientation", function() {
        element.css({ 'height': '100px', 'width': '400px' }); 
        expect(element.resumeTimeline('_determineOrientation')).toEqual("landscape");
      });
      
      it("should detect portrait orientation", function() {
        element.css({ 'height': '400px', 'width': '100px' }); 
        expect(element.resumeTimeline('_determineOrientation')).toEqual("portrait");
      });

    }); 

    describe("setOptions method", function() {
    
      var resumeTimelineInstance = element.data('resumeTimeline');
      it("should set the class of the svg element to the specified class", function() {
        expect(svgElement.attr('class')).toEqual(options.styles.prefix + '-' + options.styles.svg);
      });

      it("should change plugin options", function() {
        expect(resumeTimelineInstance.options.data).toEqual(undefined);
        element.resumeTimeline('setOptions', {
          data: [ 
            {
              "title": "Education",
              "location": "Boston, MA",
              "startDate": "01 September 2003",
              "endDate": "01 June 2009"
            },
            {
              "title": "Internship",
              "location": "Lexington, MA",
              "startDate": "01 June 2008",
              "endDate": "31 August 2008"
            }
          ]
        });
        expect(resumeTimelineInstance.options.data.length).toEqual(2);
      });


      it("should rebuild when options are changed", function() {
        spyOn(resumeTimelineInstance, '_buildTimeline');
        element.resumeTimeline('setOptions', {
          data: [ 
            {
              "title": "Education",
              "location": "Boston, MA",
              "startDate": "01 September 2003",
              "endDate": "01 June 2009"
            }
          ]
        });
        expect(resumeTimelineInstance._buildTimeline).toHaveBeenCalled();      
      });

      it("should re-render when options are changed", function() {
        spyOn(resumeTimelineInstance, 'render');
        element.resumeTimeline('setOptions', {
          data: [ 
            {
              "title": "Education",
              "location": "Boston, MA",
              "startDate": "01 September 2003",
              "endDate": "01 June 2009"
            }
          ]
        });
        expect(resumeTimelineInstance.render).toHaveBeenCalled(); 
      });

      it("should reset and prepare when options are changed", function() {
        var resumeInstance = element.data('resumeTimeline');
        expect(resumeInstance.data.resumeData.length).toEqual(1);
        resumeInstance.setOptions({
          data: [ 
            {
              "title": "Education",
              "location": "Boston, MA",
              "startDate": "01 September 2003",
              "endDate": "01 June 2009"
            },
            {
              "title": "Education",
              "location": "Boston, MA",
              "startDate": "01 September 2003",
              "endDate": "01 June 2009"
            }
          ]
        });
        expect(resumeInstance.data.resumeData.length).toEqual(2);     
      });
    });
  */
  });
});
