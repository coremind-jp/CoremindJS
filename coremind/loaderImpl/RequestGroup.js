cls.exports(
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.RequestGroup",
    $extends:"cm.event.EventDispatcher",
    $define:
    /** @lends cm.loader.RequestGroup.prototype */
    {
        RequestGroup:function()
        {
            this.mRequires = new Object();
            this.mRequiresId = new Array();

            this.mTotalRequestNum = 0;

            this.isRunning = false;
            this.mProgress = 0;
            this.mCompletes = this.mErrors = this.mTimeouts = null;
        },
        destroy:function() {},
        
        add:function(requestParams, requestOption)
        {
            var _reqId = requestParams.id();
            if (!this.has(_reqId))
            {
                this.mRequiresId.push(_reqId);
                this.mRequires[_reqId] = arguments;
                this.mTotalRequestNum++;
            }
            return this;
        },
        has:function(id) { return this.mRequiresId.indexOf(id) > -1; },
        
        /* be call method from LoaderInterface */
        beginLoad:function()
        {
            this.add = null;
            this.mCompletes = new Array();
            this.mErrors = new Array();
            this.mTimeouts = new Array();
        },
        shiftRequire:function()
        {
            for (var p in this.mRequires)
            {
                var _addArgus = this.mRequires[p];
                delete this.mRequires[p];
                return _addArgus;
            }
            delete this["mRequires"];
            return null;
        },

        updateByError:function(requestId)
        {
            this.mErrors.push(requestId);
            this.mRequiresId.splice(this.mRequiresId.indexOf(requestId), 1);
            return this.updateByProgress(requestId, 1);
        },
        updateByTimeout:function(requestId)
        {
            this.mTimeouts.push(requestId);
            this.mRequiresId.splice(this.mRequiresId.indexOf(requestId), 1);
            return this.updateByProgress(requestId, 1);
        },
        updateByProgress:function(requestId, per)
        {
            var _totalPer, _destroyFlag;

            this.mProgress += per;
            _totalPer = this._calcProgress();

            this.dispatchEvent(cm.event.Event.PROGRESS, _totalPer);

            this._validateUpdate(requestId, per);
            _destroyFlag = this._validateComplete(_totalPer);
            //this.log("Current Total Per:", _totalPer, _destroyFlag);

            return _destroyFlag;
        },
        _calcProgress:function() { return this.mProgress / this.mTotalRequestNum; },
        _validateUpdate:function(requestId, per)
        {
            if (per == 1)
            {
                this.mRequiresId.splice(this.mRequiresId.indexOf(requestId), 1);
                this.mCompletes.push(requestId);
                this.dispatchEvent(cm.event.Event.UPDATE, requestId);
            }
        },
        _validateComplete:function(totalPer)
        {
            var _isComplete = 1 <= totalPer;

            if (_isComplete)
                this.dispatchEvent(cm.event.Event.COMPLETE, {
                    complete:this.mCompletes,
                    error:this.mErrors,
                    timeout:this.mTimeouts
                });

            return _isComplete;
        }
    }
});
