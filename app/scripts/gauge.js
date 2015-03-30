/* jshint devel:true */

$.fn.gauge = (function() {
  'use strict';

  var // Canvas size
    DEFAULT_CANVAS_WIDTH = 580,
    DEFAULT_CANVAS_HEIGHT = 250,

    // Values
    // DEFAULT_MIN = 0,
    DEFAULT_VALUE = 50,
    DEFAULT_MAX = 1000,

    // Arc
    DEFAULT_RADIUS = 75,
    DEFAULT_ANGLE_START = 0.7,
    DEFAULT_ANGLE_END = 0.7,
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
    DEFAULT_ARROW_CIRCLE_RADIUS = 7;

  var draw = function($elem) {

    var _createCanvas = function() {
      $('.gauge').html('<canvas id="myCanvas" width="' + DEFAULT_CANVAS_WIDTH + '" height="' + DEFAULT_CANVAS_HEIGHT + '"></canvas>');
    };

    var _getAttr = function(attribute) {
      return $elem.attr('gauge-' + attribute);
    };

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
        multiplier = 0,

        // Step for fixing position
        multiplierStep = 0,

        newValue = 0;

      multiplier = (parseFloat(_getAttr('startAngle')).toFixed(2) * 10) - 5;

      // Fix position...
      // Yeah, it's looks not cool, for MVP it's ok
      if (value < (max / 2) - 1) {
        value = value + (multiplierStep * multiplier);
      } else if (value > (max / 2) + 1) {
        value = value - (multiplierStep * multiplier);
      } else if (value === max / 2) {
        value = +_getAttr('value');
      }

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

    var _degToRad = function(degrees) {
      return degrees * (Math.PI / 180);
    }

    var _drawFace = function() {
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
        radius = _getAttr('radius'),

        tickValue = 0,
        tickRadius = 0,

        //
        onArchX = 0,
        onArchY = 0,
        innerTickX = 0,
        innerTickY = 0,

        tickStartX = 0,
        tickStartY = 0,

        tickEndX = 0,
        tickEndY = 0,

        tickNum = 0; // get min

      // TODO: inner and outer style
      // now not working...
      if (tickInner) {
        tickValue = radius - tickSize;
      } else {
        tickValue = radius + tickSize;
      }

      for (var i = -55; i < 235; i += 48) {
        tickRadius = _degToRad(i);

        onArchX = 75 - (Math.cos(tickRadius) * tickValue);
        onArchY = 75 - (Math.sin(tickRadius) * tickValue);

        innerTickX = 75 - (Math.cos(tickRadius) * 75);
        innerTickY = 75 - (Math.sin(tickRadius) * 75);

        tickStartX = (canvas.width / 2 - 75) + onArchX;
        tickStartY = (canvas.height / 2 - 75) + onArchY;

        tickEndX = (canvas.width / 2 - 75) + innerTickX;
        tickEndY = (canvas.height / 2 - 75) + innerTickY;

        context.beginPath();
        context.strokeStyle = tickColor;
        context.moveTo(tickStartX, tickStartY);
        context.lineTo(tickEndX, tickEndY);
        context.stroke();
        context.closePath();

        // Draw ticks num text
        context.font = '12px serif';
        context.fillStyle = 'black';
        // context.fillText("1", onArchX + canvas.width / 2, onArchY + canvas.height / 2);
        
        // Refactoring:
        var tickTextX = (canvas.width / 2 - 78) + (75 - (Math.cos(tickRadius) * 95));
        var tickTextY = (canvas.height / 2 - 72) + (75 - (Math.sin(tickRadius) * 95));

        // context.moveTo(tickStartX, tickStartY);
        context.fillText(tickNum, tickTextX, tickTextY);
        tickNum += 1;
      }
    };

    _createCanvas();
    _drawArc();
    _drawArrow();
    _drawFace();
  };

  $(window).load(function() {
    $('.gauge').each(function() {
      draw($(this));
    });
  });

}());