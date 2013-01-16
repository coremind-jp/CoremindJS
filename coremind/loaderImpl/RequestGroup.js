cm.Class.create(
    "cm.core.BrowserInterface",
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.RequestGroup",
    $extends:"cm.event.EventDispatcher",
    $define:
    /** @lends cm.loader.RequestGroup.prototype */
    {
        RequestGroup:function()
        {
            this.mIsRunning = false;
            this.mTotalRequestNum = 0;
            this.mRequires = new Object();
            this.mProgress = new Object();
            
            this.mErrors = new Array();
            this.mTimeouts = new Array();
        },
        destroy:function() {},
        
        _hasUrl:function(url) { return !cm.equal.isUndefined(this.mRequires[url]); },
        
        addRequire:function(url, param, option)
        {
            if (this.mIsRunning)
                cm.log.e("addRequire is canceled. this object is aleady run.");
            
            url = cm.dom.toAbsolutePath(url)
            if (!this._hasUrl(url))
            {
                this.mTotalRequestNum++;
                this.mRequires[url] = arguments;
            }
            return this;
        },
        removeRequire:function(url)
        {
            if (this.mIsRunning)
                cm.log.e("removeRequire is canceled. this object is aleady run.");
            
            url = cm.dom.toAbsolutePath(url)
            if (this._hasUrl(url))
            {
                this.mTotalRequestNum--;
                delete this.mRequires[url];
            }
            return this;
        },
        clone:function()
        {
            var _clone = new this.$class();
            _clone.mTotalRequestNum = this.mTotalRequestNum;
            for (var p in this.mRequires)
                _clone.mRequires[p] = this.mRequires[p];
            return _clone;
        },
        
        /* from LoaderInterface be call method */
        notifyLoading:function() { this.mIsRunning = true; },
        shiftRequire:function()
        {
            for (var p in this.mRequires)
            {
                var _requestParams = this.mRequires[p];
                delete this.mRequires[p];
                return _requestParams;
            }
            return null;
        },
        updateByError:function(url)
        {
            this.mErrors.push(url);
            return this.updateByProgress(url, 0);
        },
        updateByTimeout:function(url)
        {
            this.mTimeouts.push(url);
            return this.updateByProgress(url, 0);
        },
        updateByProgress:function(url, per)
        {
            this.mProgress[url] = per;
            
            var _progress = this._calcProgress();
            var _isComplete = 1 <= _progress;
            if (_isComplete)
            {
                this.dispatchEvent(cm.event.Event.COMPLETE, {
                    error:this.mErrors.slice(0),
                    timeout:this.mTimeouts.slice(0)
                });
                this.destroy();
            }
            else
            {
                this.dispatchEvent(cm.event.Event.PROGRESS, _progress);
                if (per == 1) this.dispatchEvent(cm.event.Event.UPDATE, url);
            }
            return _isComplete;
        },
        _calcProgress:function()
        {
            var _current = 0;
            for (var url in this.mProgress)
                _current += this.mProgress[url];
            
            var _total = this.mTotalRequestNum
                - this.mErrors.length
                - this.mTimeouts.length;
           
            return _current / _total;
        }
    }
});
