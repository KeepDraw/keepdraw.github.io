 var date = new Date();
    var time, lastTime = date.getTime();
    window.setAnimation = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.	mozRequestAnimationFrame || function(callback) {
          return setTimeout(callback, 20);
        };
    })();
    window.clearAnimation = (function() {
      return window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame ||
        function(id) {
          clearTimeout(id);
        };
    })();
    var KeepDraw = {
      Animation: function(arg) {
        this.enabled = false;
        var core;
        if (arg.draw) {
          var start = this.start = function() {
            var date = new Date();
            var time = date.getTime();
            var diff = (this.enabled) ? (time - lastTime) / 20 : 0;
            KeepDraw.Utils.draw(arg);
            this.enabled = true;
            lastTime = time;
            arg.draw(diff);
            core = this.core = setAnimation(start);
          };
          this.start();
          this.stop = function() {
            this.enabled = false;
            clearAnimation(core);
          };
        }
      },
      Utils: {
        draw: function(arg) {
            if (arg.fill) {
            arg.ctx.fillStyle = arg.fill.grd || arg.fill;
            arg.ctx.fillRect(0, 0, arg.width, arg.height);
            }
            else arg.ctx.clearRect(0, 0, arg.width, arg.height);
          for (var i = 0; i < arg.childs.length; i++) {
            if (arg.childs[i]) arg.childs[i].draw(arg.childs[i]);
          }
        },
            lineDraw: function(arg, point) {
                arg.stage.ctx.save();
            var seg = arg._segments || arg.segments;
            KeepDraw.Utils.setStyle(arg);
            arg.stage.ctx.beginPath();
            if (!arg.x) arg.x = 0;
            if (!arg.y) arg.y = 0;
            arg.stage.ctx.translate(arg._x || arg.x, arg._y || arg.y);
	    arg.stage.ctx.lineTo(seg[0][0] + 0.5, seg[0][1] + 0.5);
            for (var i = 1; i < seg.length; i++) {
              if (seg[i - 1][5]) {
                arg.stage.ctx.bezierCurveTo((seg[i-1][2] + 0.5) >> 0, (seg[i-1][3] + 0.5) >> 0, (seg[i-1][4] + 0.5) >> 0, seg[i - 1][5], (seg[i][0] + 0.5) >> 0, (seg[i][1] + 0.5) >> 0);
              } else if (seg[i - 1][3]) {
                arg.stage.ctx.quadraticCurveTo((seg[i-1][2] + 0.5) >> 0, (seg[i-1][3] + 0.5) >> 0, seg[i][0], (seg[i][1] + 0.5) >> 0);
              } else {
                arg.stage.ctx.lineTo((seg[i][0] + 0.5) >> 0, (seg[i][1] + 0.5) >> 0);
              }
            }
            if (arg.closed) {
              arg.stage.ctx.closePath();
            }
if (point)  var inter = arg.stage.ctx.isPointInPath(point[0], point[1]);
           KeepDraw.Utils.drawPath(arg, this.path),
            arg.stage.ctx.restore();
if (point) return inter;
          },
        drawPath: function(arg) {
          if (arg.fill || arg.color) arg.stage.ctx.fill();
          if (arg.strokeColor || arg.strokeWidth || arg.stroke) arg.stage.ctx.stroke();
	if (arg.image && arg.image.src) {
	arg.image.image.src = arg.image.src || !1;
	var img = arg.image;
	if (!img.outside) arg.stage.ctx.clip();
	 arg.stage.ctx.drawImage(arg.image.image, img.x, img.y, img.width, img.height);
        }},
        copy: function(obj) {
          var copy = {};
          for (var k in obj) {
            copy[k] = obj[k];
          }
          return copy;
        },
        percent: function(arg) {
          return arg.split('%')[0] * 1;
        },
        copyArray: function(obj) {
          var copy = JSON.parse(JSON.stringify(obj));
          return copy;
        },
        setStyle: function(arg) {
		arg.stage.ctx.shadowBlur = arg.shadowWidth || arg.stage.shadowWidth;
		arg.stage.ctx.shadowColor = arg.shadowColor || arg.stage.shadowColor;
		arg.stage.ctx.shadowOffsetX = arg.shadowX || arg.stage.shadowX;
		arg.stage.ctx.shadowOffsetY = arg.shadowY || arg.stage.shadowY;
          arg.stage.ctx.lineWidth = arg.strokeWidth || arg.stage.strokeWidth;
          arg.stage.ctx.strokeStyle = arg.strokeColor || arg.stage.strokeColor;
          arg.stage.ctx.globalAlpha = (arg.opacity <= 0) ? 0 : arg.opacity || arg.stage.opacity || 1;
          arg.stage.ctx.fillStyle = (arg.color) ? arg.color.grd || arg.color : arg.stage.color.grd || arg.stage.color;
          arg.stage.ctx.lineCap = arg.lineCap || arg.stage.lineCap;
          arg.stage.ctx.lineJoin = arg.lineJoin || arg.stage.lineJoin;
          arg.x = arg.x || 0;
          arg.y = arg.y || 0;
          arg.stage.ctx.font = (arg.fontWidth || 48) + 'px ' + (arg.font || 'serif');
          return arg;
        },
        setFuncs: function(obj) {
          var seg = obj._segments || obj.segments;
          obj.rotate = function(deg) {
            deg = deg * Math.PI / 180;
            for (var i = 0; i < seg.length; i++) {
              var x = seg[i][0] * Math.cos(deg) - seg[i][1] * Math.sin(deg);
              var y = seg[i][0] * Math.sin(deg) + seg[i][1] * Math.cos(deg);
              seg[i][0] = x, seg[i][1] = y;
              if (seg[i][3]) {
				var x = seg[i][2] * Math.cos(deg) - seg[i][3] * Math.sin(deg);
              var y = seg[i][2] * Math.sin(deg) + seg[i][3] * Math.cos(deg);
              seg[i][2] = x, seg[i][3] = y;
			  }
			                if (seg[i][5]) {
				var x = seg[i][4] * Math.cos(deg) - seg[i][5] * Math.sin(deg);
              var y = seg[i][4] * Math.sin(deg) + seg[i][5] * Math.cos(deg);
              seg[i][4] = x, seg[i][5] = y;
			  }
            }
          };
          obj.setAttrs = function(attrs) {
            for (var key in attrs) {
              obj[key] = attrs[key];
            }
          };
          obj.smooth = function(power) {
              var seg = obj.segments;
              var pow = (power) ? ((power > 0) ? 2 : -2) + power / 2 : 2.3;
              if (seg.length > 2) for (var i = 0; i < seg.length; i++) {
                  var im = (i < 1) ? seg[seg.length-2] : seg[i-1];
                  var ib = (i > seg.length - 2) ? seg[1] : seg[i+1];
				im[4] = ((ib[0] + seg[i][0]) / 2 + (seg[i][0] + (seg[i][0] - ib[0]) * pow + ib[0]) / 2)  /  2,
				im[5] = ((ib[1] + seg[i][1]) / 2 + (seg[i][1] + (seg[i][1] - ib[1]) * pow + ib[1]) / 2) / 2;
				seg[i][2] = ((im[0] + seg[i][0]) / 2 + (seg[i][0] + (seg[i][0] - im[0]) * pow + im[0]) / 2) /  2;
				seg[i][3] = ((im[1] + seg[i][1]) / 2 + (seg[i][1] + (seg[i][1] - im[1]) * pow + im[1]) / 2) / 2;
			}
			obj.segments = seg;
          };
          obj.simplify = function(age) {
            var seg = [];
            for (var i = 0; i < obj.segments.length; i += 1 + age) {
              seg.push(obj.segments[i]);
            }
            obj.segments = seg;
          };
	 obj.remove = function(arg) {
          if (arg.stage) {
            arg.stage.childs.splice(obj.index, 1);
          }
	    for (var i = 0; i < obj.events; i++) {
			obj.events[i] = function() {};
		}
        },
          obj.floor = function() {
                          var segs = [];
            for (var i = 0; i < obj.segments.length; i++) {
                var seg = obj.segments[i],
                seg2 = [];
                for (var e = 0; e < seg.length; e++) seg2.push(seg[e] >> 0.5);
				segs.push(seg2);
            }
            obj.segments = segs;
            };
          obj.wind = function(power1, power2) {
            var seg2 = [];
            for (var i = 0, j = 1; j < seg.length; j++, i++) {
              var seg3 = [(seg[i][0] + seg[j][0]) / 2 + power1, (seg[i][1] + seg[j][1]) / 2 + power2];
              seg2.push([seg[i][0], seg[i][1]], seg3, [seg[j][0], seg[j][1]]);
            }
            obj._segments = seg2;
          };

          obj.star = function() {
            var seg2 = [];
            for (var i = 0, j = 1; j < seg.length; j++, i++) {
              var seg3 = [(seg[i][0] + seg[j][0]) / 3, (seg[i][1] + seg[j][1]) / 3];
              seg2.push([seg[i][0], seg[i][1]], seg3, [seg[j][0], seg[j][1]]);
            }
            obj.segments = seg2;
          };
          obj.clone = function() {
            var a = KeepDraw.Utils.copy(obj);
            var b = new obj.cons(a);
            return b;
          };
          obj.reflect = function(w, h) {
            var seg2 = [];
            for (var i = 0; i < seg.length; i++) {
              seg2.push([(w) ? seg[i][0] * -1 : seg[i][0], (h) ? seg[i][1] * -1 : seg[i][1]]);
            }
            obj.segments = seg2;
          };
	obj.endPoints = function() {
	var top = [0, 0], left = [0, 0], right = [0, 0], bottom = [0, 0];
	for (var i = 0; i < seg.length; i++) {
	if (seg[i][0] < left[0]) left = seg[i];
	if (seg[i][1] < top[1]) top = seg[i];
	if (seg[i][1] > bottom[1]) bottom = seg[i];
	if (seg[i][0] > right[0]) right = seg[i];
	}
	return [top, bottom, left, right];
};
obj.inScreen = function() {
  if ((obj._x || obj.x) > 0 && (obj._x || obj.x) < innerWidth && (obj._y || obj.y) > 0 && (obj._y || obj.y) < innerHeight) return true;
  else return false;
};
obj.inDistance = function(minX, minY, maxX, maxY) {
  if (obj.x > minX && obj.x < maxX && obj.y > minY && obj.y < maxY) return true;
  else return false;
};
if (obj.group) {
	obj.group.childs.push(obj);
}
        }
      },
      Stage: function(arg) {
        var canvas = this.canvas = document.getElementById(arg.canvas);
        this.width = this.canvas.width = arg.width;
        this.height = this.canvas.height = arg.height;
        this.ctx = canvas.getContext('2d');
        this.ctx.lineWidth = this.strokeWidth = arg.strokeWidth || 1;
        this.ctx.strokeStyle = this.strokeColor = arg.strokeColor || '#000000';
        this.ctx.globalAlpha = this.opacity = arg.opacity || 1;
        this.ctx.fillStyle = this.color = arg.color || '#000000';
        this.ctx.lineCap = this.lineCap = arg.lineCap || 'butt';
        this.ctx.lineJoin = this.lineJoin = arg.lineJoin || 'miter';
        this.childs = [];
        var childs = this.childs;
        this.setIndex = function() {
          var c = childs.length;
          for (var i = 0; i < c; i++) {
            childs[i].index = i;
          }
        };
        var events = this.events = {
          click: [],
          dblclick: [],
          mousedown: [],
          mousemove: [],
          mouseup: [],
          contextmenu: [],
          ontouchstart: [],
          ontouchmove: [],
          ontouchend: [],
          ontouchcancel: []
        };
        for (var key in events) {
          this.canvas.addEventListener(key, function(e) {
            for (var i = 0; i < events[e.type].length; i++) {
              if (KeepDraw.getIntersection(events[e.type][i], e.clientX, e.clientY)) {
                events[e.type][i].on(e.type)(e, events[e.type][i]);
              }
            }
          }, false);
        }
        this.cons = KeepDraw.Stage;
        this.add = function(arg) {
          arg.stage = this;
          arg.cons(arg);
        };
        this.init = function() {
          var canvas = this.canvas = document.getElementById(arg.canvas);
          this.ctx = canvas.getContext('2d');
        };
      },
      Line: function(arg) {
        var events = this.events = {};
        this.on = function(e, func) {
          if (func) {
            events[e] = func;
            arg.stage.events[e].push(this);
          }
          return events[e];
        };
        this.off = function(e) {
          delete events(e);
        };
        for (var key in arg) this[key] = arg[key];
        if (arg.stage) {
          this.draw = KeepDraw.Utils.lineDraw;
          this.draw(arg);
        }
        this.cons = KeepDraw.Line;
        if (arg.stage) {
          this.index = arg.stage.childs.length;
          arg.stage.childs.push(this);
        }
        this.resize = function(w, h) {
          var seg = this.segments;
          for (var i = 0; i < seg.length; i++) {
            seg[i][0] = seg[i][0] * w;
            seg[i][1] = seg[i][1] * h;
          }
        };
        KeepDraw.Utils.setFuncs(this);
      },
      Rect: function(arg) {
        var events = this.events = {};
        this.on = function(e, func) {
          if (func) {
            events[e] = func;
            arg.stage.events[e].push(this);
          }
          return events[e];
        };
        this.off = function(e) {
          delete events(e);
        };
for (var key in arg) this[key] = arg[key];
        if (arg.stage) {
          this.draw = function(arg, point) {
              arg.stage.ctx.save();
            if (!arg.x) arg.x = 0;
            if (!arg.y) arg.y = 0;
	if (arg.segments) {
	arg.width = arg.segments[1][0] - arg.segments[0][0];
	arg.height = arg.segments[1][1] - arg.segments[0][1];
	}
            arg._segments = [
              [0, 0],
              [arg.width, 0],
              [arg.width, arg.height],
              [0, arg.height],
              [0, 0],
              [arg.width, 0]
            ];
            KeepDraw.Utils.setStyle(arg);
            arg.stage.ctx.beginPath();
            arg.stage.ctx.translate((arg._x  || arg.x) + ((arg.segments) ? arg.segments[0][0] : 0), (arg._y || arg.y) +((arg.segments) ? arg.segments[0][1] : 0));
            for (var i = 0; i < arg._segments.length; i++) {
              arg.stage.ctx.lineTo(arg._segments[i][0] + 0.5, arg._segments[i][1] + 0.5);
            }
            if (arg.closed) {
              arg.stage.ctx.closePath();
            }
if (point)  var inter = arg.stage.ctx.isPointInPath(point[0], point[1]);
           KeepDraw.Utils.drawPath(arg, this.path),
            arg.stage.ctx.restore();
if (point) return inter;
          };
          this.draw(arg);
        }
        this.cons = KeepDraw.Line;
        if (arg.stage) {
          this.index = arg.stage.childs.length;
          arg.stage.childs.push(this);
        }
        KeepDraw.Utils.setFuncs(this);
      },

      Group: function(arg) {
        var childs = this.childs = arg.childs || [];
        var attrs = this.attrs = arg.attrs || {};
        this.attrs.x = attrs.x || 0;
        this.attrs.y = attrs.y || 0;
        this.attrs._x = attrs._x || 0;
        this.attrs._y = attrs._y || 0;
        this.cons = KeepDraw.Group;
        this.addChild = function(arg) {
          childs.push(this);
          for (var key in attrs) {
            arg.attrs[key] = attrs[key];
          }
        };
        this.addChilds = function(arg) {
          for (var i = 0; i < arg.length; i++) {
            childs.push(arg[i]);
            for (var key in attrs) {
              arg[i].attrs[key] = attrs[key];
            }
          }
        };
        if (arg.stage) {
          this.draw = function() {
            var attrs = this.attrs;
            for (var i = 0; i < childs.length; i++) {
              for (var key in attrs) {
                if (key == 'x' || 'y') {
                  childs[i]['_' + key] = attrs[key] + childs[i][key] + attrs['_' + key];
                } else {
                  childs[i][key] = attrs[key];
                }
              }
            }
          };
          this.attrs.index = arg.stage.childs.length;
          arg.stage.childs.push(this);
          this.draw();
        }
      },
      Circle: function(arg) {
        var events = this.events = {};
        this.on = function(e, func) {
          if (func) {
            events[e] = func;
            arg.stage.events[e].push(this);
          }
          return events[e];
        };
        this.off = function(e) {
          delete events(e);
        };
        this.cons = KeepDraw.Circle;
for (var key in arg) this[key] = arg[key];
        if (arg.stage) {
          this.draw = function(arg, point) {
		if (arg.segments) arg.radius = Math.sqrt(Math.pow(arg.segments[1][0] - arg.segments[0][0], 2) + Math.pow(arg.segments[1][1] - arg.segments[0][1], 2));
              arg.stage.ctx.save();
            KeepDraw.Utils.setStyle(arg);
            arg.stage.ctx.beginPath();
            arg.stage.ctx.translate((arg._x || arg.x) + ((arg.segments) ? arg.segments[0][0] : 0), ( arg._y || arg.y) + ((arg.segments) ? arg.segments[0][1] : 0));
	    arg.stage.ctx.arc(0, 0, (0.5 + arg.radius)>>0, 0, Math.PI * 2);
            arg.stage.ctx.closePath();
if (point)  var inter = arg.stage.ctx.isPointInPath(point[0], point[1]);
           KeepDraw.Utils.drawPath(arg, this.path),
            arg.stage.ctx.restore();
if (point) return inter;
          };
        }
        this.draw(arg);
        if (arg.stage) {
          this.index = arg.stage.childs.length;
          arg.stage.childs.push(this);
        }
        KeepDraw.Utils.setFuncs(this);
      },
             Polygon: function(arg) {
        var events = this.events = {};
        this.on = function(e, func) {
          if (func) {
            events[e] = func;
            arg.stage.events[e].push(this);
          }
          return events[e];
        };
        this.off = function(e) {
          delete events(e);
        };
        arg._segments = [];
                if (arg.sides < 3) arg.sides = 3;
        var a = (Math.PI * 2) / arg.sides;
        for (var i = 0; i < arg.sides; i++) {
          var j = [arg.radius * Math.cos(a * i), arg.radius * Math.sin(a * i)];
          arg._segments.push([j[0], j[1]]);
        }
                arg._segments.push([arg._segments[0][0], arg._segments[0][1]]);
        for (var key in arg) this[key] = arg[key];
        if (arg.stage) {
          this.draw  = function draw(arg, point) {
        var seg = [];
	if (arg.segments) arg.radius = Math.sqrt(Math.pow(arg.segments[1][0] - arg.segments[0][0], 2) + Math.pow(arg.segments[1][1] - arg.segments[0][1], 2));
                if (arg.sides < 3) arg.sides = 3;
        var a = (Math.PI * 2) / arg.sides;
        for (var i = 0; i < arg.sides; i++) {
          var j = [arg.radius * Math.cos(a * i), arg.radius * Math.sin(a * i)];
          seg.push([j[0], j[1]]);
        }
                seg.push([seg[0][0], seg[0][1]]);
            deg = Math.atan2(arg.segments[1][1] - seg[0][1] - arg.segments[0][1], arg.segments[1][0] - seg[0][0] - arg.segments[0][0]) * 2  + (Math.PI) / arg.sides;
            for (var i = 0; i < seg.length; i++) {
              var x = seg[i][0] * Math.cos(deg) - seg[i][1] * Math.sin(deg);
              var y = seg[i][0] * Math.sin(deg) + seg[i][1] * Math.cos(deg);
              seg[i][0] = x, seg[i][1] = y;
              if (seg[i][3]) {
				var x = seg[i][2] * Math.cos(deg) - seg[i][3] * Math.sin(deg);
              var y = seg[i][2] * Math.sin(deg) + seg[i][3] * Math.cos(deg);
              seg[i][2] = x, seg[i][3] = y;
			  }
			                if (seg[i][5]) {
				var x = seg[i][4] * Math.cos(deg) - seg[i][5] * Math.sin(deg);
              var y = seg[i][4] * Math.sin(deg) + seg[i][5] * Math.cos(deg);
              seg[i][4] = x, seg[i][5] = y;
			  }
            }
arg._segments = seg;
                arg.stage.ctx.save();
            var seg = arg._segments;
            KeepDraw.Utils.setStyle(arg);
            arg.stage.ctx.beginPath();
            arg.stage.ctx.translate((arg._x || arg.x) + arg.segments[0][0], (arg._y || arg.y) + arg.segments[0][1]);
	    arg.stage.ctx.lineTo(seg[0][0] + 0.5, seg[0][1] + 0.5);
            for (var i = 1; i < seg.length; i++) {
              if (seg[i - 1][5]) {
                arg.stage.ctx.bezierCurveTo((seg[i-1][2] + 0.5) >> 0, (seg[i-1][3] + 0.5) >> 0, (seg[i-1][4] + 0.5) >> 0, seg[i - 1][5], (seg[i][0] + 0.5) >> 0, (seg[i][1] + 0.5) >> 0);
              } else if (seg[i - 1][3]) {
                arg.stage.ctx.quadraticCurveTo((seg[i-1][2] + 0.5) >> 0, (seg[i-1][3] + 0.5) >> 0, seg[i][0], (seg[i][1] + 0.5) >> 0);
              } else {
                arg.stage.ctx.lineTo((seg[i][0] + 0.5) >> 0, (seg[i][1] + 0.5) >> 0);
              }
            }
            if (arg.closed) {
              arg.stage.ctx.closePath();
            }
if (point)  var inter = arg.stage.ctx.isPointInPath(point[0], point[1]);
           KeepDraw.Utils.drawPath(arg, this.path),
            arg.stage.ctx.restore();
if (point) return inter;
}
        if (arg.stage) {
          this.index = arg.stage.childs.length;
          arg.stage.childs.push(this);
        }
        KeepDraw.Utils.setFuncs(this);
          this.draw(this);
        }
        this.cons = KeepDraw.Line;
        this.resize = function(w, h) {
          var seg = this.segments;
          for (var i = 0; i < seg.length; i++) {
            seg[i][0] = seg[i][0] * w;
            seg[i][1] = seg[i][1] * h;
          }
        };
      },
      Text: function(arg) {
        if (arg.stage) {
          this.draw = function(arg) {
            KeepDraw.Utils.setStyle(arg);
            if (arg.stroke) arg.stage.ctx.strokeText(arg.text, arg._x || arg.x, arg._y || arg.y);
            if (arg.fill) arg.stage.ctx.fillText(arg.text, arg._x || arg.x, arg._y || arg.y);
            if (arg.color) arg.stage.ctx.fillText(arg.text, arg._x || arg.x, arg._y || arg.y);
            if (!arg.fill)
              if (!arg.stroke) arg.stage.ctx.fillText(arg.text, arg._x || arg.x, arg._y || arg.y);
          };
        }
        this.cons = KeepDraw.Text;
        for (var key in arg) this[key] = arg[key];
        if (arg.stage) {
          this.index = arg.stage.childs.length;
          arg.stage.childs.push(this);
        }
        KeepDraw.Utils.setFuncs(this);
      },
      getIntersection: function(obj, x, y) {
		return obj.draw(obj, [x, y]);
      },
      intersection: function(obj1, obj2) {
        var res = [];
        var p1 = convert(obj1._segments || obj1.segments);
        var p2 = convert(obj2._segments || obj2.segments);
        var x1 = obj1._x || obj1.x;
        var y1 = obj1._y || obj1.y;
        var x2 = obj2._x || obj2.x;
        var y2 = obj2._y || obj2.y;

        function convert(p) {
          var points = [];
          for (var i = 0; i < p.length; i++) {
            if (p[i][5]) {
              points.push([p[i][0], p[i][1]], [p[i][2], p[i][3], p[i][4], p[i][5]]);
            } else if (p[i][3]) {
              points.push([p[i][0], p[i][1]], [p[i][2], p[i][3]]);
            } else {
              points.push([p[i][0], p[i][1]]);
            }
          }
          return points;
        }

        function polyPoly(a1, a2, p2, res) {
          var x2 = obj2._x || obj2.x;
          var y2 = obj2._y || obj2.y;
          for (var i = 0; i < p2.length - 1; i++) {
            var b1 = [p2[i][0] + x2, p2[i][1] + y2];
            var b2 = [p2[i + 1][0] + x2, p2[i + 1][1] + y2];
            var ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
            var ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
            var u_b = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

            if (u_b != 0) {
              var ua = ua_t / u_b;
              var ub = ub_t / u_b;

              if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                res.push([
                  a1[0] + ua * (a2[0] - a1[0]),
                  a1[1] + ua * (a2[1] - a1[1])
                ]);
              }
            }
          }
        }
        function lerp(obj1, obj2, obj3) {
          return [obj1[0] + (obj2[0] - obj1[0]) * obj3, obj1[1] + (obj2[1] - obj1[1]) * obj3];
        }
        function circlePoly(result, c, r, a1, a2) {
          var a = (a2[0] - a1[0]) * (a2[0] - a1[0]) +
            (a2[1] - a1[1]) * (a2[1] - a1[1]);
          var b = 2 * ((a2[0] - a1[0]) * (a1[0] - c[0]) +
            (a2[1] - a1[1]) * (a1[1] - c[1]));
          var cc = c[0] * c[0] + c[1] * c[1] + a1[0] * a1[0] + a1[1] * a1[1] -
            2 * (c[0] * a1[0] + c[1] * a1[1]) - r * r;
          var deter = b * b - 4 * a * cc;

          if (deter > 0) {
            var e = Math.sqrt(deter);
            var u1 = (-b + e) / (2 * a);
            var u2 = (-b - e) / (2 * a);
            if (!((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1))) {

              if (0 <= u1 && u1 <= 1)
                result.push(lerp(a1, a2, u1));

              if (0 <= u2 && u2 <= 1)
                result.push(lerp(a1, a2, u2));
            }
          }
        }
        if (obj1.cons == KeepDraw.Group) {
          for (var i = 0; i < obj1.childs; i++) {
            intersect(obj1.childs[i], obj2, res);
          }
        } else {
          intersect(obj1, obj2, res);
        }

        function intersect(obj1, obj2, res) {
          var strokeWidth = ((obj1.strokeWidth / 2) || 0) + ((obj2.strokeWidth / 2) || 0);
          if (obj1.cons == KeepDraw.Circle && obj2.cons == KeepDraw.Circle) {
            var dx = (obj1._x || obj1.x) - (obj2._x || obj2.x);
            var dy = (obj1._y || obj1.y) - (obj2._y || obj2.y);
            var distance = Math.sqrt(dx * dx + dy * dy);
            res[0] = (distance < obj1.radius + obj2.radius + strokeWidth) ? true : false;
            res[1] = distance;
          } else if (obj1.cons == KeepDraw.Circle) {
            convert(p2);
            res[0] = false;
            var c = (obj1.segments) ? [x1 + p1[0][0], y1 + p1[0][1]] : [x1, y1];
            var r = (obj1.radius + strokeWidth);
            var result = [];
            for (var i = 0; i < p2.length - 1; i++) {
              var a1 = [p2[i][0] + x2, p2[i][1] + y2];
              var a2 = [p2[i + 1][0] + x2, p2[i + 1][1] + y2];
              circlePoly(result, c, r, a1, a2);
            }
            if (result.length > 0) res[0] = true;

            res.push(result);
          } else {
            var points = [];
            var result;
            for (var i = 0; i < p1.length - 1; i++) {
              var a1 = [p1[i][0] + x1, p1[i][1] + y1];
              var a2 = [p1[i + 1][0] + x1, p1[i + 1][1] + y1];
              polyPoly(a1, a2, p2, res);
            }
          }
        }
        return res;
      },
      clone: function(arg) {
        var a = KeepDraw.Utils.copy(arg);
        var b = new arg.cons(a);
        return b;
      },
      Gradient: function(arg) {
          grd = this;
          this.init = function() {
         grd.grd =  arg.stage.ctx.createLinearGradient(arg.x || 0, arg.y || 0, arg.left || 0, arg.top || 0);
          for (var i = 0; i < arg.points.length; i++) {
              var p = arg.points[i];
              p[0] = (p[0] < 0) ? 0 : (p[0] > 1) ? 1 : p[0];
              p[1] = (p[1] < 0) ? 0 : (p[1] > 1) ? 1 : p[1];
              grd.grd.addColorStop(p[0], p[1]);
              }
			  };
			for (var key in arg) this[key] = arg[key];
              this.init();
          },
	Image: function(arg) {
	for (var key in arg) this[key] = arg[key];
	this.x = arg.x || 0;
	this.y = arg.y || 0;
	this.image = new Image();
	this.image.src = arg.src || !1;
	this.image.onload = arg.onload;
	},
      Tween: function(obj, arg) {
        this.end = arg.end;
        this.age = arg.age;
                       this.index = obj.stage.childs.length;
     obj.stage.childs.push(this);
        for (var key in arg) this[key] = arg[key];
        this.obj = obj;
        var steps = {},
        attr = KeepDraw.Utils.copy(obj),
        draw = function() {};
        this.draw = function(arg) {
            draw(arg)
            };
        this.play = function() {
          obj.animated = true;
          var start = Date.now(),
          old = Date.now();
          for (var key in arg.attrs) {
            steps[key] = obj[key] - arg.attrs[key];
          }
          draw = function(arg) {
              var now = Date.now();
              if (now - start >= arg.end) {
            obj.animated = false;
            for (var key in arg.attrs) {
              obj[key] = arg.attrs[key];
            }
            if (arg.onfinish) {
              arg.onfinish();
            }
                    draw = function() {};
            return;
  }
            for (var key in arg.attrs) {
              obj[key] -= steps[key] / (arg.end / (now - old));
           }
           old = Date.now();
          }
        };
      }
    };
