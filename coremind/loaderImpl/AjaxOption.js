cls.exports(
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.AjaxOption",
    $defaultConfig:{
        timeout:15000,
        requestType:"text",
        method:"GET",
        retry:3,
        async:true,
        withCredentials:false,
        header:{}
    },
    $define:
    /** @lends cm.loader.ElementLoader.prototype */
    {
        AjaxOption:function()
        {
            var _config = this.getConfig();
            
            this.timeout = _config.timeout;
            this.requestType = _config.requestType;
            this.method = _config.method;
            this.retry = _config.retry;
            this.async = _config.async;
            this.withCredentials = _config.withCredentials;
            this.header = _config.header;
        },
        destroy:function() {}
    }
});
