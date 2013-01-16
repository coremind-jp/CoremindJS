cm.Class.create(
    "cm.event.Event",
    "cm.motion.Easing",
    "cm.core.BrowserInterface",
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
        Scroll:function()
        {
            //public
            this.duration = 1000;
            this.accelerationTimeLeft = 100;//ms
            this.magnificationRate = 2;
            this.easing = cm.motion.Easing.QuartOut;
            this.direction = this.$class.VERTICAL;
            
            //private
            this.mRootElement = cm.dom.d.body;
            this.mIsDown = true;
            this.mElements = new Array();
            this.mFocus = this.mRootElement;
            
            cm.dom.addEventListener(
                cm.event.Event.MOUSE_WHEEL,
                this.mRootElement,
                this.$bind("_onWheel"),
                true);
        },
        destroy:function()
        {
            cm.dom.removeEventListener(cm.event.Event.MOUSE_WHEEL,
                this.mRootElement, this.$bind("_onWheel"), true);
                
            while (this.mElements.length > 0)
                this.removeElement(this.mElements[0]);
        },
        
        addElement:function(element)
        {
            element.cmMotionScroll = true;
            this.mElements.push(element);
            cm.dom.addEventListener(cm.event.Event.MOUSE_OVER,
                element, this.$bind("_onMouseOver"), true);
            cm.dom.addEventListener(cm.event.Event.MOUSE_OUT,
                element, this.$bind("_onMouseOut"), true);
        },
        removeElement:function(element)
        {
            delete element.cmMotionScroll;
            this.mElements.splice(this.mElements.indexOf(element), 1);
            cm.dom.removeEventListener(cm.event.Event.MOUSE_OVER,
                element, this.$bind("_onMouseOver"), true);
            cm.dom.removeEventListener(cm.event.Event.MOUSE_OUT,
                element, this.$bind("_onMouseOut"), true);
        },
        
        to:function(element, position)
        {
            var _target = this.mElements[this.mElements.indexOf(element)];
            var _beginPosition = this._getPosition(_target);
            this._startScroll(
                _target,
                (position <= 1 ? this._getSize(_target) * position: position) - _beginPosition);
        },
        by:function(element, position)
        {
            var _target = this.mElements[this.mElements.indexOf(element)];
            this._startScroll(
                _target,
                position <= 1 ? this._getSize(_target) * position: position);
        },
        
        _onMouseOver:function(e)
        {
            this.mFocus = e.target;
            this._stopScroll();
        },
        _onMouseOut:function(e) {
            this.mFocus = this.mRootElement;
        },
        _onWheel:function(e)
        {
            e.preventDefault();
            
            var _target = this._getScrollTarget(this.mFocus);
            this._isChangeWheelDirection(e.isWheelDown()) ?
                this._stopScroll():
                this._startScroll(_target, this._calcWheelScrollLength(_target));
        },
        
        _getScrollTarget:function(target)
        {
            while (target !== this.mRootElement)
            {
                var _position = this._getPosition(target);
                if (this.mIsDown && _position != this._getSize(target)
                || !this.mIsDown && _position != 0)
                    return target;
                else
                    target = target.parentNode;
            }
            return this.mRootElement;
        },
        _isChangeWheelDirection:function(isDown)
        {
            var _prevIsDown = this.mIsDown;
            var _currentIsDown = this.mIsDown = isDown;
            return _prevIsDown !== _currentIsDown;
        },
        _calcWheelScrollLength:function(target)
        {
            this.scrollRange = this._getSize(target) * .02;
            this.mMagnification = this.mDelta < this.accelerationTimeLeft ?
                this.mMagnification * this.magnificationRate: 1;
            return this.scrollRange * this.mMagnification * (this.mIsDown ? 1: -1);
        },
        _startScroll:function(target, scrollLength)
        {
            this.mTarget = target;
            this.mPrevScrollLength = this.mCurrentScrollLength = 0;
            this.mBeginPosition = this._getPosition(target);
            this.mScrollLength = scrollLength;
            this.start(this.duration, 1);
        },
        _stopScroll:function()
        {
            this.stop();
            this.mMagnification = 1;
        },
        update:function()
        {
            var _scrollLength = this.easing(this.mRatio) * this.mScrollLength;
            this.mCurrentScrollLength += _scrollLength - this.mPrevScrollLength;
            this.mPrevScrollLength = _scrollLength;
            
            var _currentPosition = this.mBeginPosition + this.mCurrentScrollLength|0;
            this._setPosition(this.mTarget, _currentPosition);
            
            if (_currentPosition != this._getPosition(this.mTarget))
                this._stopScroll();
        },
        _getSize:function(element)
        {
            var _ss = this.$class._SCROLL_SIZE[this.direction];
            var _bs = this.$class._BOX_SIZE[this.direction];
            return element[_ss] - element[_bs];
        },
        _getPosition:function(element) {
            return element[this.$class._POSITION[this.direction]];
        },
        _setPosition:function(element, position) {
            element[this.$class._POSITION[this.direction]] = position;
        },
        onUpdate:function() { return true; },
        onComplete:function() { return false; }
    }
});
