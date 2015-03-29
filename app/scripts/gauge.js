/* jshint devel:true */

$.fn.gauge = (function(params) {

  var draw = function($elem) {

    var _createCanvas = function() {
      $('.gauge').html('<canvas id="myCanvas" width="578" height="250"></canvas>')
    };

    _createCanvas();

    var _getAttr = function(attribute) {
      return $elem.attr('gauge-' + attribute);
    };

    var
      value = _getAttr('value'),
      min = _getAttr('min'),
      max = _getAttr('max'),
      step = _getAttr('step') || 1,

      canvas = document.getElementById('myCanvas'),
      context = canvas.getContext('2d'),

      x = canvas.width / 2,
      y = canvas.height / 2,

      radius = _getAttr('radius'),

      startAngle = _getAttr('startAngle') * Math.PI || (0.7 * Math.PI),
      endAngle = _getAttr('endAngle') * Math.PI || (2.3 * Math.PI),

      counterClockwise = false;

    var limitTo = 50;
    var s = 0;
    // if (limitTo <= 50) {
    //   s = (+_getAttr('startAngle') + +_getAttr('endAngle')) / 100;
    // } else {
    //   s = +_getAttr('endAngle') / 100;
    // }

    s = +_getAttr('endAngle') / 100;
    
    // console.log('s:' + s);
    console.log('s:' + s);

    var sector = s * limitTo;
    console.log('sector:' + sector);

    var l1 = sector;

    context.beginPath();
    context.arc(x, y, radius, startAngle, l1 * Math.PI, counterClockwise);
    context.lineWidth = _getAttr('lineWidth') || 5;
    context.strokeStyle = "black";

    context.stroke();

    context.beginPath();
    context.arc(x, y, radius, l1 * Math.PI, endAngle, counterClockwise);
    context.lineWidth = _getAttr('lineWidth') || 15;
    context.strokeStyle = "red";
    context.stroke();

  }

  $(window).load(function() {
    $('.gauge').each(function() {
      draw($(this));
    });
  });

}());