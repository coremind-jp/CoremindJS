cm.Class.create(
    "cm.core.LoaderInterface",
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.AbsLoaderImpl",
    $define:
    /** @lends cm.loader.AbsLoaderImpl.prototype */
    {
        AbsLoaderImpl:function()
        {
            this.mTimer = {};
            cm.util.UpdateDispatcher.addUpdater(this);
        },
        destroy:function() {
            cm.util.UpdateDispatcher.removeUpdater(this);
        },
        
        create:function(url, param, option) {},
        request:function(loaderObject)
        {
            var _arg = loaderObject.cmArgumentsCache;
            var _url = _arg[0];
            var _option = _arg[2];
            
            this.mTimer[_url] = _option.timeout;
            return loaderObject
        },
        initializeLoader:function(loaderObject) {},
        resetLoader:function(loaderObject) {
            delete this.mTimer[loaderObject.cmArgumentsCache[0]];
        },
        
        attachCustomProperty:function(loaderObject, url, param, option)
        {
            param = this.objectToQuery(param);
            loaderObject.cmRetry = option.retry;
            loaderObject.cmArgumentsCache = Array.prototype.slice.call(arguments, 1);
        },
        detachCustomProperty:function(loaderObject)
        {
            loaderObject.cmRetry = undefined;
            loaderObject.cmArgumentsCache = undefined;
        },
        objectToQuery:function(param)
        {
            var _result = "";
            
            if (cm.equal.isObject(param))
                for (var prop in param)
                    _result += cm.string.concat(
                        _result == "" ? "": "&", prop, "=", encodeURI(param[prop]));
                        
            return _result;
        },
        
        onProgress:function(url, per) {
            cm.core.LoaderInterface.stateChangeByProgress(url, per);
        },
        onTimeout:function(loaderObject)
        {
            if (--loaderObject.cmRetry == 0)
            {
                cm.core.LoaderInterface.stateChangeByTimeout(loaderObject.cmArgumentsCache[0]);
                this.resetLoader(loaderObject);
            }
            else
                this.request.apply(this, [loaderObject]);
        },
        onError:function(loaderObject)
        {
            cm.core.LoaderInterface.stateChangeByError(loaderObject.cmArgumentsCache[0]);
            this.resetLoader(loaderObject);
        },
        onComplete:function(loaderObject)
        {
            cm.core.LoaderInterface.stateChangeByComplete(loaderObject.cmArgumentsCache[0]);
            this.resetLoader(loaderObject);
        },
        
        //updater interface(timeout observer)
        _update:function(delta, elapsed)
        {
            for (var url in this.mTimer)
                if ((this.mTimer[url] -= elapsed) < 0)
                    this.onTimeout(cm.core.LoaderInterface.getCache(url));
            return true;
        }
    }
});
