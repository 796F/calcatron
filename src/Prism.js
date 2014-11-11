var View = require('famous/core/View');
var RenderNode = require('famous/core/RenderNode');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var Transitionable = require('famous/transitions/Transitionable');
var Modifier = require('famous/core/Modifier');
var ContainerSurface = require('famous/surfaces/ContainerSurface');
var Ripple = require('./Ripple');
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
      '-webkit-box-shadow' : '0px 0px 1px 1px rgba(107,203,255,1)',
      overflow: 'hidden'
      // pointerEvents : 'none'
    },
    opacity : 0.5,
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
  var faceContainer = new ContainerSurface({
    size: params.size,
    properties: this.options.properties,
    classes : this.options.classes
  });

  // RIPPLE START

  faceContainer.on('click', function(ev) {
    var rect = ev.target.getBoundingClientRect();

    var x = ev.clientX - rect.left;
    var y = ev.clientY - rect.top;

    var ripple = new Ripple({
      x : rect.width-x, 
      y : rect.height-y
    });
    ripple.start();
    faceContainer.add(ripple);

    // console.log(x, 'from the left and', y, 'from the top');

    // rt = new Transitionable(0);
    // rt.set(3, { duration : 10000}, function() {
    //   this.set(0, {duration : 0 });
    // }.bind(rt));

    // rs = new Surface({
    //   size : [500, 500],
    //   properties : {
    //     border : '1px solid rgba(107,203,255,1)',
    //     '-webkit-box-shadow' : '0px 0px 3px 1px rgba(107,203,255,1)',
    //     // backgroundColor : 'rgba(107,203,255,0.2)',
    //     borderRadius : '50%',
    //     pointerEvents : 'none'
    //   },
    //   classes : ['backface']
    // });

    // var hit = new Surface({
    //   properties : {
    //     backgroundColor: 'red'
    //   },
    //   size : [50, 50]
    // });
    
    // var hitMod = new Modifier({
    //   origin: [0.5, 0.5],
    //   transform: function() {
    //     var t = Transform.translate(rect.width-x, rect.height-y, 0);
    //     var s = Transform.scale(rt.get(), rt.get(), 1);
    //     return Transform.multiply(t, s);
    //     // return s;
    //   }
    // });

    // faceContainer.add(hitMod).add(rs);

  }.bind(faceContainer));

  // RIPPLE END

  // var face = new Surface({
  //   size: params.size,
  //   // properties: this.options.properties,
  //   // classes : this.options.classes
  // });

  // faceContainer.add(face);
  var faceModifier = new Modifier({
      orign: [0.5, 0.5],
      align: [0.5, 0.5],
      opacity: this.options.opacity,
      transform: _generateTransformFunction.call(this, params)
  });

  this._faces.push(faceContainer);
  this.add(faceModifier).add(faceContainer);
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
