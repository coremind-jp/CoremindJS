cls.exports(
    "cm.core.UserAgent",
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.AjaxLoaderImpl",
    $extends:"cm.loaderImpl.AbsLoaderImpl",
    $define:
    /** @lends cm.loader.ElementLoader.prototype */
    {
        AjaxLoaderImpl:function()
        {

        },
        destroy:function() {},
        
        _setRequestHeader:function()
        {
            if ("setRequestHeader" in this.mLoader)
                for (var name in this.mOption.header)
                    this.mLoader.setRequestHeader(name, this.mOption.header[name]);
            else
                out.w("XDR is No custom headers may be added to the request");
        },
        _onStatechange:function()
        {
            if (this.mLoader.readyState == 4)
                this.mLoader.status == 200 ?
                    this.onComplete():
                    this.onError(this.mLoader.status);
        },
        _createXhr:function()
        {
            if (cm.core.UserAgent.isInternetExplorer())
            {
                //ajax supprt are version 8+ only.
                if (cm.core.UserAgent.browserVersion <= 7)
                    if (eq.isFunction(cm.onWarningUpgrade))
                        cm.onWarningUpgrade();
                    
                //version 8+ are use XDomainRequest object.
                if (cm.core.UserAgent.browserVersion > 7)
                {
                    out.d("create XDomainRequest");
                    return new XDomainRequest();
                }
            }
            else
                return new XMLHttpRequest();
        }
    },
    $override:
    {
        setting:function(requestParams, requestOption)
        {
            this.$super("setting")(
                requestParams,
                eq.isUndefined(requestOption) ?
                    cls.config.loaderOptionTemplate.ajax:
                    requestOption);
        },
        _setLoader:function()
        {
            this.mLoader = this._createXhr();
            this.mLoader.onload = this.$bind("onComplete");
            this.mLoader.onreadystatechange = this.$bind("_onStatechange");
            this.mLoader.onprogress = this.$bind("onProgress");
        },
        _resetLoader:function()
        {
            var _loader = this.mLoader;
            this.mLoader = null;

            _loader.abort();
            _loader.onload = _loader.onprogress = _loader.onreadystatechange = null;

            return _loader;
        },

        request:function()
        {
            this.$super("request")();

            var _url    = this.mParams.url();
            var _method = this.mOption.method.toUpperCase();
            
            this.mLoader.requestType = this.mOption.requestType;
            this.mLoader.withCredentials = this.mOption.withCredentials;
            var _q = this.mParams.createGetQuery();

            if (_method.match(/^POST$/))
            {
                this.mLoader.open(_method, _url, this.mOption.async);
                this._setRequestHeader();
                this.mLoader.send(_q);
            }
            else
            {
                _q = _q.length > 0 ? "?" + _q: _q;
                var _param = this.mParams.createGetQuery();
                try { this.mLoader.open(_method, _url + _q, this.mOption.async); }
                catch (e) { this.log(e.message); return; } //ie error by local environment.
                this._setRequestHeader(this.mLoader, this.mOption.header);
                this.mLoader.send(null);
            }
        },

        onProgress:function()
        {
            if (!eq.isUndefined(this.mLoader.lengthComputable) //XDR has not progress event.
            &&   e.lengthComputable)
            {
                var _xhr = e.target;
                this.$super("onProgress")(_xhr.requestParams.id(), e.loaded / e.total);
            }
        },
        onComplete:function()
        {
            this.$super("onComplete")(
                eq.isNull(this.mLoader.responseXML) ?
                    this.mLoader.response:
                    this.mLoader.responseXML);
        }
    }
});
