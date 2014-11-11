var View           = require('famous/core/View');
var Surface        = require('famous/core/Surface');
var Transitionable = require('famous/transitions/Transitionable');
var Easing = require('famous/transitions/Easing');
var Transform      = require('famous/core/Transform');
var Vector         = require('famous/math/Vector');
var StateModifier  = require('famous/modifiers/StateModifier');
var Keyboard = require('./Keyboard');
var Prism          = require('./Prism');
var Display = require('./Display');
var Modifier = require('famous/core/Modifier');

var MouseSync      = require("famous/inputs/MouseSync");
var TouchSync      = require("famous/inputs/TouchSync");
var ScrollSync     = require("famous/inputs/ScrollSync");
var GenericSync    = require("famous/inputs/GenericSync");

GenericSync.register({
    "mouse"  : MouseSync,
    "touch"  : TouchSync,
    "scroll" : ScrollSync
});


function AppView() {
    View.apply(this, arguments);
    window.app = this;

    this._rotationTransitionable = new Transitionable([0, Math.PI, 0]);

    this._rootModifier = new Modifier({
        origin: [0.5, 0.5], 
        align: [0.5, 0.5],
        transform : function() {
          return Transform.rotate.apply(this, this._rotationTransitionable.get());
        }.bind(this)
    });
    
    this._rootNode = this.add(this._rootModifier);
    
    _createBackground.call(this);
    // _createDisplay.call(this);
    _createKeyboard.call(this);  
    _createCalculatorBase.call(this);
    _bindEvents.call(this);
}

AppView.prototype = Object.create(View.prototype);
AppView.prototype.constructor = AppView;

AppView.DEFAULT_OPTIONS = {};

/* prototype */

/* private */

function _createBackground() {
  this.sync = new GenericSync({
      "mouse"  : {},
      "touch"  : {},
      "scroll" : {scale : 0.3}
  });
  
  this._background = new Surface({
    size: [undefined, undefined]
  });

  this._background.pipe(this.sync);
  this.add(this._background);
}

function _createCalculatorBase() {
  this._prism = new Prism({
    dimensions: [250, 450, 10]
  });
  this._rootNode.add(this._prism);
  

  this._boundingBox = new Prism({
    dimensions: [200, 150, 10],
    properties : {
      border : '2px solid rgba(107,203,255,1)',
      '-webkit-box-shadow' : '0px 0px 1px 1px rgba(107,203,255,1)',
      pointerEvents : 'none',
      backgroundColor: 'rgba(50,50,50,1)'
    },
    opacity : 1,
  });

  this._boxModifier = new Modifier({
    transform: Transform.translate(0, -120, 0)
  });

  this._rootNode.add(this._boxModifier).add(this._boundingBox);
}

function _createDisplay() {
  this._display = new Display();
  this.add(this._display);
}

function _createKeyboard() {
  this._keyboard = new Keyboard();


  this._rootNode.add(this._keyboard);
}

function _bindEvents() {
    var self = this;

    self.sync.on('start', function(data) {
      // console.log('start', data.clientX, data.clientY);
    });

    self.sync.on('update', function(data) {
      var old_rotation = self._rotationTransitionable.get();
      old_rotation[1] += data.delta[0]/100;
    });

    self.sync.on('end', function(data) {
      // console.log('end', data.clientX, data.clientY);
      var rotation = self._rotationTransitionable.get()[1];
      var snapTo = Math.round(rotation/Math.PI) * Math.PI
      self._rotationTransitionable.set([0, snapTo, 0], {duration : 200, curve : Easing.outBounce});
    });
}


module.exports = AppView;
