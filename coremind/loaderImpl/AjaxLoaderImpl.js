cm.Class.create(
    "cm.core.BrowserInterface",
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.AjaxLoaderImpl",
    $extends:"cm.loaderImpl.AbsLoaderImpl",
    $define:
    /** @lends cm.loader.ElementLoader.prototype */
    {
        AjaxLoaderImpl:function() {},
        destroy:function() {},
        
        create:function(url, param, option)
        {
            var _xhr = cm.dom.createXhr();
            
            this.initializeLoader(_xhr);
            this.attachCustomProperty(_xhr, url, param, option);
            return _xhr;
        },
        request:function(loaderObject)
        {
            var _arg = loaderObject.cmArgumentsCache;
            var _url = _arg[0];
            var _param = _arg[1];
            var _option = _arg[2];
            var _method = _option.method.toUpperCase();
            
            this.$super("request")(loaderObject);
            loaderObject.requestType = _option.requestType;
            loaderObject.withCredentials = _option.withCredentials;
            
            if (_method.match(/^POST$/))
            {
                loaderObject.open(_method, url, _option.async);
                this._setRequestHeader(loaderObject, _option.header);
                loaderObject.send(_param);
            }
            else
            {
                _param = (_param == "" ? "": "?") + _param;
                try { loaderObject.open(_method, _url + _param, _option.async); }
                catch (e) { this.log(e.message); return; } //ie error by local environment.
                this._setRequestHeader(loaderObject, _option.header);
                loaderObject.send(null);
            }
        },
        _setRequestHeader:function(loaderObject, header)
        {
            if ("setRequestHeader" in loaderObject)
                for (var name in header)
                    loaderObject.setRequestHeader(name, header[name]);
            else
                cm.log.w("XDR is No custom headers may be added to the request");
        },
        initializeLoader:function(loaderObject)
        {
            var _onload = this.$bind("onComplete");
            var _onStatechange = this.$bind("_onStatechange");
            var _onProgress = this.$bind("onProgress");
            loaderObject.onload = function(){ _onload({ target:this }); };
            loaderObject.onreadystatechange = function(){ _onStatechange(this); };
            loaderObject.onprogress = function(){ _onProgress(this); };
        },
        resetLoader:function(loaderObject)
        {
            this.$super("resetLoader")(loaderObject);
            loaderObject.onload = null;
            loaderObject.onprogress = null;
            loaderObject.onreadystatechange = null;
            this.detachCustomProperty(loaderObject);
        },
        _onStatechange:function(loaderObject)
        {
            if (loaderObject.readyState == 4)
                loaderObject.status == 200 ?
                    this.onComplete({ target:loaderObject }):
                    this.onError({ target:loaderObject });
        },
        onProgress:function(e)
        {
            if (!cm.equal.isUndefined(e.lengthComputable) //XDR has not progress event.
            &&   e.lengthComputable)
            {
                var _xhr = e.target;
                this.$super("onProgress")(_xhr.cmArgumentsCache[0], e.loaded / e.total);
            }
        },
        onTimeout:function(loaderObject)
        {
            loaderObject.abort();
            this.$super("onTimeout")(loaderObject);
        },
        onError:function(e) { this.$super("onError")(e.target); },
        onComplete:function(e) { this.$super("onComplete")(e.target); }
    }
});
