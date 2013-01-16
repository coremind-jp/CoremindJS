(function(global) {
global.cm = {
    /**
     * ログを関数を使用する場合true. 
     */
    enabledLog:true,
    /**
     * 結合ソースを使用している場合true.
     */
    isJoinedSource:false,
    /**
     * 結合ソースののパスを設定します.
     */
    joinedSource:
    {
        path:"../",
        name:"allinone.js"
    },
    /**
     * スニペットのパスを設定します.
     */
    snippetSource:
    {
        path:"../",
        name:"snippet.js"
    },
    /**
     * 結合ソースからスニペットテンプレートを生成するcgiへのパスを設定します. 
     */
    snippetGenerator:
    {
        path:"../",
        name:"snippetGenerator.php"
    },
    /**
     * パッケージルートパスのエイリアスを設定します. 
     */
    domain:
    {
        cm:"http://127.0.0.1/web/coremindjs/coremind/"
    },
    /*
     * アプリケーションで使用するリソース用ディレクトリルートパスのエイリアスを指定します.
     */
    resource:
    {
        r:"http://localhost/web/coremindjs/resource",
        p:"http://localhost/web/coremindjs/resource"
    },
    /**
     * HtmlDomLoader, AjaxLoaderのデフォルト値を設定します.
     */
    loaderOptionTemplate:
    {
        ajax:
        {
            timeout:15000,
            requestType:"text",
            method:"GET",
            retry:3,
            async:true,
            withCredentials:false,
            header:{}
        },
        htmlDom:
        {
            timeout:15000,
            retry:1
        }
    }
}})(window);