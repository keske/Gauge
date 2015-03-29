/* jshint devel:true */

$.fn.gauge = (function() {

  var draw = function($elem) {

    var _createCanvas = function() {
      $('.gauge').html('<canvas id="myCanvas" width="578" height="250"></canvas>')
    };

    var _getAttr = function(attribute) {
      return $elem.attr('gauge-' + attribute);
    };

    var _drawArc = function() {
      var
        canvas = document.getElementById('myCanvas'),
        context = canvas.getContext('2d'),

        x = canvas.width / 2,
        y = canvas.height / 2,

        radius = _getAttr('radius'),

        startAngle = +_getAttr('startAngle') * Math.PI || (0.7 * Math.PI),
        endAngle = +_getAttr('endAngle') * Math.PI || (2.3 * Math.PI),

        counterClockwise = false,

        // Atribute params to JSON
        sectors = eval(_getAttr('sectors'));

      // Draw arc
      // Set line width. Default: 15
      context.lineWidth = _getAttr('lineWidth') || 15;

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
      context.arc(x, y, radius, sectors[1].limitTo * Math.PI, sectors[2].limitTo * Math.PI, counterClockwise);
      context.strokeStyle = sectors[2].color;
      context.stroke();
    };

    function degreesToRadians(degrees) {
      return (Math.PI / 180) * degrees
    };

    var _drawArrow = function() {
      var
        canvas = document.getElementById('myCanvas'),
        context = canvas.getContext('2d'),

        // Get arrow width from attribute. Default: 10
        arrowWidth = _getAttr('arrow-width') || 10,
        
        // Get arrow width from attribute. Default: black
        arrowColor = _getAttr('arrow-color') || 10,
        
        // Get radius
        radius = _getAttr('radius'),
        
        // Current position
        angle = 0,
        
        // Arrow start angle
        arrowStartAngle = +_getAttr('startAngle'),
        
        // Arrow limit/end angle
        arrowEndAngle = +_getAttr('endAngle'),
        
        // Current value
        value = +_getAttr('value'),
        
        // Maximum value
        max = +_getAttr('max'),
        
        // Fix arrow position
        multiplier = 0,
        
        // Step for fixing position
        multiplierStep = 5,

        newValue = 0;

      multiplier = (parseFloat(_getAttr('startAngle')).toFixed(2) * 10) - 5;

      // Fix position...
      // Yeah, it's looks not cool, for MVP it's ok
      if (value < 49) {
        value = value + (multiplierStep * multiplier);
      } else if (value > 51) {
        value = value - (multiplierStep * multiplier);
      } else if (value === 50) {
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
    };

    _createCanvas();
    _drawArc();
    _drawArrow();
  }

  $(window).load(function() {
    $('.gauge').each(function() {
      draw($(this));
    });
  });

}());