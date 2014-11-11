var View           = require('famous/core/View');
var Surface        = require('famous/core/Surface');
var Transform      = require('famous/core/Transform');
var Modifier       = require('famous/core/Modifier');
var Transitionable = require('famous/transitions/Transitionable');
var SpringTransition = require('famous/transitions/SpringTransition');
var Easing = require('famous/transitions/Easing');
var StateModifier  = require('famous/modifiers/StateModifier');
var Circle         = require('famous/physics/bodies/Circle');
var Particle         = require('famous/physics/bodies/Particle');
var Vector         = require('famous/math/Vector');
var EventEmitter   = require('famous/core/EventEmitter');
var RotationalSpring = require('famous/physics/forces/RotationalSpring');
var Quaternion = require('famous/math/Quaternion');


function Ripple() {
    View.apply(this, arguments);

    this._rippleScaleTransitionable = new Transitionable(0);

    this._rippleSurface = new Surface({
      size : [500, 500],
      properties : this.options.properties,
      classes : ['backface']
    });

    this._rippleModifier = new Modifier({
      origin: [0.5, 0.5],
      transform: function() {
        var scale = this._rippleScaleTransitionable.get();
        var t = Transform.translate(this.options.x, this.options.y, 0);
        var s = Transform.scale(scale, scale, 1);
        return Transform.multiply(t, s);
      }.bind(this)
    });

    this.add(this._rippleModifier).add(this._rippleSurface);
}

Ripple.prototype = Object.create(View.prototype);
Ripple.prototype.constructor = Ripple;

Ripple.DEFAULT_OPTIONS = {
  properties : {
    border : '1px solid rgba(107,203,255,1)',
    '-webkit-box-shadow' : '0px 0px 3px 1px rgba(107,203,255,1)',
    // backgroundColor : 'rgba(107,203,255,0.2)',
    borderRadius : '50%',
    pointerEvents : 'none'
  },
  classesRipple : ['backface']
};

Ripple.prototype.start = function start() {
  this._rippleScaleTransitionable.set(3, { duration : 10000}, function() {
      this._rippleScaleTransitionable.set(0, {duration : 0 });
  }.bind(this));
  
  //create a ripple object, 
  //attach it to a modifier
  //then push it to the rendered ripples array.  
  //once the rendered ripple transition finishes
  //remove it fromt he rendered ripples aray.
}

/* Private */

// function _createMiddleLayer() {
//   this.middle = new Surface({
//     size: [this.options.radius * 2, this.options.radius * 2],
//     properties: this.options.propertiesMiddle,
//     classes: this.options.classesMiddle
//   });
//   var middleModifier = new Modifier({
//     opacity: 0.9
//   });
//   this.middle.pipe(this.sync);
//   this._rootNode.add(middleModifier).add(this.middle);
// }

// function _createFrontLayer() {
//   var size = (this.options.radius * 2) - 10;
//   this.front = new Surface({
//     content: this.options.frontContent,
//     size: [size, size],
//     properties : this.options.propertiesContent,
//     classes : this.options.classesContent
//   });
//   var frontModifier = new Modifier({
//     transform: Transform.translate(0, 0, 5)
//   });
//   this.front.pipe(this.sync);
//   this._rootNode.add(frontModifier).add(this.front);
// }

// function _createBackLayer() {
//   var size = (this.options.radius * 2) - 10;
//   this.back = new Surface({
//     content: this.options.backContent,
//     size: [size, size],
//     properties : this.options.propertiesContent,
//     classes : this.options.classesContent
//   });
//   var backModifier = new Modifier({
//     transform: Transform.multiply(Transform.rotateY(Math.PI), Transform.translate(0, 0, 5))
//   });
//   this.back.pipe(this.sync);
//   this._rootNode.add(backModifier).add(this.back);
// }

// function _createRippleLayer() {
//   this.rippleSurface = new Surface({
//     size : [500, 500],
//     properties : this.options.propertiesRipple,
//     classes : this.options.classesRipple
//   });
//   var rippleModifier = new Modifier({
//     transform: function() {
//       var scale = this._rippleTransitionable.get();
//       var s = Transform.scale(scale, scale, 1);
//       var t = Transform.translate(0, 0, 0);
//       return Transform.multiply(t, s);
//     }.bind(this)
//   })
//   this._rootNode.add(rippleModifier).add(this.rippleSurface);
// }

// function _bindEvents() {
//   var self = this;
//   self.sync.on('start', function(data) {
//     data.RipplePosition = self.options.RipplePosition;
//     self._eventOutput.emit('start', data);
//     self.ripple();
//   });

//   self.sync.on('end', function(data) {
//     data.RipplePosition = self.options.RipplePosition;
//     self._eventOutput.emit('end', data);
//   });

//   self.sync.on('update', function(data) {
//     // self.body.position.x -= data.delta[0];
//     data.RipplePosition = self.options.RipplePosition;
//     self._eventOutput.emit('update', data);
//   });
// }

module.exports = Ripple;
