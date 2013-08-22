describe("ResumeTimeline", function() {

  var element = $('<div>'),
    options = {
      styles: {
        prefix: 'my-prefix',
        svg: 'custom-class-name'
      },
      resizeDelay: 300
    };

    $('body').append(element);

    element
      .css({ 'width': '400px', 'height': '100px' })
      .resumeTimeline(options);

  describe("simpleWidget", function() {

    it("should create an instance of ResumeTimeline", function() {
      expect(!!$.data(element.get(0), 'resumeTimeline')).toBeTruthy();
    })

    it("should create chainable plugins", function() {
      element.resumeTimeline().addClass('test-class');
      expect(element.resumeTimeline().hasClass('test-class')).toBeTruthy();
      element.removeClass('test-class');
    });
    
  });

  describe("_create method", function() {

    var svgElement = element.find("svg");

    it("should create an svg element", function() {
      expect(svgElement.length).toBeGreaterThan(0);
    });

    it("should set the class of the svg element to the specified class", function() {
      expect(svgElement.attr('class')).toEqual(options.styles.prefix + '-' + options.styles.svg);
    });

    it("should re-render on resize event", function() {
      var resumeTimelineInstance = element.data('resumeTimeline');
      spyOn(resumeTimelineInstance, 'render');
      runs(function() {
        $(window).trigger('resize');
      });

      waits(options.resizeDelay + 10);

      runs(function() {
        expect(resumeTimelineInstance.render).toHaveBeenCalled();
      });

    });

  });

  describe("Container/page orientation", function() {

    it("should detect landscape orientation", function() {
      element.css({ 'height': '100px', 'width': '400px' }); 
      expect(element.resumeTimeline('_determineOrientation')).toEqual("landscape");
    });
		
    it("should detect portrait orientation", function() {
      element.css({ 'height': '400px', 'width': '100px' }); 
      expect(element.resumeTimeline('_determineOrientation')).toEqual("portrait");
		});


  }); 

});
