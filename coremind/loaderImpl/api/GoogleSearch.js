cls.exports(
    "cm.event.Event",
    "cm.core.LoaderInterface",
    "cm.loaderImpl.RequestGroup",
    "cm.loaderImpl.RequestParameters",
{
    /** @name compass.loader */
    $name:"cm.loaderImpl.api.GoogleSearch",
    $static:
    {
        HOST:"https://ajax.googleapis.com",
        API_PATH:"/ajax/services/search/web"
    },
    $define:
    /** @lends compass.amazonApi.ApiClient.prototype */
    {
        GoogleSearch:function()
        {
            this.params = {
                q:"query",
                v:"1.0",
                rsz:"8",//結果の取得数。有効な値は1～8
                safe:"moderate",//セーフサーチ
                lr:"lang_ja",//検索対象にする言語
                filter:"1",//重複した結果の除外
                gl:"jp"//検索対象とする地域
            };
        },

        destroy:function() {},
        
        request:function()
        {
            var _pureKeyword = this.params.q;
            this.params.q =  _pureKeyword + " -site:wikipedia.org -site:amazon.co.jp";

            var _reqGrp = new cm.loaderImpl.RequestGroup();
            _reqGrp.add(new cm.loaderImpl.RequestParameters(
                this.$class.HOST + this.$class.API_PATH, this.params, true));
            _reqGrp.addEventListener(cm.event.Event.UPDATE, this.$bind("_complete"));
            cm.loader.addRequestGroup(_reqGrp);

            this.params.q = _pureKeyword;
        },

        _complete:function(e, id) {
            this.onComplete(cm.loader.getLoaderCache(id).response());
        },

        onComplete:function(response) {}
    }
});
