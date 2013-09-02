cls.exports(
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.HtmlDomOption",
    $defaultConfig:{
        timeout:15000,
        retry:1
    },
    $define:
    /** @lends cm.loader.HtmlDomOption.prototype */
    {
        HtmlDomOption:function()
        {
            var _config = this.getConfig();
            
            this.timeout = _config.timeout;
            this.retry = _config.retry;
        },
        destroy:function() {}
    }
});
