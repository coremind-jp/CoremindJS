cm.Class.create(
    "cm.event.Event",
    "cm.loaderImpl.HtmlDomLoaderImpl",
    "cm.loaderImpl.HtmlDomOption",
    "cm.loaderImpl.AjaxLoaderImpl",
    "cm.loaderImpl.AjaxOption",
    "cm.core.BrowserInterface",
{
    /** @name cm.core */
    $name:"cm.core.LoaderInterface",
    $extends:"cm.event.EventDispatcher",
    $singleton:true,
    $define:
    /** @lends cm.core.LoaderInterface.prototype */
    {
        LoaderInterface:function()
        {
            cm.loader = this;
            
            this.templateOption = cm.manifest.loaderOptionTemplate;
            this.mAjaxLoader = new cm.loaderImpl.AjaxLoaderImpl();
            this.mDomLoader = new cm.loaderImpl.HtmlDomLoaderImpl();
            
            this.mLoading = new Object();
            this.mComplete = new Object();
            this.mError = new Object();
            this.mTimeout = new Object();
            
            this.mRequestGroups = new Array();
        },
        destroy:function() {},
        
        isRunning:function() { return this.mRequestGroups.length > 0; },
        addRequestGroup:function(requestGroup)
        {
            if (this.mRequestGroups.indexOf(requestGroup) > -1)
                return;
                
            this.mRequestGroups.push(requestGroup);
            this._resumeRequestGroup(requestGroup) ?
                this.mRequestGroups.pop():
                requestGroup.notifyLoading();
        },
        _resumeRequestGroup:function(requestGroup)
        {
            var _require, _url;
            while (!cm.equal.isNull(_require = requestGroup.shiftRequire()))
            {
                if (!cm.equal.isUndefined(this.mLoading[_require]))
                    continue;
                    
                _url = _require[0];
                var _isComplete;
                if (!cm.equal.isUndefined(this.mError[_url]))
                    _isComplete = requestGroup.updateByError(_url)
                else
                if (!cm.equal.isUndefined(this.mTimeout[_url]))
                    _isComplete = requestGroup.updateByTimeout(_url)
                else
                if (!cm.equal.isUndefined(this.mComplete[_url]))
                    _isComplete = requestGroup.updateByProgress(_url, 1);
                    
                if (_isComplete)
                    return true;
                    
                this._request.apply(this, _require);
            }
            return false;
        },
        _request:function(url, param, option)
        {
            url = cm.dom.toAbsolutePath(url);
            
            var _loader = this.mDomLoader;
            var _option = cm.equal.isUndefined(option) ? this.templateOption.htmlDom: option;
            var _instance = _loader.create(url, param, _option);
            
            if (cm.equal.isNull((_instance)))
            {
                _loader = this.mAjaxLoader;
                _option = cm.equal.isUndefined(option) ? this.templateOption.ajax: option;
                _instance = _loader.create(url, param, _option);
            }
                
            if (cm.equal.isUndefined(this.mLoading[url]))
                this.mLoading[url] = _instance;
                
            _loader.request(_instance);
        },
        removeRequestGroup:function(requestGroup)
        {
            var i = this.mRequestGroups.indexOf(requestGroup)
            if (i > -1) this.mRequestGroups.splice(i, 1);
        },
        clearRequestGroups:function()
        {
            this.mLoading = new Object();
            while (this.isRunning())
                var _requestGroup = this.mRequestGroups.unshift().destroy();
                
            for (var p in this.mLoading)
                if (cm.equal.isFunction(this.mLoading[p].abort))
                    this.mLoading[p].abort();
        },
        
        
        getCache:function(url)
        {
            url = cm.dom.toAbsolutePath(url);
            return !cm.equal.isUndefined(this.mComplete[url]) ?
                this.mComplete[url]:
                !cm.equal.isUndefined(this.mLoading[url]) ?
                    this.mLoading[url]:
                    !cm.equal.isUndefined(this.mError[url]) ?
                        this.mError[url]:
                        !cm.equal.isUndefined(this.mTimeout[url]) ?
                            this.mTimeout[url]:
                            null;
        },
        clearCache:function(url)
        {
            if (cm.equal.isUndefined(url))
            {
                this.mComplete = new Object();
                this.mError = new Object();
                this.mTimeout = new Object();
            }
            else
            {
                delete this.mComplete[url];
                delete this.mError[url];
                delete this.mTimeout[url];
            }
        },
        
        
        stateChangeByProgress:function(url, per)
        {
            var _requestGroups = this.mRequestGroups;
            for (var i = 0, len = _requestGroups.length; i < len; i++)
                _requestGroups[i].updateByProgress(url, per);
        },
        stateChangeByError:function(url)
        {
            this.mError[url] = this.mLoading[url];
            delete this.mLoading[url];
            
            var _requestGroups = this.mRequestGroups;
            for (var i = 0; i < _requestGroups.length; i++)
                if (_requestGroups[i].updateByError(url))
                    _requestGroups.splice(i--, 1);
                    
            this.dispatchEvent(cm.event.Event.ERROR, url);
        },
        stateChangeByTimeout:function(url)
        {
            this.mTimeout[url] = this.mLoading[url];
            delete this.mLoading[url];
            
            var _requestGroups = this.mRequestGroups;
            for (var i = 0; i < _requestGroups.length; i++)
                if (_requestGroups[i].updateByTimeout(url))
                    _requestGroups.splice(i--, 1);
                
            this.dispatchEvent(cm.event.Event.TIMEOUT, url);
        },
        stateChangeByComplete:function(url)
        {
            this.mComplete[url] = this.mLoading[url];
            delete this.mLoading[url];
            
            var _requestGroups = this.mRequestGroups;
            for (var i = 0; i < _requestGroups.length; i++)
                if (_requestGroups[i].updateByProgress(url, 1))
                    _requestGroups.splice(i--, 1);
        }
    }
    
});
