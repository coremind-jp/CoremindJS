cm.Class.create(
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.HtmlDomOption",
    $define:
    /** @lends cm.loader.HtmlDomOption.prototype */
    {
        HtmlDomOption:function()
        {
            this.timeout = 15000;
            this.retry = 1;
        },
        destroy:function() {}
    }
});
