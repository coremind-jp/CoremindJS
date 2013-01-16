cm.Class.create(
    "cm.util.LinkedTaskObserver",
    "cm.event.EventDispatcher",
{
    $name:"cm.util.LinkedTask",
    $extends:"cm.event.EventDispatcher",
    $define:
    {
        LinkedTask:function(isLinked)
        {
            this.mLinked = Boolean(isLinked);
            this.mReverse = false;
            this.mCurrent = 0;
            this.mArguments = [];
        },
        destroy:function()
        {
            while (this.mArguments.length > 0)
                this.mArguments.shift()[0].linkedTaskObserver.reset();
        },
        enabledLinked:function(bool) {
            this.mLinked = bool;
        },
        enabledReverse:function(bool) {
            this.mReverse = bool;
        },
        push:function(target, methodName, arg)
        {
            if (cm.util.LinkedTaskObserver.equal(target.linkedTaskObserver))
            {
                target.linkedTaskObserver.set(this);
                this.mArguments[this.mArguments.length] = arguments;
            }
            else
                cm.log.w("target has not property [linkedTaskObserver]");
                
            return this;
        },
        invokeTask:function(idx)
        {
            if (0 <= idx && idx < this.mCurrent)
            {
                this.mCurrent = idx;
                this.invokeCurrentTask();
            }
        },
        invokeCurrentTask:function()
        {
            var _t = this._getTarget(this.mCurrent);
            var _m = this._getMethodName(this.mCurrent);
            var _a = this._getArguments(this.mCurrent);
            _t[_m].apply(_t, _a);
        },
        invokeNextTask:function() {
            this.mReverse ? this._decrementTask(): this._incrementTask();
        },
        onComplete:function() {
            this.dispatchEvent(cm.event.Event.COMPLETE);
        },
        _incrementTask:function()
        {
            var _len = this.mArguments.length;
            if (_len <= ++this.mCurrent)
            {
                if (this.mLinked && _len != 0)
                {
                    this.mCurrent = 0;
                    this.invokeCurrentTask();
                }
                this.onComplete();
            }
            else
                this.invokeCurrentTask();
        },
        _decrementTask:function()
        {
            var _len = this.mArguments.length;
            if (--this.mCurrent < 0)
            {
                if (this.mLinked && _len != 0)
                {
                    this.mCurrent = _len - 1;
                    this.invokeCurrentTask();
                }
                this.onComplete();
            }
            else
                this.invokeCurrentTask();
        },
        _getTarget:function(idx) {
            return this.mArguments[idx][0];
        },
        _getMethodName:function(idx) {
            return this.mArguments[idx][1];
        },
        _getArguments:function(idx) {
            return Array.prototype.slice.call(this.mArguments[idx], 2);
        }
    }
});