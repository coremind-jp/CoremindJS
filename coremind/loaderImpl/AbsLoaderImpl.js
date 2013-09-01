cls.exports(
    "cm.util.UpdateDispatcher",
    "cm.core.LoaderInterface",
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.AbsLoaderImpl",
    $static:
    {
        IDLE:0,
        LOAD:1,
        COMPLETE:2,
        TIMEOUT:3,
        ERROR:4
    },
    $define:
    /** @lends cm.loader.AbsLoaderImpl.prototype */
    {
        AbsLoaderImpl:function()
        {
            this.mState    = this.$class.IDLE;
            this.mRetry    = 0;
            this.mTimeout  = 0;
            this.mProgress = 0;
            this.mLoader   = null;
            this.mResponse = null;
        },
        destroy:function()
        {
            if (!eq.isNull(this.mLoader))
                this._resetLoader();
            cm.util.UpdateDispatcher.removeUpdater(this);
        },
        
        setting:function(requestParams, requestOption)
        {
            this.mParams  = requestParams;
            this.mOption  = requestOption;
            this.mRetry   = requestOption.retry;
            this.mTimeout = requestOption.timeout;
        },
        request:function()
        {
            cm.util.UpdateDispatcher.addUpdater(this);
            this.mProgress = 0;
            this.mState    = this.$class.LOAD;
            this.mResponse = null;
            this._setLoader();
        },
        _setLoader:function() {},
        _resetLoader:function() {},

        isRunning:function() {
            return this.$class.LOAD == this.mState;
        },
        isComplete:function() {
            return this.$class.COMPLETE == this.mState;
        },
        isTimeout:function() {
            return this.$class.TIMEOUT == this.mState;
        },
        isError:function() {
            return this.$class.ERROR == this.mState;
        },
        response:function() {
            return this.mResponse;
        },

        /* event handring */
        onProgress:function(per)
        {
            cm.core.LoaderInterface.stateChangeByProgress(this.mParams.id(), per);
            this.mProgress = per;
        },
        onTimeout:function()
        {
            cm.util.UpdateDispatcher.removeUpdater(this);
            this.mProgress = 1;
            this.mState    = this.$class.TIMEOUT;
            cm.core.LoaderInterface.stateChangeByTimeout(this.mParams.id());
            this._resetLoader();
        },
        onError:function(error)
        {
            cm.util.UpdateDispatcher.removeUpdater(this);
            this.mProgress = 1;
            this.mState    = this.$class.ERROR;
            this.mResponse = error;
            cm.core.LoaderInterface.stateChangeByError(this.mParams.id());
            this._resetLoader();
        },
        onComplete:function(response)
        {
            cm.util.UpdateDispatcher.removeUpdater(this);
            this.mProgress = 1;
            this.mState    = this.$class.COMPLETE;
            this.mResponse = response;
            cm.core.LoaderInterface.stateChangeByComplete(this.mParams.id());
            this._resetLoader();
        },

        //updater interface(timeout observer)
        _update:function(delta, elapsed)
        {
            if (0 < (this.mTimeout -= elapsed))
                return true;

            if (0 < --this.mRetry)
            {
                this.request();
                return true;
            }
            else
            {
                this.onTimeout();
                return false;
            }
        }
    }
});
