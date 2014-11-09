var View           = require('famous/core/View');
var Surface        = require('famous/core/Surface');
var Transform      = require('famous/core/Transform');
var Modifier       = require('famous/core/Modifier');
var Transitionable = require('famous/transitions/Transitionable');
var Easing = require('famous/transitions/Easing');
var StateModifier  = require('famous/modifiers/StateModifier');
var Circle         = require('famous/physics/bodies/Circle');
var Vector         = require('famous/math/Vector');
var MouseSync      = require("famous/inputs/MouseSync");
var TouchSync      = require("famous/inputs/TouchSync");
var GenericSync    = require("famous/inputs/GenericSync");


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

    this.circle = new Circle({
      radius: this.options.radius,
      velocity: new Vector(0, 0, 0),
      position: this.options.position
    });

    this._rotationTransitionable = new Transitionable([0, 0, 0]);

    _createMiddleLayer.call(this);
    _createFrontLayer.call(this);
    _createBackLayer.call(this);

    this._eventInput.pipe(this.sync);
    
    _bindEvents.call(this);

}

Key.prototype = Object.create(View.prototype);
Key.prototype.constructor = Key;

Key.DEFAULT_OPTIONS = {
  radius : 20,
  position : new Vector(0, 0, 0),
  propertiesMiddle : {
    border : '1px solid rgba(107,203,255,1)',
    '-webkit-box-shadow' : '0px 0px 3px 1px rgba(107,203,255,1)',
    color : 'rgba(107,203,255,1)',
    backgroundColor : 'rgba(50,50,50,1)'
  },
  propertiesContent : {
    color : 'rgba(107,203,255,1)',
    textAlign : 'center',
    lineHeight : '35px',
    fontSize : '30px',
    fontFamily: 'Avenir',
  },
  opacity : 0.2,
  classesMiddle : ['backface'],
  classesContent : ['backface'],
  frontContent: 'O',
  backContent: 'X'
};

Key.prototype.flipY = function flipX(delay, callback) {
  var oldRotation = this._rotationTransitionable.get();
  this._rotationTransitionable.delay(delay);
  this._rotationTransitionable.set([0, oldRotation[1] + Math.PI, 0], {duration : 400, curve: Easing.inExpo }, callback);
}

/* Private */

function _createMiddleLayer() {
  this.middle = new Surface({
    size: [this.options.radius * 2, this.options.radius * 2],
    properties: this.options.propertiesMiddle,
    classes: this.options.classesMiddle
  });

  this._rootModifier = new Modifier({
    opacity: 0.7,
    transform: function() {
      return Transform.multiply(this.circle.getTransform(), Transform.rotate.apply(this, this._rotationTransitionable.get()));
    }.bind(this)
  });
  this.middle.pipe(this.sync);
  this._rootNode = this.add(this._rootModifier);
  this._rootNode.add(this.middle);
}

function _createFrontLayer() {
  this.front = new Surface({
    content: this.options.frontContent,
    size: [this.options.radius * 2, this.options.radius * 2],
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
  this.back = new Surface({
    content: this.options.backContent,
    size: [this.options.radius * 2, this.options.radius * 2],
    properties : this.options.propertiesContent,
    classes : this.options.classesContent
  });
  var backModifier = new Modifier({
    transform: Transform.multiply(Transform.rotateY(Math.PI), Transform.translate(0, 0, 5))
  });
  this.back.pipe(this.sync);
  this._rootNode.add(backModifier).add(this.back);
}

function _bindEvents() {
  this.sync.on('start', function() {
    console.log('KEY GOT start');
  });
  
  this.sync.on('end', function() {
    console.log('KEY GOT end');
  });

  this.sync.on('update', function() {
    console.log('KEY GOT update');
  });
}

module.exports = Key;
