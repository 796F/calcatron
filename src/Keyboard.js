var View          = require('famous/core/View');
var Vector        = require('famous/math/Vector');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var Modifier      = require('famous/core/Modifier');
var PhysicsEngine = require('famous/physics/PhysicsEngine');
var Key           = require('./Key');
var KeyAnchor     = require('./KeyAnchor');
var EventHandler  = require('famous/core/EventHandler');
var VectorField = require('famous/physics/forces/VectorField');

var Side = {
  FRONT : 0,
  BACK : 1
}

function Keyboard() {
    View.apply(this, arguments);

    this._eventHandler = new EventHandler();
    this._eventHandler.subscribe(this._eventInput);
    
    this.side;

    this._pe = new PhysicsEngine();
    this._keys = [];
    this._keyBodies = [];
    this._keyboardModifier = new Modifier({
      transform : Transform.translate(-75, 30, 0)
    });
    this._rootNode = this.add(this._keyboardModifier);
    
    _createPhysicsElements.call(this);
    _createKeys.call(this);
    _bindEvents.call(this);
}

Keyboard.prototype = Object.create(View.prototype);
Keyboard.prototype.constructor = Keyboard;

Keyboard.DEFAULT_OPTIONS = {
  keys : [
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '÷', '=']
  ],
  backKeys : [
    ['√', '∛', 'π', 'e'],
    ['ln', 'lg', '%', '±'],
    ['φ', 'e', '6', 'x'],
    [' ', ' ', ' ', ' '],
  ]
};

Keyboard.prototype.flipAll = function flipAll() {
  this.side = !this.side;
  for(var i=0; i<this._keys.length; i++) {
    this._keys[i].flipY(100 * i, function() {
      console.log(i);
    });
  }
}

/* private */

function _createPhysicsElements() {
  this.pressedForce = new VectorField({
    strength: 100,
    field: VectorField.FIELDS.RADIAL
  });
}

function _createKeys() {
  var keys = this.options.keys;
  var backKeys = this.options.backKeys;
  for(var i=0; i<keys.length; i++) {
    var row = keys[i];
    for(var j=0; j<row.length; j++) {


      var key = new Key({
        position : [j * 50, i * 50, 0],
        frontContent: keys[i][j],
        backContent: backKeys[i][j], 
        keyPosition : [i, j]
      });
      var keyAnchor = new KeyAnchor(key, [j * 50, i * 50, 0], this._pe);

      key.pipe(this._eventInput);
      this._keys.push(key);
      this._rootNode.add(key);
    }
  }
  this.side = Side.BACK;
}

function _bindEvents() {
    this._eventHandler.on('start', function(data) {
      var keys;
      if(this.side == Side.FRONT) {
        keys = this.options.keys;
      }else{
        keys = this.options.backKeys;
      }
      console.log('start', keys[data.keyPosition[0]][data.keyPosition[1]]);
      //apply force
      // this._pe.attach(agent, this._keyBodies, this._keys[0]);

    }.bind(this));

    this._eventHandler.on('update', function(data) {
      console.log('update');
    }.bind(this));

    this._eventHandler.on('end', function(data) {
      var keys;
      if(this.side == Side.FRONT) {
        keys = this.options.keys;
      }else{
        keys = this.options.backKeys;
      }
      console.log('end', keys[data.keyPosition[0]][data.keyPosition[1]]);
      //remove force
      // this._pe.detach(agent, this._keyBodies, this._keys[0]);
    }.bind(this));
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
