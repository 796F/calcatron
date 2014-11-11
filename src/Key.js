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
var MouseSync      = require("famous/inputs/MouseSync");
var TouchSync      = require("famous/inputs/TouchSync");
var GenericSync    = require("famous/inputs/GenericSync");
var EventEmitter   = require('famous/core/EventEmitter');
var RotationalSpring = require('famous/physics/forces/RotationalSpring');
var Quaternion = require('famous/math/Quaternion');

GenericSync.register({
    "keyMouse"  : MouseSync,
    "keyTouch"  : TouchSync,
});

function Key() {
    View.apply(this, arguments);

    this.sync = new GenericSync({
      "keyMouse"  : {},
      "keyTouch"  : {}
    });
    this._eventInput.pipe(this.sync);

    this.body = new Particle({
      position : this.options.position
    });
    this._rippleTransitionable = new Transitionable(0);

    this._rootModifier = new Modifier({
      transform: function() {
        var t = this.body.getTransform();
        var r = Transform.rotate.apply(this, this._rotationTransitionable.get());
        return Transform.multiply(r, t);
      }.bind(this)
    });
    this._rootNode = this.add(this._rootModifier);
    
    this._rotationTransitionable = new Transitionable([0, 0, 0]);
    // this._anchorTransition = new SpringTransition(this.options.position);

    _createRippleLayer.call(this);
    _createMiddleLayer.call(this);
    _createFrontLayer.call(this);
    _createBackLayer.call(this);

    _bindEvents.call(this);

}

Key.prototype = Object.create(View.prototype);
Key.prototype.constructor = Key;

Key.DEFAULT_OPTIONS = {
  radius : 20,
  position : new Vector(0, 0, 0),
  propertiesRipple : {
    border : '1px solid rgba(107,203,255,1)',
    '-webkit-box-shadow' : '0px 0px 3px 1px rgba(107,203,255,1)',
    // backgroundColor : 'rgba(107,203,255,0.2)',
    borderRadius : '50%',
    pointerEvents : 'none'
  },
  propertiesMiddle : {
    border : '1px solid rgba(107,203,255,1)',
    '-webkit-box-shadow' : '0px 0px 3px 1px rgba(107,203,255,1)',
    color : 'rgba(107,203,255,1)',
    backgroundColor : 'rgba(50,50,50,1)'
  },
  propertiesContent : {
    // color : 'rgba(107,203,255,1)',
    color : 'white',
    textAlign : 'center',
    lineHeight : '30px',
    fontSize : '25px',
    fontFamily: 'Avenir',
    border : '1px solid rgba(107,203,255,0.5)',
    '-webkit-box-shadow' : '0px 0px 1px 1px rgba(107,203,255,1)',
  },
  classesMiddle : ['backface'],
  classesContent : ['backface'],
  classesRipple : ['backface'],
  frontContent: 'O',
  backContent: 'X'
};

Key.prototype.ripple = function ripple() {
  this._rippleTransitionable.set(3, { duration : 10000}, function() {
    this._rippleTransitionable.set(0, {duration : 0 });
  }.bind(this));

  //create a ripple object, 
  //attach it to a modifier
  //then push it to the rendered ripples array.  
  //once the rendered ripple transition finishes
  //remove it fromt he rendered ripples aray.
}

/* Private */

function _createMiddleLayer() {
  this.middle = new Surface({
    size: [this.options.radius * 2, this.options.radius * 2],
    properties: this.options.propertiesMiddle,
    classes: this.options.classesMiddle
  });
  var middleModifier = new Modifier({
    opacity: 0.9
  });
  this.middle.pipe(this.sync);
  this._rootNode.add(middleModifier).add(this.middle);
}

function _createFrontLayer() {
  var size = (this.options.radius * 2) - 10;
  this.front = new Surface({
    content: this.options.frontContent,
    size: [size, size],
    properties : this.options.propertiesContent,
    classes : this.options.classesContent
  });
  var frontModifier = new Modifier({
    transform: Transform.translate(0, 0, 5)
  });
  this.front.pipe(this.sync);
  this._rootNode.add(frontModifier).add(this.front);
}

function _createBackLayer() {
  var size = (this.options.radius * 2) - 10;
  this.back = new Surface({
    content: this.options.backContent,
    size: [size, size],
    properties : this.options.propertiesContent,
    classes : this.options.classesContent
  });
  var backModifier = new Modifier({
    transform: Transform.multiply(Transform.rotateY(Math.PI), Transform.translate(0, 0, 5))
  });
  this.back.pipe(this.sync);
  this._rootNode.add(backModifier).add(this.back);
}

function _createRippleLayer() {
  this.rippleSurface = new Surface({
    size : [500, 500],
    properties : this.options.propertiesRipple,
    classes : this.options.classesRipple
  });
  var rippleModifier = new Modifier({
    transform: function() {
      var scale = this._rippleTransitionable.get();
      var s = Transform.scale(scale, scale, 1);
      var t = Transform.translate(0, 0, 0);
      return Transform.multiply(t, s);
    }.bind(this)
  })
  this._rootNode.add(rippleModifier).add(this.rippleSurface);
}

function _bindEvents() {
  var self = this;
  self.sync.on('start', function(data) {
    data.keyPosition = self.options.keyPosition;
    self._eventOutput.emit('start', data);
    self.ripple();
  });

  self.sync.on('end', function(data) {
    data.keyPosition = self.options.keyPosition;
    self._eventOutput.emit('end', data);
  });

  self.sync.on('update', function(data) {
    // self.body.position.x -= data.delta[0];
    data.keyPosition = self.options.keyPosition;
    self._eventOutput.emit('update', data);
  });
}

module.exports = Key;
