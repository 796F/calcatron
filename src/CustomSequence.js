var Modifier  = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var View      = require('famous/core/View');

function CustomSequence (options) {
	View.call(this, options)

	this._posCache    = [];

	this._renderables;
	this._mods;
}

CustomSequence.prototype = Object.create(View.prototype);
CustomSequence.prototype.constructor = CustomSequence;

CustomSequence.prototype.sequenceFrom = function (arr) {
	this._renderables = arr;
	this._mods        = [];
	var pos           = 0;

	for (var i = 0; i < arr.length; i++) {
		this._posCache[i] = pos;
		var mod       = new Modifier({
			transform: Transform.translate(0, pos, 0)
		});
		pos += arr[i].size[1];

		this._mods.push(new Modifier());

		this.add(mod).add(this._mods[i]).add(this._renderables[i]);
	}
}

module.exports = CustomSequence;
