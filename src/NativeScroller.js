define(function(require, exports, module) {
    // var SequentialLayout    = require('famous/views/SequentialLayout');
    var CustomSequence      = require('./CustomSequence');
    var Transitionable      = require('famous/transitions/Transitionable');
    var ContainerSurface    = require('famous/surfaces/ContainerSurface');
    var Transform           = require('famous/core/Transform');
    var OptionsManager      = require('famous/core/OptionsManager');
    var Utility             = require('famous/utilities/Utility');

    /**
     * Manages and manipulates an underlying DOM element to provide native
     * scrolling.
     *
     * @class NativeScrollview
     * @uses UIStretchbox
     * @constructor
     *
     * @param {Object} [options] options to be applied to container surface.
     */
    function NativeScrollview(options) {
        ContainerSurface.apply(this, arguments);

        this.options = Object.create(NativeScrollview.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this.addClass('famous-scrollable');

        this._animatingX = false;
        this._animatingY = false;

        this._cachedSize = options.size;

        this._scrollX = new Transitionable(0);
        this._scrollY = new Transitionable(0);

        this.layoutFn = options.layoutFn;

        this._scrollableEl;
        this.on('deploy', function () {
            this._scrollableEl = this._currentTarget;
            this._scrollableEl.onscroll = this._handleScroll.bind(this);
            this._handleScroll();
        }.bind(this));

        this.context.setPerspective(1000);

        this._sequence = new CustomSequence({
            direction: this.options.direction
        });

        this.add(this._sequence);
    }

    NativeScrollview.DEFAULT_OPTIONS = {
        direction: 'x',
        scrollbar: true
    }

    NativeScrollview.prototype = Object.create(ContainerSurface.prototype);
    NativeScrollview.prototype.constructor = NativeScrollview;

    NativeScrollview.prototype._handleScroll = function _handleScroll() {
        var scrollCenter = this._scrollableEl.scrollTop + this._cachedSize[1] * 0.5;
        var positions = this._sequence._posCache;
        var mods      = this._sequence._mods;

        if(this.layoutFn) {
            for (var i = 0; i < positions.length; i++) {
                this.layoutFn(mods[i], scrollCenter - positions[i]);
            }
        }
    }

     /**
     * Before rendering, nativeScroll updates scroll position if animating.
     *
     * @method sequenceFrom
     */
    NativeScrollview.prototype.render = function render(nodeArray) {
        if(this._animatingX || this._animatingY) this._updateScrollPos();

        return ContainerSurface.prototype.render.call(this);
    }

     /**
     * Updates the scroll position of the underlying scrolling div based on values from 
     * the scrollX and scrollY transitionables.
     *
     * @method _updateScrollPos
     */
    NativeScrollview.prototype._updateScrollPos = function _updateScrollPos() {
        var scrollable = this._scrollableEl;
        if(!this._scrollableEl) return;

        var updatedX = this._scrollX.get();
        var updatedY = this._scrollY.get();

        if(scrollable.scrollLeft !== updatedX) {
            scrollable.scrollLeft = updatedX;
        }
        if(scrollable.scrollTop !== updatedY){
            scrollable.scrollTop = updatedY;
        }
    }

     /**
     * Inserted renderables are inserted into inner ViewSequence.
     *
     * @method sequenceFrom
     */
    NativeScrollview.prototype.sequenceFrom = function sequenceFrom(nodeArray) {
        return this._sequence.sequenceFrom(nodeArray);
    };

    /**
     * Overrides default options of the NativeScrollview if necessary.
     *
     * @method setOptions
     * @param {Object} [options] options to be set.
     */
    NativeScrollview.prototype.setOptions = function setOptions(options) {
        if (options.direction !== undefined) this.options.direction = options.direction;
        if (options.direction !== undefined) this.options.scrollbar = options.scrollbar;

        return ContainerSurface.prototype.setOptions.call(this, options);
    };

    /**
     * Sets the Vertical position of the Scrollview.
     *
     * @method setVScrollPosition
     */
    NativeScrollview.prototype.setVScrollPosition = function setVScrollPosition(y, transition, callback) {
        if(this._animatingY) this._scrollY.halt();

        this._scrollY.set(y, transition, function(){
            if (callback) callback();
            this._animatingY = false;
        }.bind(this));

        this._animatingY = true;
    }

    /**
     * Sets the Horizontal position of the Scrollview.
     *
     * @method setHScrollPosition
     */
    NativeScrollview.prototype.setHScrollPosition = function setVScrollPosition(x, transition, callback) {
        if(this._animatingX) this._scrollX.halt();

        this._scrollX.set(x, transition, function(){
            if (callback) callback();
            this._animatingX = false;
        }.bind(this));

        this._animatingX = true;
    }

    /**
     * Returns the current Y scroll progress of the UIScrollContaienr
     *
     * @method getVScrollPosition
     */
    NativeScrollview.prototype.getVScrollPosition = function setVScrollPosition() {
        if(!this._scrollableEl) return null;

        return this._scrollableEl.scrollTop;
    }

    /**
     * Returns the current Y scroll progress of the NativeScrollview
     *
     * @method getVScrollPosition
     */
    NativeScrollview.prototype.getHScrollPosition = function () {
        if(!this._scrollableEl) return null;

        return this._scrollableEl.scrollLeft;
    }

    /**
     * Returns max vertical scroll distance of the NativeScrollview
     *
     * @method getMaxVScrollPosition
     */
    NativeScrollview.prototype.getMaxVScrollPosition = function () {
        return this._sequence.getSize()[1];
    }

    /**
     * Returns max horizontal scroll distance of the NativeScrollview
     *
     * @method getMaxHScrollPosition
     */
    NativeScrollview.prototype.getMaxHScrollPosition = function () {
        return this._sequence.getSize()[0];
    }

    module.exports = NativeScrollview;
});