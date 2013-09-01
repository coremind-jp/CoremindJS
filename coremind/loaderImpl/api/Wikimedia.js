cls.exports(
    "cm.event.Event",
    "cm.core.LoaderInterface",
    "cm.loaderImpl.RequestGroup",
    "cm.loaderImpl.RequestParameters",
{
    /** @name compass.loader */
    $name:"cm.loaderImpl.api.Wikimedia",
    $static:
    {
        HOST:"http://ja.wikipedia.org",
        API_PATH:"/w/api.php"
    },
    $define:
    /** @lends compass.amazonApi.ApiClient.prototype */
    {
        Wikimedia:function()
        {
            this.params = {
                action:"query",
                list:"search",
                srsearch:"",
                srlimit:"10",
                format:"json"
            };
        },

        destroy:function() {},
        
        searchPages:function()
        {
            var _reqGrp = new cm.loaderImpl.RequestGroup();
            _reqGrp.add(new cm.loaderImpl.RequestParameters(
                this.$class.HOST + this.$class.API_PATH, this.params, true));
            _reqGrp.addEventListener(cm.event.Event.UPDATE, this.$bind("_complete"));
            cm.loader.addRequestGroup(_reqGrp);
        },

        _complete:function(e, id) {
            this.onComplete(cm.loader.getLoaderCache(id).response());
        },

        onComplete:function(response) {}
    }
});
