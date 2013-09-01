cls.exports(
    "cm.core.DomInterface",
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.HtmlDomLoaderImpl",
    $extends:"cm.loaderImpl.AbsLoaderImpl",
    $define:
    /** @lends cm.loader.HtmlDomLoaderImpl.prototype */
    {
        HtmlDomLoaderImpl:function(elementTag)
        {
            this.mTag = elementTag;
        },
        destroy:function() {}
    },
    $override:
    {
        setting:function(requestParams, requestOption)
        {
            this.$super("setting")(
                requestParams,
                eq.isUndefined(requestOption) ?
                cls.config.loaderOptionTemplate.htmlDom:
                    requestOption);
        },
        _setLoader:function()
        {
            this.mLoader = cm.dom.util.createElement(this.mTag);
            cm.dom.event.addEventListener(cm.event.Event.LOAD, this.mLoader, this.$bind('onComplete'), true);
            cm.dom.event.addEventListener(cm.event.Event.ERROR, this.mLoader, this.$bind('onError'), true);
        },
        _resetLoader:function()
        {
            var _loader = this.mLoader;
            this.mLoader = null;
            cm.dom.event.removeEventListener(cm.event.Event.LOAD, _loader, this.$bind('onComplete'), true);
            cm.dom.event.removeEventListener(cm.event.Event.ERROR, _loader, this.$bind('onError'), true);
        },
        
        request:function()
        {
            this.$super("request")();

            var _query = this.mParams.createGetQuery();
            this.mLoader.src = this.mParams.url() + (_query == "" ? "": "?" + _query);
        },

        onComplete:function(response)
        {
            this.$super("onComplete")(response.target);
        }
    }
});
