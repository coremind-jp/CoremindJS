(function(w) {
    var config = window._conf_ = {
        /**
         * ログを関数を使用する場合true. 
         */
        enabledLog:true,
        /**
         * パッケージパスのエイリアスを設定します. 
         */
        jsmlAlias:{
            root:"../../jscls",
            cm:"../coremind"
        }
    };

    config["root.Origin"] = {
        temp:{
            sampleConf:99
        }
    };

    config["cm.util.UpdateDispatcher"] = {
        refreshRate:1000 / 32
    };

    config["cm.core.LoaderInterface"] = {
        htmlDom:{
            timeout:15000,
            retry:1
        },
        ajax:{
            timeout:15000,
            requestType:"text",
            method:"GET",
            retry:3,
            async:true,
            withCredentials:false,
            header:{}
            //["If-Modified-Since"] = "Thu, 01 Jun 1970 00:00:00 GMT";
        }
    };
})(window);