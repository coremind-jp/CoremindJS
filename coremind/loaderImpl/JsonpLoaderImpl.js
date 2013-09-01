cls.exports(
    "cm.core.DomInterface",
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.JsonpLoaderImpl",
    $extends:"cm.loaderImpl.AbsLoaderImpl",
    $static: {
        REQUEST_COUNTER:0
    },
    $define:
    /** @lends cm.loader.ElementLoader.prototype */
    {
        JsonpLoaderImpl:function() {},
        destroy:function() {},
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
            this.mLoader = cm.dom.util.createElement("script");
            cm.dom.d.body.appendChild(this.mLoader);
        },
        _resetLoader:function()
        {
            window["__jsonpRes"+this.mCallbackIndex] = undefined;
            return cm.dom.d.body.removeChild(this.mLoader);
        },
        request:function()
        {
            this.$super("request")();

            this.mCallbackIndex = this.$class.REQUEST_COUNTER++;
            window["__jsonpRes"+this.mCallbackIndex] = this.$bind("onComplete");

            var _url = this.mParams.url();
            var _q   = this.mParams.createGetQuery();
            _q = _q.length > 0 ? "?" + _q: _q;
            this.mLoader.src = _url + _q + "&callback=__jsonpRes" + this.mCallbackIndex;
        }
    }
});
