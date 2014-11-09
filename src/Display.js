var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var Modifier = require('famous/core/Modifier');

//display which lets you traverse content which you can push to. 

function Display() {
    View.apply(this, arguments);

    this._boundingBox;

    _createBox.call(this);
}

Display.prototype = Object.create(View.prototype);
Display.prototype.constructor = Display;

Display.DEFAULT_OPTIONS = {};

function _createBox() {
  this._boundingBox = new Surface({
    size : [200, 100],
    properties : {
      border : '1px solid rgba(107,203,255,1)',
      '-webkit-box-shadow' : '0px 0px 3px 1px rgba(107,203,255,1)',
      color : 'rgba(107,203,255,1)',
      textAlign : 'center',
      lineHeight : '100px',
      fontSize : '30px',
      fontFamily: 'Avenir'
    },
    content: '5 * 5 = 25',
    classes: ['backface']
  });

  this._boxModifier = new Modifier({
    transform: Transform.translate(0, -150, 0)
  });

  this.add(this._boxModifier).add(this._boundingBox);
}

module.exports = Display;
