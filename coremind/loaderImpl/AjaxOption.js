cls.exports(
{
    /** @name cm.loader */
    $name:"cm.loaderImpl.AjaxOption",
    $define:
    /** @lends cm.loader.ElementLoader.prototype */
    {
        AjaxOption:function()
        {
            this.timeout = 15000;
            
            this.requestType = "text";
            this.method = "GET";
            this.retry = 3;
            this.async = true;
            this.withCredentials = false;
            this.header = new Object();
        },
        destroy:function() {}
    }
});
