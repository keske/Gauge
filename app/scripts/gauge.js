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
        angle = 0;

      // Set fill color
      context.fillStyle = arrowColor;

      context.save();
      context.beginPath();
      context.translate(canvas.width / 2, canvas.height / 2);

      // -3.141592653589793

      // Rotate
      // context.rotate(-180 * Math.PI / 100);
      // context.rotate(0.65);
      // context.rotate(5);

      var
        arrowStartAngle = +_getAttr('startAngle'), // - 0.5,
        arrowEndAngle = +_getAttr('endAngle'), // - 0.5,
        value = +_getAttr('value'),
        // min = _getAttr('min'),
        max = +_getAttr('max');
      // step = _getAttr('step') || 1;

      // d = 5
      // 0.5
      var multiplier = 0,
        multiplierStep = 5;

      multiplier = parseFloat(_getAttr('startAngle')).toFixed(2);
      multiplier = multiplier * 10;
      multiplier = multiplier - 5;

      if (value < 49) {
        value = value + (5 * multiplier);
      } else if (value > 51) {
        value = value - (5 * multiplier);
      } else if (value === 50) {
        value = +_getAttr('value');
      }
      var newValue = max / value;
      console.log('newValue: ' + newValue)

      // var step = 0;

      step = (arrowEndAngle / max) + arrowStartAngle;
      // angle = step * 50;
      angle = 2 / newValue;

      // console.log('step: ' + step);
      // console.log('value: ' + value);
      // console.log('max: ' + max);
      // console.log('(step * value): ' + (step * value))
      console.log('angle: ' + angle)

      // Rotate arrow
      // context.rotate(arrowStartAngle * Math.PI);
      context.rotate(angle * Math.PI);

      // context.rotate(1.8 * Math.PI);

      // context.rotate(angle * Math.PI / 180);

      // console.log(-180 * Math.PI / 180);
      // console.log(angle * Math.PI / 180);

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