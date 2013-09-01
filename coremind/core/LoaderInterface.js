cls.exports(
    "cm.event.Event",
    "cm.loaderImpl.HtmlDomLoaderImpl",
    "cm.loaderImpl.AjaxLoaderImpl",
    "cm.loaderImpl.JsonpLoaderImpl",
{
    /** @name cm.core */
    $name:"cm.core.LoaderInterface",
    $extends:"cm.event.EventDispatcher",
    $singleton:true,
    $defaultConfig:{
        htmlDom:{
            timeout:15000,
            retry:1
        },
        ajax:{
            timeout:15000,
            requestType:"text",
            method:"GET",
            retry:3,
            async:true,
            withCredentials:false,
            header:{}
        }
    },
    $define:
    /** @lends cm.core.LoaderInterface.prototype */
    {
        LoaderInterface:function()
        {
            cm.loader = this;
            this.mExtensions = {
                img:/^(gif|jpeg|jpg|png)/i,
                video:/^(264|3g2|3gp|3gpp|avc|avi|h264|m4v|mkv|mp4|mpeg|mpg|ogg|ogv|webm)/i,
                audio:/^(aac|m4a|mp3|oga|ogg|wav)/i
            };
            
            this.mRuntimeReqGrp = new Array();
            this.mLoaders = new Object();
        },
        destroy:function() {},
        
        isRunning:function() { return this.mRuntimeReqGrp.length > 0; },
        addRequestGroup:function(requestGroup)
        {
            if (this.mRuntimeReqGrp.indexOf(requestGroup) == -1)
            {
                this.mRuntimeReqGrp.push(requestGroup);
                this._tryParallelRequest(requestGroup);
            }
        },
        _tryParallelRequest:function(requestGroup)
        {
            var _require, _isAllCached;

            requestGroup.beginLoad();
            while (!eq.isNull(_require = requestGroup.shiftRequire()))
            {
                var _reqId = _require[0].id();

                this._hasLoader(_reqId) ?
                    this._resumeRequestGroup(_reqId):
                    this._addLoader(_require[0], _require[1], _reqId).request();
            }
        },
        _hasLoader:function(id) {
            return !eq.isUndefined(this.mLoaders[id]);
        },
        _resumeRequestGroup:function(id)
        {
            var _loader = this.mLoaders[id];
            if (_loader.isTimeout())
                this.stateChangeByTimeout(id);
            else
            if (_loader.isError())
                this.stateChangeByError(id);
            else
            if (_loader.isComplete())
                this.stateChangeByComplete(id);
        },
        _addLoader:function(params, option, id)
        {
            this.mLoaders[id] = this._createLoader(
                params.url().split(".").pop(),
                params.isJsonp());
            this.mLoaders[id].setting(params, option);
            return this.mLoaders[id];
        },
        _createLoader:function(extension, isJsonp)
        {
            for (var tagName in this.mExtensions)
                if (extension.match(this.mExtensions[tagName]))
                    return new cm.loaderImpl.HtmlDomLoaderImpl(tagName);

            return isJsonp ?
                new cm.loaderImpl.JsonpLoaderImpl():
                new cm.loaderImpl.AjaxLoaderImpl();
        },

        removeRequestGroup:function(requestGroup)
        {
            var i = this.mRuntimeReqGrp.indexOf(requestGroup);
            return i > -1 ?
                this.mRuntimeReqGrp.splice(i, 1)[0]:
                null;
        },
        clearRequestGroups:function()
        {
            while (this.mRuntimeReqGrp.length > 0)
                removeRequestGroup(this.mRuntimeReqGrp.shift());
        },
        
        
        getLoaderCache:function(requestParams)
        {
            var _reqId = eq.isString(requestParams) ?
                requestParams:
                requestParams.id();

            return !eq.isUndefined(this.mLoaders[_reqId]) ?
                this.mLoaders[_reqId]:
                null;
        },
        clearLoaderCache:function(requestParams)
        {
            delete this.mLoaders[eq.isString(requestParams) ?
                requestParams:
                requestParams.id()];
        },
        
        
        stateChangeByProgress:function(requestId, per)
        {
            var _reqGrp = this.mRuntimeReqGrp;
            for (var i = 0, len = _reqGrp.length; i < len; i++)
                if (_reqGrp[i].has(requestId))
                    _reqGrp[i].updateByProgress(requestId, per);
        },
        stateChangeByError:function(requestId)
        {
            var _reqGrp = this.mRuntimeReqGrp;
            for (var i = 0; i < _reqGrp.length; i++)
                if (_reqGrp[i].has(requestId)
                &&  _reqGrp[i].updateByError(requestId))
                    this.removeRequestGroup(_reqGrp[i]).destroy();
                    
            this.dispatchEvent(cm.event.Event.ERROR, requestId);
        },
        stateChangeByTimeout:function(requestId)
        {
            var _reqGrp = this.mRuntimeReqGrp;
            for (var i = 0; i < _reqGrp.length; i++)
                if (_reqGrp[i].has(requestId)
                &&  _reqGrp[i].updateByTimeout(requestId))
                    this.removeRequestGroup(_reqGrp[i]).destroy();
                
            this.dispatchEvent(cm.event.Event.TIMEOUT, requestId);
        },
        stateChangeByComplete:function(requestId)
        {
            var _reqGrp = this.mRuntimeReqGrp;
            for (var i = 0; i < _reqGrp.length; i++)
                if (_reqGrp[i].has(requestId)
                &&  _reqGrp[i].updateByProgress(requestId, 1))
                   this.removeRequestGroup(_reqGrp[i]).destroy();
        }
    }
    
});
