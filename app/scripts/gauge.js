/* jshint devel:true */

/**
  The MIT License (MIT)

  Copyright (c) 2015 Andrey Keske

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

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

    // Arrow
    DEFAULT_ARROW_WIDTH = 3,
    DEFAULT_ARROW_COLOR = '#1e98e4',
    DEFAULT_ARROW_CIRCLE_RADIUS = 7,

    // Tick
    DEFAULT_TICK_COLOR = '#666',
    DEFAULT_TICK_HEIGHT = '18',

    // Tick text
    DEFAULT_TICK_TEXT_COLOR = '#444',
    DEFAULT_TICK_TEXT_SIZE = '12',
    DEFAULT_TICK_TEXT_FONT = 'Arial';

  /**
   * Append elements into the object
   */
  var _createGaugeElements = function($elem) {
    var
      canvasWidth = $elem.css('width').replace('px', '') || DEFAULT_CANVAS_WIDTH,
      canvasHeight = $elem.css('height').replace('px', '') || DEFAULT_CANVAS_HEIGHT;

    // Canvas...
    $elem.append('<canvas id="myCanvas" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');
    // ...arrow...
    $elem.append('<div class="arrow"><div class="arrow-circle"></div></div>');
    // ...ticks
    $elem.append('<div class="tick"></div>');
  };

  var draw = function($elem) {

    /**
     * Retina canvas resize
     *
     * @param {Object} Canvas
     */
    var _ratinaScreenReSize = function(canvas) {
      var
        canvasWidth = $elem.css('width').replace('px', '') || DEFAULT_CANVAS_WIDTH,
        canvasHeight = $elem.css('height').replace('px', '') || DEFAULT_CANVAS_HEIGHT;
        // context = canvas.getContext('2d');

      if (window.devicePixelRatio > 1) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = canvasWidth / 2 + 'px';
        canvas.style.height = canvasHeight / 2 + 'px';
        // context.translate(canvasWidth, canvasWidth);
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

        // Sector background color array
        // TODO: refactoring
        sectorBackgroundColor = [
          $('.gauge .sector:nth-child(1)').css('background-color'),
          $('.gauge .sector:nth-child(2)').css('background-color'),
          $('.gauge .sector:nth-child(3)').css('background-color'),
        ],

        // Sector width
        // TODO: refactoring
        sectorWidth = [
          $('.gauge .sector:nth-child(1)').attr('sector-width'),
          $('.gauge .sector:nth-child(2)').attr('sector-width'),
          $('.gauge .sector:nth-child(3)').attr('sector-width'),
        ];

      // First thing before rendering
      // we should to know is high DPI screen or not
      _ratinaScreenReSize(canvas);

      // Draw arc
      // Set line width. Default: `DEFAULT_LINE_WIDTH`
      context.lineWidth = _getAttr('lineWidth') || DEFAULT_LINE_WIDTH;

      // TODO: sector.length refactoring
      // First sector
      context.beginPath();
      context.arc(x, y, radius, startAngle, sectorWidth[0] * Math.PI, counterClockwise);
      context.strokeStyle = sectorBackgroundColor[0];
      context.stroke();

      // Second
      context.beginPath();
      context.arc(x, y, radius, sectorWidth[0] * Math.PI, sectorWidth[1] * Math.PI, counterClockwise);
      context.strokeStyle = sectorBackgroundColor[1];
      context.stroke();

      // Third sector
      context.beginPath();
      context.arc(x, y, radius, sectorWidth[1] * Math.PI, endAngle, counterClockwise);
      context.strokeStyle = sectorBackgroundColor[2];
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
        arrowWidth = $('.gauge .arrow').css('width').replace('px', '') || DEFAULT_ARROW_WIDTH,

        // Get arrow width from attribute. Default: `DEFAULT_ARROW_COLOR`
        arrowColor = $('.gauge .arrow').css('background-color') || DEFAULT_ARROW_COLOR,

        // Get radius. Default: `DEFAULT_RADIUS`
        radius = _getAttr('radius') || DEFAULT_RADIUS,

        // Circle radius. Default: `DEFAULT_ARROW_CIRCLE_RADIUS`
        circleRadius = $('.gauge .arrow-circle').css('width').replace('px', '') || DEFAULT_ARROW_CIRCLE_RADIUS,

        // Circle color
        circleBackgroudColor = $('.gauge .arrow .arrow-circle').css('background-color') || DEFAULT_ARROW_COLOR,

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

        newValue = 0;

      // Data for rendering
      newValue = max / value;
      step = (arrowEndAngle / max) + arrowStartAngle;
      angle = 2 / newValue;

      // Set fill color
      context.fillStyle = arrowColor;

      context.save();
      context.beginPath();
      context.translate(canvas.width / 2, canvas.height / 2);

      var step_ = 0.160 * +_getAttr('step');
      angle = ((10 / max * step_) * value / _getAttr('step')) + 0.20;

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
      context.fillStyle = circleBackgroudColor;
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
        tickSize = $('.gauge .tick').css('height').replace('px', '') || DEFAULT_TICK_HEIGHT,
        // Color
        tickColor = $('.gauge .tick').css('color') || DEFAULT_TICK_COLOR,
        // Radius
        radius = +_getAttr('radius'),
        // Step
        step = +_getAttr('step'),
        max = +_getAttr('max'),

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
        tickTextColor = $('.gauge').css('color') || DEFAULT_TICK_TEXT_COLOR,
        // ...font size...

        tickTextSize = $('.gauge').css('font-size') || DEFAULT_TICK_TEXT_SIZE,
        // ...and font name
        tickTextFont = $('.gauge').css('font-family') || DEFAULT_TICK_TEXT_FONT;

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
        context.font = tickTextSize + ' ' + tickTextFont;
        context.fillStyle = tickTextColor;

        // Tick text X and Y pos
        tickTextX = (canvas.width / 2 - (radius + 10)) + (radius - (Math.cos(tickRadius) * (radius + 20)));
        tickTextY = (canvas.height / 2 - (radius - 10)) + (radius - (Math.sin(tickRadius) * (radius + 20)));

        // Render text
        context.fillText(tickNum, tickTextX, tickTextY);
        tickNum += step;
      }
    };

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
      _createGaugeElements($(this));
      draw($(this));
      gaugeWatch();
    });
  });

}());