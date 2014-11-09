var View           = require('famous/core/View');
var Surface        = require('famous/core/Surface');
var Transitionable = require('famous/transitions/Transitionable');
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
    _createDisplay.call(this);
    _createKeyboard.call(this);  
    _createPrism.call(this);
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
      "scroll" : {scale : 0.1}
  });
  
  this._background = new Surface({
    size: [undefined, undefined]
  });
  this._background.pipe(this.sync);
  this.add(this._background);
}

function _createPrism() {
  this._prism = new Prism({
    dimensions: [300, 500, 30]
  });

  // this._prism.pipe(this.sync);
  this._prism.pipe(this._keyboard._eventInput);
  this._rootNode.add(this._prism)
}

function _createDisplay() {
  this._display = new Display();
  this._rootNode.add(this._display);
}

function _createKeyboard() {
  this._keyboard = new Keyboard();
  this._rootNode.add(this._keyboard);
}

function _bindEvents() {
    var self = this;

    self.sync.on('update', function(data) {
      var dX = data.delta[0];
      // var dY = data.delta[1];

      var old_rotation = self._rotationTransitionable.get();
      // old_rotation[0] -= dY/100;
      old_rotation[1] += dX/100;
    });
}


module.exports = AppView;
