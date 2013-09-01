cls.exports(
    "cm.event.Event",
    "cm.motion.Easing",
    "cm.core.DomInterface",
{
    $name:"cm.webComponent.Scroll",
    $static:
    {
        VERTICAL:0,
        HORIZONTAL:1,
        _POSITION:[
            "scrollTop",
            "scrollLeft"
        ],
        _SCROLL_SIZE:[
            "scrollHeight",
            "scrollWidth"
        ],
        _BOX_SIZE:[
            "clientHeight",
            "clientWidth"
        ]
    },
    $extends:"cm.util.Updater",
    $define:
    {
        Scroll:function(targetElement)
        {
            //public
            this.duration = 1000;
            this.accelerationTimeLeft = 100;//ms
            this.magnificationRate = 2;
            this.easing = cm.motion.Easing.QuartOut;
            this.direction = this.$class.VERTICAL;
            
            //private
            this.mTarget = targetElement;
            this.mIsDown = true;
            
            cm.dom.event.addEventListener(cm.event.Event.MOUSE_WHEEL,
                targetElement, this.$bind("_onWheel"), true);
        },
        destroy:function()
        {
            cm.dom.event.removeEventListener(cm.event.Event.MOUSE_WHEEL,
                this.mTarget, this.$bind("_onWheel"), true);
            this.mTarget = null;
        },
        
        to:function(position) {
            this._startScroll((position <= 1 ? this._getSize() * position: position) - this._getPosition());
        },
        by:function(position) {
            this._startScroll(position <= 1 ? this._getSize() * position: position);
        },
        reset:function()
        {
            this._stopScroll();
            this._setPosition(0);
        },
        getScrollProgress:function() {
            return this.mTarget[this.$class._POSITION[this.direction]] / this._getSize();
        },
        onScroll:function() {},

        _onWheel:function(e)
        {
            e.preventDefault();
            
            this._isChangeWheelDirection(e.isWheelDown()) ?
                this._stopScroll():
                this._startScroll(this._calcWheelScrollLength());
        },
        
        _isChangeWheelDirection:function(isDown)
        {
            var _prevIsDown = this.mIsDown;
            var _currentIsDown = this.mIsDown = isDown;
            return _prevIsDown !== _currentIsDown;
        },
        _calcWheelScrollLength:function()
        {
            //this.scrollRange = this._getSize() * .02;
            this.scrollRange = 60;
            this.mMagnification = this.mDelta < this.accelerationTimeLeft ?
                this.mMagnification * this.magnificationRate: 1;
            return this.scrollRange * this.mMagnification * (this.mIsDown ? 1: -1);
        },
        _startScroll:function(scrollLength)
        {
            this.mPrevScrollLength = this.mCurrentScrollLength = 0;
            this.mBeginPosition = this._getPosition();
            this.mScrollLength = scrollLength;
            this.start(this.duration, 1);
        },
        _stopScroll:function()
        {
            this.stop();
            this.mMagnification = 1;
        },
        _getSize:function()
        {
            var _ss = this.$class._SCROLL_SIZE[this.direction];
            var _bs = this.$class._BOX_SIZE[this.direction];
            return this.mTarget[_ss] - this.mTarget[_bs];
        },
        _getPosition:function() {
            return this.mTarget[this.$class._POSITION[this.direction]];
        },
        _setPosition:function(position) {
            this.mTarget[this.$class._POSITION[this.direction]] = position;
            this.onScroll()
        }
    },
    $override:
    {
        update:function()
        {
            var _scrollLength = this.easing(this.mProgress) * this.mScrollLength;
            this.mCurrentScrollLength += _scrollLength - this.mPrevScrollLength;
            this.mPrevScrollLength = _scrollLength;
            
            var _calcedPosition = this.mBeginPosition + this.mCurrentScrollLength|0;
            this._setPosition(_calcedPosition);
            
            var _elementPosition = this._getPosition();
            if (_calcedPosition != _elementPosition)
            {
                this._stopScroll();
                if (_elementPosition > 0)
                {
                    this.log(_calcedPosition, _elementPosition);
                    this.dispatchEvent(cm.event.Event.SCROLL_COMPLETE);
                }
            }
        },
        onUpdate:function() { return true; },
        onComplete:function() { return false; }
    }
});
