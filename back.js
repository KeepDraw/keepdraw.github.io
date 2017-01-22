var count = 30,
  r = (innerWidth + innerHeight) / 40,
  vel = 1,
  circles = [],
  curvelx = 0,
  opacity = 1,
  curX = 0,
  curY = 0,
  curvely = 0;
var stage = new KeepDraw.Stage({
    width: innerWidth,
    height: 300,
    color: 'rgba(0, 50, 255, 0.5)',
    opacity: 0.5,
    canvas: 'canvas'
  }),
  grad = new KeepDraw.Gradient({
    top: innerHeight,
    left: innerWidth,
    points: [
      [0, '#30cfff'],
      [1, '#cf30ff']
    ],
    stage: stage
  });
stage.fill = grad;
for (var i = 0; i < count; i++) {
  var radius = r * ((i + 1) / count);
  var circle = new KeepDraw.Circle({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    radius: radius,
    fill: true,
    opacity: opacity / (r / radius),
    stage: stage
  });
  circle.velX = 0;
  circle.velY = 0;
  circles.push(circle);
}
parent.document.onmousemove = parent.document.ontouchmove = function(e) {
  curX = e.touches ? e.touches[0].screenX : e.clientX;
  curY = e.touches ? e.touches[0].screenY : e.clientY;
  curvelx = (innerWidth / 2 - curX) / innerWidth;
  curvely = (innerHeight / 2 - curY) / innerHeight;
  curvelx *= 0.1;
  curvely *= 0.1;
};
stage.draw = function(diff) {
  for (var i = 0; i < count; i++) {
    var obj = circles[i];
    if (KeepDraw.getIntersection(obj, curX, curY)) {
      obj.velX *= -0.9;
      obj.velY *= -0.9;
    }
    obj.velX *= 0.99;
    obj.velY *= 0.99;
    obj.velX += (obj.radius * curvelx) / 30;
    obj.velY += (obj.radius * curvely) / 30;
    obj.x += obj.velX * diff;
    obj.y += obj.velY * diff;
    if (obj.x > innerWidth + obj.radius) {
      obj.x = -obj.radius;
    }
    if (obj.x < -obj.radius) {
      obj.x = innerWidth + obj.radius;
    }
    if (obj.y > innerHeight + obj.radius) {
      obj.y = -obj.radius;
      obj.color = obj.stage.color;
    }
    if (obj.y < -obj.radius) {
      obj.y = innerHeight + obj.radius;
      obj.color = 'rgba(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', 1)';
    }
  }
};
anim = new KeepDraw.Animation(stage);
anim.stop();
setTimeout(anim.start(), 2000);
