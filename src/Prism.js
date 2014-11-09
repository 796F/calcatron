var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var Transitionable = require('famous/transitions/Transitionable');
var Modifier = require('famous/core/Modifier');

var NINETY_DEGRESS = Math.PI/2;

var FaceRotations = {
  FRONT : [0, 0, 0],
  BACK : [2 * NINETY_DEGRESS, 0, 0],
  LEFT: [-NINETY_DEGRESS, 0, 0],
  RIGHT: [NINETY_DEGRESS, 0, 0],
  BOTTOM: [0, -NINETY_DEGRESS, 0],
  TOP: [0, NINETY_DEGRESS, 0]
}
    
function Prism() {
    View.apply(this, arguments);

    this._faces = [];

    this._dimensionTransitionable = new Transitionable(this.options.dimensions);

    _createCube.call(this);
}

Prism.prototype = Object.create(View.prototype);
Prism.prototype.constructor = Prism;

Prism.DEFAULT_OPTIONS = {};

Prism.DEFAULT_OPTIONS = {
    dimensions: [100, 200, 30],
    properties : {
      border : '2px solid rgba(107,203,255,1)',
      '-webkit-box-shadow' : '0px 0px 6px 2px rgba(107,203,255,1)'
    },
    opacity : 0.2,
    classes : ['backface']
};

/* PROTOTYPE */

Prism.prototype.setDimensions = function setDimensions(dimensions, callback) {
  this._dimensionTransitionable.set(dimensions, {duration : 1000 }, callback);
}

/* PRIVATE */

function _createCube() {
  var faceParams = _getFaceParams.call(this, this._dimensionTransitionable.get());
  for(var side in faceParams) {
    _createFace.call(this, faceParams[side]);
  }
}

function _createFace(params) {
  var face = new Surface({
    size: params.size,
    properties: this.options.properties,
    classes : this.options.classes
  });


  var faceModifier = new Modifier({
      opacity: this.options.opacity,
      transform: _generateTransformFunction.call(this, params)
  });

  face.pipe(this._eventOutput);
  this._faces.push(face);
  this.add(faceModifier).add(face);
}

function _generateTransformFunction(params) {
  return function() {
    var r = Transform.rotate.apply(this, params.rotation);
    var t = Transform.translate(0, 0, params.translation);
    return Transform.multiply(r,t);
  }
}

function _getFaceParams(dimensions) {
  var params_map = {};
  for(var face in FaceRotations) {
    var sign=1, index, width, height;
    switch (face){
      case 'FRONT':
      case 'BACK':
        width = dimensions[0], height = dimensions[1], index = 2;
        break;
      case 'LEFT':
      case 'RIGHT':
        width = dimensions[0], height = dimensions[2], index = 1;
        break;
      case 'TOP':
      case 'BOTTOM':
        width = dimensions[2], height = dimensions[1], index = 0;
        break;
    }

    params_map[face] = {
      translation: dimensions[index] * 0.5 * sign,
      size: [width, height],
      rotation: FaceRotations[face]
    }
    sign = -sign; //hello, this is a magical.
  }
  return params_map;
}

module.exports = Prism;
