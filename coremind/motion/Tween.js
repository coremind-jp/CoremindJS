cls.exports(
    "cm.display.abs.fill.Color",
{
    $name:"cm.motion.Tween",
    $static:function() {
        this.TO_COLOR = new cm.display.abs.fill.Color(0);
        this.FROM_COLOR = new cm.display.abs.fill.Color(0);
    },
    $define:
    {
        Tween:function(target, isRecycle)
        {
            this.isRecycle = Boolean(isRecycle);
            this.mTarget = target;
            this.mEasing = null;
            this.mToPositionIsAbsolute = true;
        },
        destroy:function()
        {
            var _container = eq.isUndefined(this.mTarget.__tweenContainer) ?
                this.mTarget.parent.__tweenContainer:
                this.mTarget.__tweenContainer;

            if (_container[this.mQuery] === this)
                delete _container[this.mQuery];
            
            this.isOverrided = true;
            this.mTarget = null;
        },
        property:function(val)
        {
            this.mQuery = val;
            return this;
        },
        toAbsolute:function(val)
        {
            this.mTo = val;
            this.mToPositionIsAbsolute = true;
            return this;
        },
        toRelative:function(val)
        {
            this.mTo = val;
            this.mToPositionIsAbsolute = false;
            return this;
        },
        from:function(val)
        {
            this.mFrom = val;
            return this;
        },
        easing:function(easing, option)
        {
            this.mEasing = easing;
            this.mEasingOption = option;
            return this;
        },
        build:function()
        {
            if (!eq.isUndefined(this.mProperty))
                return;

            if (eq.isUndefined(this.mTarget)
            ||  eq.isUndefined(this.mQuery)
            ||  eq.isUndefined(this.mTo))
                return out.w("build canceled. invalid parameters.");
            else
            {
                this._tryCreateTweenContainer();
                this._createAccessor();
                this.mProperty === "argb" ?
                    this._calcDeltaByColor():
                    this._calcDelta();
            }
        },
        _tryCreateTweenContainer:function()
        {
            if (eq.isUndefined(this.mTarget.__tweenContainer))
                this.mTarget["__tweenContainer"] = {};

            var _container = this.mTarget.__tweenContainer;
            if (!eq.isUndefined(_container[this.mQuery]))
                _container[this.mQuery].isOverrided = true;

            _container[this.mQuery] = this;
            this.isOverrided = false;
        },
        _createAccessor:function()
        {
            this.mOrderIndex = [];
            this.mHierarchy = this.mQuery.split(".");
            this.mProperty = this.mHierarchy.pop();
            this._renameToHierarchy();
            for(var i = 0, len = this.mHierarchy.length; i < len; i++)
                this._clipIndex(i);
        },
        _renameToHierarchy:function()
        {
            if (this.mHierarchy[0] == "$")
            {
                this.mHierarchy.shift();
                this.mTarget = this.mTarget.cmDisplay;
            }

            for(var i = 0, len = this.mHierarchy.length; i < len; i++)
                this.mHierarchy[i] = "edit" + this.mHierarchy[i].replace(
                    /^\w/,
                    function(val) { return val.toUpperCase(); });
        },
        _clipIndex:function(i)
        {
            var _hierarchyName = this.mHierarchy[i];
            var _matchResult = _hierarchyName.match(/[0-9]+/);

            if (eq.isNull(_matchResult))
                this.mOrderIndex[i] = undefined;
            else
            {
                this.mHierarchy[i] = _hierarchyName.replace(_matchResult[0], "");
                this.mOrderIndex[i] = _matchResult[0];
            }
        },
        _calcDelta:function()
        {
            var _tweenTarget = this._getTweenTarget();

            if (eq.isUndefined(this.mFrom))
                this.mFrom = _tweenTarget[this.mProperty]();
            this.mProperty += "Abs";
                
            this.mTweenDelta = this.mToPositionIsAbsolute ?
                this.mTo - this.mFrom:
                this.mTo;
        },
        _calcDeltaByColor:function()
        {
            var _tweenTarget = this._getTweenTarget();
            var _toColor = this.$class.TO_COLOR.argbAbs(this.mTo);
            var _fromColor = eq.isUndefined(this.mFrom) ?
                _tweenTarget:
                this.$class.FROM_COLOR.argbAbs(this.mFrom);

            this.update = this.updateByColor;
            this.mFrom = [_fromColor.a(), _fromColor.r(), _fromColor.g(), _fromColor.b()];
            this.mTweenDelta = [
                _toColor.a() - _fromColor.a(),
                _toColor.r() - _fromColor.r(),
                _toColor.g() - _fromColor.g(),
                _toColor.b() - _fromColor.b()];
        },
        _getTweenTarget:function()
        {
            var _result = this.mTarget;
            for(var i = 0, len = this.mHierarchy.length; i < len; i++)
                _result = _result[this.mHierarchy[i]](this.mOrderIndex[i]);
            return _result;
        },
        update:function(progress)
        {
            this._getTweenTarget()[this.mProperty](this.mFrom + this.mTweenDelta
                    * (eq.isNull(this.mEasing) ?
                        progress:
                        this.mEasing(progress, this.mEasingOption)));
        },
        updateByColor:function(progress)
        {
            var _color = this._getTweenTarget();
            progress = this.mEasing(progress, this.mEasingOption);
            _color.aAbs(this.mFrom[0] + this.mTweenDelta[0] * progress);
            _color.rAbs(this.mFrom[1] + this.mTweenDelta[1] * progress);
            _color.gAbs(this.mFrom[2] + this.mTweenDelta[2] * progress);
            _color.bAbs(this.mFrom[3] + this.mTweenDelta[3] * progress);
        }
    }
});