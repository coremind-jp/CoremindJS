cm.Class.create(
    "cm.util.UpdateDispatcher",
    "cm.core.BrowserInterface",
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.HtmlDomLoaderImpl",
    $extends:"cm.loaderImpl.AbsLoaderImpl",
    $define:
    /** @lends cm.loader.HtmlDomLoaderImpl.prototype */
    {
        HtmlDomLoaderImpl:function()
        {
            this.mExtensions = {
                img:new RegExp("^(gif|jpeg|jpg|png)", "i"),
                video:new RegExp("^(264|3g2|3gp|3gpp|avc|avi|h264|m4v|mkv|mp4|mpeg|mpg|ogg|ogv|webm)", "i"),
                audio:new RegExp("^(aac|m4a|mp3|oga|ogg|wav)", "i")
            };
        },
        destroy:function() {},
        
        create:function(url, param, option)
        {
            var _tagName = this._switchTagName(url.split(".").pop());
            if (cm.equal.isNull(_tagName))
                return null;
            else
            {
                var _element = cm.dom.d.createElement(_tagName);
                this.initializeLoader(_element);
                this.attachCustomProperty(_element, url, param, option);
                return _element;
            }
        },
        _switchTagName:function(extension)
        {
            for (var tagName in this.mExtensions)
                if (extension.match(this.mExtensions[tagName]))
                    return tagName;
            return null;
        },
        request:function(loaderObject)
        {
            var _arg = loaderObject.cmArgumentsCache;
            var _url = _arg[0];
            var _param = _arg[1];
            
            this.$super("request")(loaderObject);
            loaderObject.src = _url + _param;
        },
        initializeLoader:function(loaderObject)
        {
            cm.dom.addEventListener(cm.event.Event.LOAD, loaderObject, this.$bind("onComplete"), true);
            cm.dom.addEventListener(cm.event.Event.ERROR, loaderObject, this.$bind("onError"), true);
        },
        resetLoader:function(loaderObject)
        {
            this.$super("resetLoader")(loaderObject);
            cm.dom.removeEventListener(cm.event.Event.LOAD, loaderObject, this.$bind("onComplete"), true);
            cm.dom.removeEventListener(cm.event.Event.ERROR, loaderObject, this.$bind("onError"), true);
            this.detachCustomProperty(loaderObject);
        },
        onError:function(e) { this.$super("onError")(e.target); },
        onComplete:function(e) { this.$super("onComplete")(e.target); }
    }
});
