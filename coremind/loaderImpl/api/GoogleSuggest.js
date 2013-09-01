cls.exports(
    "cm.event.Event",
    "cm.core.LoaderInterface",
    "cm.loaderImpl.RequestGroup",
    "cm.loaderImpl.RequestParameters",
{
    /** @name compass.loader */
    $name:"cm.loaderImpl.api.GoogleSuggest",
    $static:
    {
        HOST:"http://www.google.com",
        API_PATH:"/complete/search"
    },
    $define:
    /** @lends compass.amazonApi.ApiClient.prototype */
    {
        GoogleSuggest:function()
        {
            this.params = {
                hl:"en",
                q:"",
                json:true
            };
        },

        destroy:function() {},
        
        request:function()
        {
            var _reqGrp = new cm.loaderImpl.RequestGroup();
            _reqGrp.add(new cm.loaderImpl.RequestParameters(
                    this.$class.HOST + this.$class.API_PATH,
                    this.params));
            _reqGrp.addEventListener(cm.event.Event.COMPLETE, this, this._complete);
            cm.loader.addRequestGroup(_reqGrp);
        },

        _complete:function(e, report) {
            this.complete(report[0]);
        },

        complete:function(response) {}
    }
});
