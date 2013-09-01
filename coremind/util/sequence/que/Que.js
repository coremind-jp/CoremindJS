cls.exports(
    "cm.util.sequence.que.QueContainer",
{
    $name:"cm.util.sequence.que.Que",
    $define:
    {
        Que:function(target)
        {
            this.mTarget = target;
            this.mSequencerCallbacks = [];
            cm.util.sequence.que.QueContainer.enqueue(this);
        },
        destroy:function()
        {
            //disabled lock
            delete this.invoke;
            this._stopObserve();

            this.mTarget = null;
            this.mArguments = null;
            cm.util.sequence.que.QueContainer.dequeue(this);
        },
        method:function(methodName)
        {
            this.mMethodName = methodName;
            return this;
        },
        args:function()
        {
            this.mArguments = arguments;
            return this;
        },
        invoke:function()
        {
            this._startObserve();
            this.mTarget[this.mMethodName].apply(this.mTarget, this.mArguments);

            //enabled lock
            this.invoke = this._lock;
        },
        _startObserve:function() {},
        _lock:function() {
            out.w(this.className, "was canceled in order to already begin to run.");
        },
        _onDispatch:function()
        {
            //disabled lock
            delete this.invoke;
            this._stopObserve();

            for (var i = 0, len = this.mSequencerCallbacks.length; i < len; i++)
                this.mSequencerCallbacks[i]();
        },
        _stopObserve:function() {},

        //from Sequencer Class Only
        _pushSequencerCallback:function(callback) {
            var i = this.mSequencerCallbacks.indexOf(callback);
            if (i == -1) this.mSequencerCallbacks[this.mSequencerCallbacks.length] = callback;
        },
        _spliceSequencerCallback:function(callback)
        {
            var i = this.mSequencerCallbacks.indexOf(callback);
            if (i > -1) this.mSequencerCallbacks.splice(i, 1);
        },

        //from QueContainer and Sequencer Class Only
        _setContainerIndex:function(index) {
            this.mContainerIndex = index;
        },
        _getContainerIndex:function() {
            return this.mContainerIndex;
        }
    }
});