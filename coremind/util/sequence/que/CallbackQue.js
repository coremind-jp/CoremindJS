cls.exports(
{
    $name:"cm.util.sequence.que.CallbackQue",
    $extends:"cm.util.sequence.que.Que",
    $define:
    {
        CallbackQue:function(target) {},
        destroy:function() {},
        observeCallbackName:function(callbackName)
        {
            this.mCallbackName = callbackName;
            return this;
        }
    },
    $override:
    {
        _startObserve:function()
        {
            var _onDispatch = this.$bind("_onDispatch");
            var _target = this.mTarget;
            var _callback = this.mTarget[this.mCallbackName];

            this.mTarget[this.mCallbackName] = function()
            {
                var _callbackResult = eq.isFunction(_callback) ?
                    _callback.call(_target): undefined;
                _onDispatch();
                return _callbackResult;
            };
            this.mBeforeCallback = _callback;
        },
        _stopObserve:function() {
            this.mTarget[this.mCallbackName] = this.mBeforeCallback;
        }
    }
});