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
    }

    function drawHand(ctx, canvas, length, angle, arrowWidth) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-180 * Math.PI / 180); // Correct for top left origin
      ctx.rotate(angle * Math.PI / 180);
      ctx.moveTo(-10, 0);
      ctx.lineTo(0, length);
      ctx.lineTo(10, 0);
      ctx.lineTo(-10, 0);
      // ctx.moveTo(canvas.width / 2 - +arrowWidth, canvas.height / 2);
      // ctx.lineTo(canvas.width / 2, 100);
      // ctx.lineTo(canvas.width / 2 + +arrowWidth, canvas.height / 2);
      // ctx.stroke();
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    var _drawArrow = function() {
      var
        canvas = document.getElementById('myCanvas'),
        context = canvas.getContext('2d'),
        // Get arrow width from attribute. Default: 10
        arrowWidth = _getAttr('arrow-width') || 10,
        // Get arrow width from attribute. Default: black
        arrowColor = _getAttr('arrow-color') || 10;

      var seconds = -84;
      context.strokeStyle = "red";
      context.lineWidth = 1;
      drawHand(context, canvas, 75, -145, arrowWidth);

      // context.fillStyle = arrowColor;
      // context.beginPath();
      // context.moveTo(canvas.width / 2 - +arrowWidth, canvas.height / 2);
      // context.lineTo(canvas.width / 2, 100);
      // context.lineTo(canvas.width / 2 + +arrowWidth, canvas.height / 2);
      // context.closePath();
      // context.fill();
      // context.restore();
    };

    var
      value = _getAttr('value'),
      min = _getAttr('min'),
      max = _getAttr('max'),
      step = _getAttr('step') || 1;

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