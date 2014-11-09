var View          = require('famous/core/View');
var Vector        = require('famous/math/Vector');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var Modifier      = require('famous/core/Modifier');
var PhysicsEngine = require('famous/physics/PhysicsEngine');
var Key           = require('./Key');

function Keyboard() {
    View.apply(this, arguments);

    this._pe = new PhysicsEngine();
    this._keys = [];
    this._keyBodies = [];
    this._keyboardModifier = new Modifier({
      transform : Transform.translate(-75, 0, 0)
    });
    this._rootNode = this.add(this._keyboardModifier);
    
    _createKeys.call(this);
}

Keyboard.prototype = Object.create(View.prototype);
Keyboard.prototype.constructor = Keyboard;

Keyboard.DEFAULT_OPTIONS = {
  keys : [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['φ', '0', '.', '=']
  ],
  backKeys : [
    ['你', '下', '爱', '神'],
    ['u', 'f', 'a', 'x'],
    ['s', 'e', '6', 'x'],
    ['1', '2', '3', 'x'],
    ['φ', '0', '.', 'v']
  ]
};

Keyboard.prototype.pressedOn = function pressedOn(index){

}

Keyboard.prototype.scatterKeys = function scatterKeys() {
  for(var i=0; i<this.options.keys.length; i++){
    for(var j=0; j<=this.options.keys[i].length; j++){
      var index = i * this.options.keys.length + j;
      var force = new Vector(i * 0.001 + 0.001, j * 0.001 + 0.001, 0);
      console.log(index);
      this._keys[index].circle.applyTorque(force);
    }
  }
}

Keyboard.prototype.flipAll = function flipAll() {
  for(var i=0; i<this._keys.length; i++) {
    this._keys[i].flipY(100 * i, function() {
      console.log(i);
    });
  }
}

/* private */

function _createKeys() {
  var keys = this.options.keys;
  var backKeys = this.options.backKeys;
  for(var i=0; i<keys.length; i++) {
    var row = keys[i];
    for(var j=0; j<row.length; j++) {
      var key = new Key({
        position : new Vector(j * 50, i * 50, 0),
        frontContent: keys[i][j],
        backContent: backKeys[i][j]
      });
      key.subscribe(this._eventInput);
      this._pe.addBody(key.circle);
      this._keyBodies.push(key.circle);
      this._keys.push(key);
      this._rootNode.add(key);
    }
  }
}

function _getRandomForceBetween(min, max) {
  return new Vector(_getRandomArbitrary(min, max), _getRandomArbitrary(min, max), _getRandomArbitrary(min, max));
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function _getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

module.exports = Keyboard;
