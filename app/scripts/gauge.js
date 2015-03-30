/* jshint devel:true */

$.fn.gauge = (function() {
  'use strict';

  var // Canvas size
    DEFAULT_CANVAS_WIDTH = 1060,
    DEFAULT_CANVAS_HEIGHT = 500,

    // Values
    // DEFAULT_MIN = 0,
    DEFAULT_VALUE = 50,
    DEFAULT_MAX = 1000,

    // Arc
    DEFAULT_RADIUS = 75,
    DEFAULT_ANGLE_START = 0.7,
    DEFAULT_ANGLE_END = 2.3,
    DEFAULT_LINE_WIDTH = 2,
    DEFAULT_SECTORS = [{
      'limitTo': 1.9,
      'color': '#666666'
    }, {
      'limitTo': 2.2,
      'color': '#ffa500'
    }, {
      'limitTo': 2.3,
      'color': '#ff0000'
    }],

    // Arrow
    DEFAULT_ARROW_WIDTH = 3,
    DEFAULT_ARROW_COLOR = '#1e98e4',
    DEFAULT_ARROW_CIRCLE_RADIUS = 7,

    // Tick text
    DEFAULT_TICK_TEXT_COLOR = '#444',
    DEFAULT_TICK_TEXT_SIZE = '12',
    DEFAULT_TICK_TEXT_FONT = 'Serif';

  var draw = function($elem) {

    /**
     * Insert canvas into object
     */
    var _createCanvas = function() {
      $('.gauge').html('<canvas id="myCanvas" width="' + DEFAULT_CANVAS_WIDTH + '" height="' + DEFAULT_CANVAS_HEIGHT + '"></canvas>');
    };

    /**
     * Retina canvas resize
     *
     * @param {Object} Canvas
     */
    var _ratinaScreenReSize = function(canvas) {
      if (window.devicePixelRatio > 1) {
        canvas.width = DEFAULT_CANVAS_WIDTH;
        canvas.height = DEFAULT_CANVAS_HEIGHT;
        canvas.style.width = DEFAULT_CANVAS_WIDTH / 2 + 'px';
        canvas.style.height = DEFAULT_CANVAS_HEIGHT / 2 + 'px';
      }
    };

    /**
     * Get attribute
     *
     * @return {String} The element attr
     */
    var _getAttr = function(attribute) {
      return $elem.attr('gauge-' + attribute);
    };

    /**
     * Draw arc
     */
    var _drawArc = function() {
      var
        canvas = document.getElementById('myCanvas'),
        context = canvas.getContext('2d'),

        // Position
        x = canvas.width / 2,
        y = canvas.height / 2,

        // Get radius. Default: 75
        radius = _getAttr('radius') || DEFAULT_RADIUS,

        startAngle = (+_getAttr('startAngle') || DEFAULT_ANGLE_START) * Math.PI,
        endAngle = (+_getAttr('endAngle') || DEFAULT_ANGLE_END) * Math.PI,

        counterClockwise = false,

        // Atribute params to JSON. Default: `DEFAULT_SECTORS`
        sectors = eval(_getAttr('sectors')) || DEFAULT_SECTORS;

      // First thing before rendering
      // we should to know is high DPI screen or not
      _ratinaScreenReSize(canvas);

      // Draw arc
      // Set line width. Default: `DEFAULT_LINE_WIDTH`
      context.lineWidth = _getAttr('lineWidth') || DEFAULT_LINE_WIDTH;

      // TODO: sector.length
      // First sector
      context.beginPath();
      context.arc(x, y, radius, startAngle, sectors[0].limitTo * Math.PI, counterClockwise);
      context.strokeStyle = sectors[0].color;
      context.stroke();

      // Second
      context.beginPath();
      context.arc(x, y, radius, sectors[0].limitTo * Math.PI, sectors[1].limitTo * Math.PI, counterClockwise);
      context.strokeStyle = sectors[1].color;
      context.stroke();

      // Third sector
      context.beginPath();
      context.arc(x, y, radius, sectors[1].limitTo * Math.PI, endAngle, counterClockwise);
      context.strokeStyle = sectors[2].color;
      context.stroke();
    };

    /**
     * Draw arrow
     */
    var _drawArrow = function() {
      var
        canvas = document.getElementById('myCanvas'),
        context = canvas.getContext('2d'),

        // Get arrow width from attribute. Default: `DEFAULT_ARROW_WIDTH`
        arrowWidth = _getAttr('arrow-width') || DEFAULT_ARROW_WIDTH,

        // Get arrow width from attribute. Default: `DEFAULT_ARROW_COLOR`
        arrowColor = _getAttr('arrow-color') || DEFAULT_ARROW_COLOR,

        // Get radius. Default: `DEFAULT_RADIUS`
        radius = _getAttr('radius') || DEFAULT_RADIUS,

        // Circle radius. Default: `DEFAULT_ARROW_CIRCLE_RADIUS`
        circleRadius = _getAttr('arrow-circle-radius') || DEFAULT_ARROW_CIRCLE_RADIUS,

        // Current position
        angle = 0,

        // Arrow start angle. Default: `DEFAULT_ANGLE_START`
        arrowStartAngle = +_getAttr('startAngle') || DEFAULT_ANGLE_START,

        // Arrow limit/end angle. Default: `DEFAULT_ANGLE_END`
        arrowEndAngle = +_getAttr('endAngle') || DEFAULT_ANGLE_END,

        // Current value. Default: `DEFAULT_VALUE`
        value = +_getAttr('value') || DEFAULT_VALUE,

        // Maximum value. Default: `DEFAULT_MAX`
        max = +_getAttr('max') || DEFAULT_MAX,
        step = 0,

        // Fix arrow position
        // multiplier = 0,

        // Step for fixing position
        // multiplierStep = 0,

        newValue = 0;

      // multiplier = (parseFloat(_getAttr('startAngle')).toFixed(2) * 10) - 5;

      // Fix position...
      // Yeah, it's looks not cool, for MVP it's ok
      // if (value < (max / 2) - 1) {
      //   value = value + (multiplierStep * multiplier);
      // } else if (value > (max / 2) + 1) {
      //   value = value - (multiplierStep * multiplier);
      // } else if (value === max / 2) {
      //   value = +_getAttr('value');
      // }

      // Data for rendering
      newValue = max / value;
      step = (arrowEndAngle / max) + arrowStartAngle;
      angle = 2 / newValue;

      // Set fill color
      context.fillStyle = arrowColor;

      context.save();
      context.beginPath();
      context.translate(canvas.width / 2, canvas.height / 2);

      // Rotate arrow
      context.rotate(angle * Math.PI);

      // Draw figure
      context.moveTo(0 - arrowWidth, 0);
      context.lineTo(0, radius);
      context.lineTo(0 + arrowWidth, 0);
      context.lineTo(0 - arrowWidth, 0);

      context.fill();
      context.closePath();
      context.restore();

      // Create circle
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, 2 * Math.PI, false);
      context.fillStyle = arrowColor;
      context.fill();
    };

    /**
     * Degrees to radians
     *
     * @param {Integer} Degrees
     * @return {Float} Radians
     */
    var _degToRad = function(degrees) {
      return degrees * (Math.PI / 180);
    };

    /**
     * Draw ticks
     */
    var _drawTicks = function() {
      var
        canvas = document.getElementById('myCanvas'),
        context = canvas.getContext('2d'),

        // Tick inner or outter style
        tickInner = _getAttr('tick-inner'),
        // Tick size
        tickSize = _getAttr('tick-size'),
        // Color
        tickColor = _getAttr('tick-color'),
        // Radius
        radius = +_getAttr('radius'),

        max = +_getAttr('max'),
        step = +_getAttr('step'),

        tickValue = 0,
        tickRadius = 0,

        // Data for tick positions
        onArchX = 0,
        onArchY = 0,
        innerTickX = 0,
        innerTickY = 0,
        tickStartX = 0,
        tickStartY = 0,
        tickEndX = 0,
        tickEndY = 0,

        // Tick text num. TODO: from min attr
        tickNum = 0,

        // Tick text render X and Y positions
        tickTextX = 0,
        tickTextY = 0,
        // Tick text color...
        tickTextColor = _getAttr('tick-text-color') || DEFAULT_TICK_TEXT_COLOR,
        // ...font size...
        tickTextSize = _getAttr('tick-text-size') || DEFAULT_TICK_TEXT_SIZE,
        // ...and font name
        tickTextFont = _getAttr('tick-text-font') || DEFAULT_TICK_TEXT_FONT;

      // TODO: inner and outer style
      // now not working...
      if (tickInner) {
        tickValue = radius - tickSize;
      } else {
        tickValue = radius + tickSize;
      }

      for (var i = -54; i < 235; i += (287 * step / max)) {
        tickRadius = _degToRad(i);

        onArchX = radius - (Math.cos(tickRadius) * tickValue);
        onArchY = radius - (Math.sin(tickRadius) * tickValue);

        innerTickX = radius - (Math.cos(tickRadius) * radius);
        innerTickY = radius - (Math.sin(tickRadius) * radius);

        tickStartX = (canvas.width / 2 - radius) + onArchX;
        tickStartY = (canvas.height / 2 - radius) + onArchY;

        tickEndX = (canvas.width / 2 - radius) + innerTickX;
        tickEndY = (canvas.height / 2 - radius) + innerTickY;

        // Render tick
        context.beginPath();
        context.strokeStyle = tickColor;
        context.moveTo(tickStartX, tickStartY);
        context.lineTo(tickEndX, tickEndY);
        context.stroke();
        context.closePath();

        // Draw ticks num text
        context.font = tickTextSize + 'px ' + tickTextFont;
        context.fillStyle = tickTextColor;

        // Tick text X and Y pos
        tickTextX = (canvas.width / 2 - (radius + 3)) + (radius - (Math.cos(tickRadius) * (radius + 20)));
        tickTextY = (canvas.height / 2 - (radius - 3)) + (radius - (Math.sin(tickRadius) * (radius + 20)));

        // Render text
        context.fillText(tickNum, tickTextX, tickTextY);
        tickNum += 1;
      }
    };

    _createCanvas();
    _drawArc();
    _drawArrow();
    _drawTicks();
  };

  $(window).load(function() {
    var timer;
    var gaugeWatch = function() {
      timer = setTimeout(function() {
        $('.gauge').each(function() {
          draw($(this));
        });
        clearTimeout(timer);
        gaugeWatch();
      }, 100);
    };

    $('.gauge').each(function() {
      draw($(this));
      // gaugeWatch();
    });
  });

}());