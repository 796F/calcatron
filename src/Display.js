var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var Modifier = require('famous/core/Modifier');
var ScrollView = require('famous/views/ScrollView');
var NativeScroller = require('./NativeScroller');
//display which lets you traverse content which you can push to. 

function Display() {
    View.apply(this, arguments);

    this._rootModifier = new Modifier({
      size: [50, 200],
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      transform: Transform.translate(100, 200, 0)
    });
    this._rootNode = this.add(this._rootModifier);

    //add container surface 

    _createScroller.call(this);
    _createScrollerContent.call(this);
}

Display.prototype = Object.create(View.prototype);
Display.prototype.constructor = Display;

Display.DEFAULT_OPTIONS = {};

function _createScroller() {
  this._scrollview = new NativeScroller({ direction: 1, size: [50, 200] });
  this._scrollview.layoutFn = function(modifier, offset){
    modifier.setTransform(Transform.translate(0, 0, -Math.abs(offset)));
  };
  this._rootNode.add(this._scrollview);
}

function _createScrollerContent() {
  var surfaces = [];
  for(var i=0; i<55; i++){
    var surface = new Surface({
      size: [50, 50],
      content: '' + i,
      properties : {
        color: 'white',
        textAlign : 'center',
        backgroundColor : 'red'
      }
    });
    // surface.pipe(this._scrollview);
    surfaces.push(surface);
  }
  this._scrollview.sequenceFrom(surfaces);
}

module.exports = Display;
