cm.Class.create(
    "cm.display.abs.fill.Color",
    "cm.util.LinkedTaskObserver",
    "cm.core.DisplayInterface",
{
    $name:"cm.motion.Tweener",
    $extends:"cm.util.Updater",
    $static:{
        DUMMY_SETTER:function() {},
        EASE_LINEAR:function(p) { return p; },
        TO_COLOR:"eval:new cm.display.abs.fill.Color(0)",
        FROM_COLOR:"eval:new cm.display.abs.fill.Color(0)"
    },
    $define:
    {
        Tweener:function()
        {
            this.mFixed = true;
            this.mSetter = cm.motion.Tweener.DUMMY_SETTER;
            this.mRequireSetter = true;
            this.mTweenEasing = cm.motion.Tweener.EASE_LINEAR;
            this.linkedTaskObserver = new cm.util.LinkedTaskObserver();
        },
        destroy:function()
        {
            this.mTarget = null;
        },
        target:function(target)
        {
            this.mTarget = target;
            this._updateSetterRefreshState();
            this.linkedTaskObserver.notify();
            return this;
        },
        prop:function(val)
        {
            this.mProp = val;
            this._updateSetterRefreshState();
            this.linkedTaskObserver.notify();
            return this;
        },
        toFixed:function(val)
        {
            this.mTo = val;
            this.mFixed = true;
            this._updateSetterRefreshState();
            this.linkedTaskObserver.notify();
            return this;
        },
        toRelative:function(val)
        {
            this.mTo = val;
            this.mFixed = false;
            this._updateSetterRefreshState();
            this.linkedTaskObserver.notify();
            return this;
        },
        from:function(val)
        {
            this.mFrom = val;
            this.linkedTaskObserver.notify();
            return this;
        },
        easing:function(easing, option)
        {
            this.mTweenEasing = easing;
            this.mEasingOption = option;
            this.linkedTaskObserver.notify();
            return this;
        },
        _updateSetterRefreshState:function()
        {
            this.mRefreshSetter =
                   !cm.equal.isUndefined(this.mTarget)
                && !cm.equal.isUndefined(this.mProp)
                && !cm.equal.isUndefined(this.mTo);
        },
        _createSetter:function(property, to, from)
        {
            var property = new String(property);
            
            this.mRefreshSetter = false;
            
            return property.match(/argb$/) ?
                this._createSetterByARGB(property, to, from):
                this._createSetterByDefault(property, to, from);
        },
        _createSetterByDefault:function(property, to, from)
        {
            var _targetObjectIndex = property.match(/[0-9]+/);
            if (!cm.equal.isNull(_targetObjectIndex))
                property = property.replace(_targetObjectIndex, "");
            
            var _hierarchyName = property.split(".");
            var _propertyName = _hierarchyName.pop();
            var _len = _hierarchyName.length;
            var _absObject = this.mTarget;
            for(var i = 0; i < _len; i++)
            {
                _absObject = _absObject[_hierarchyName[i]](_targetObjectIndex);
                _hierarchyName[i] = "edit" + cm.string.capitalize(_hierarchyName[i]);
            }
            
            //set from value
            from = cm.equal.isUndefined(from) ? _absObject[_propertyName](): from;
                
            //set delta value
            var _delta = this.mFixed ? to - from: to;
            
            //refresh updater
            _propertyName = _propertyName + "Fix";
            return function(progress)
            {
                for(var i = 0, absObject = this.mTarget; i < _len; i++)
                    absObject = absObject[_hierarchyName[i]](_targetObjectIndex);
                absObject[_propertyName](from + _delta * progress);
            };
        },
        _createSetterByARGB:function(property, to, from)
        {
            var _targetObjectIndex = property.match(/[0-9]+/);
            if (!cm.equal.isNull(_targetObjectIndex))
            {
                _targetObjectIndex = parseInt(_targetObjectIndex[0]);
                property = property.replace(_targetObjectIndex, "");
            }
            else
                _targetObjectIndex = "";
                
            var _hierarchyName = property.split(".");
            var _propertyName = _hierarchyName.pop();
            var _len = _hierarchyName.length;
            var _hierarchy = _hierarchyName.join(".") + _targetObjectIndex;
            var _absObject = this.mTarget;
            for(var i = 0; i < _len; i++)
                _absObject = _absObject[_hierarchyName[i]](_targetObjectIndex);
            
            var _to = cm.motion.Tweener.TO_COLOR.argbAbs(to);
            var _from = cm.equal.isUndefined(from) ?
                _absObject:
                cm.motion.Tweener.FROM_COLOR.argbAbs(from);
                
            //argb is fixed tween only.
            var _fixed = this.mFixed;
            this.mFixed = true;
            var _argbTweenParameters = [
                this._createSetter(_hierarchy + ".a", _to.a(), _from.a()),
                this._createSetter(_hierarchy + ".r", _to.r(), _from.r()),
                this._createSetter(_hierarchy + ".g", _to.g(), _from.g()),
                this._createSetter(_hierarchy + ".b", _to.b(), _from.b())
            ];
            this.mFixed = _fixed;
            
            return function(progress)
            {
                for(var i = 0, len = _argbTweenParameters.length; i < len; i++)
                    _argbTweenParameters[i](progress);
            }
        },
        
        start:function(duration, repeat)
        {
            if (this.mRefreshSetter)
                this.mSetter = this._createSetter(this.mProp, this.mTo, this.mFrom);
                
            this.mSetter(this.mReverse ? 1: 0);
            this.$super("start")(
                duration,
                repeat,
                this.mReverse ? duration * repeat: 0);
        },
        
        update:function(progress) {
            this.mSetter(this.mTweenEasing(this.mRatio, this.mEasingOption));
        },
        
        gotoAndPlay:function(val) {
            var _totalDuration = this.mDelay * this.mRepeat;
            this.mDelta = val <= 1 ?
                _totalDuration * val:
                _totalDuration < val ?
                    _totalDuration:
                    val;
        },
        gotoAndStop:function(val)
        {
            var _totalDuration = this.mDelay * this.mRepeat;
            this.mDelta = val <= 1 ?
                _totalDuration * val:
                _totalDuration < val ?
                    _totalDuration:
                    val;
            this.pause();
        },
        
        wait:function(delay) {
            this.start(delay, 1);
        },
        
        reverse:function(val)
        {
            this.mReverse = val;
            this.linkedTaskObserver.reverse(val);
            this.linkedTaskObserver.notify();
            return this;
        },
        
        _timeStretch:function(val)
        {
            this.mStretch = val;
            this.linkedTaskObserver.notify();
            return this;
        },
        
        update:function() {
            this.mSetter(this.mTweenEasing(this.mRatio, this.mEasingOption));
        },
        
        onComplete:function()
        {
            this.mSetter(this.mReverse ? 0: 1)
            this.linkedTaskObserver.notify();
            return true;
        }
    }
});