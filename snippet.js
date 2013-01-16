/**
 * @fileOverview
 * @url https://github.com/otn83/CoremindJS
 * @author otn83 nakahara@coremind.jp
 * @version 0.2.0(beta)
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 */
var cm = 
{
    Class:
    {
        /**
         * クラスをインポートします.
         * classNameからjsファイルの位置を特定し動的に読み込みを開始します.
         * カスタムパッケージを使用する場合はcm.manifest.domainを拡張します.
         * @name using
         * @param {String} className パッケージ名を含めた完全なクラスパス
         * @function
         */
        importJsFile:function() {},
        /**
         * @name cm.Class
         * @namespace cm.Class
         * クラスから生成されたインスタンスの数を出力します.(参照カウンター)
         * new演算子で数を繰り上げ, インスタンスのdestroyメソッドの呼び出しで繰り下げます.
         * サブクラスをnewした場合スーパークラスも数が繰り上がります.
         * @name profile
         * @function
         */
        profile:function() {},
        /**
         * クラスオブジェクトを取得します.
         * classNameによってjsファイルの位置、参照位置を特定します.
         * カスタムパッケージを使用する場合はcm.Domainを使用します.
         * @name get
         * @param {String} className パッケージ名を含めた完全なクラスパス
         * @function
         */
        get:function(className) {},
        /**
         * クラスを作成します.
         * @name create
         * @param {classDefine} 生成するクラスの定義オブジェクト
         * @function
         */
        create:function() {},
        /**
         * クラスを読み込みます.
         * @name create
         * @param {classDefine} 生成するクラスの定義オブジェクト
         * @function
         */
        load:function() {},
    },
    /**
     * @name cm.DataType
     * @namespace プリミティブデータ型定数
     */
    dataType:{
        /**#@+
         * @type String
         * @constant
         * @memberOf cm.DataType
         */
        /**
         * String型を示す値
         * @name S
         */
        S:"string",
        /**
         * Number型を示す値
         * @name N
         */
        N:"number",
        /**
         * Boolean型を示す値
         * @name B
         */
        B:"boolean",
        /**
         * Function型を示す値
         * @name F
         */
        F:"function",
        /**
         * Object型を示す値
         * @name O
         */
        O:"object",
        /**
         * Array型を示す値
         * @name A
         */
        A:"array"
        /**#@-*/
    },
    /**
     * @name cm.Domain
     * @namespace パッケージとディレクトリのルート定義です.
     */
    Domain:
    {
        /**#@+
         * @type String
         * @constant
         * @memberOf cm.Domain
         */
        /**
         * Coremindパッケージ
         * @name cm
         */
        cm:"http://localhost/web/coremindjs/coremind/"
        /**#@-*/
    },
    equal:{
        /**
         * valのがBooleanかを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {boolean} Booleanの場合true, それ以外の場合false
         */
        isBoolean:function(val) {},
        /**
         * valのがNumberかを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {boolean} Numberの場合true, それ以外の場合false
         */
        isNumber:function(val) {},
        /**
         * valのがStringかを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {boolean} Stringの場合true, それ以外の場合false
         */
        isString:function(val) {},
        /**
         * valのがArrayかを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {boolean} Arrayの場合true, それ以外の場合false
         */
        isArray:function(val) {},
        /**
         * valのがFunctionかを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {boolean} Functionの場合true, それ以外の場合false
         */
        isFunction:function(val) {},
        /**
         * valのがObjectかを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {boolean} Objectの場合true, それ以外の場合false
         */
        isObject:function(val) {},
        /**
         * valのがnullかを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {boolean} nullの場合true, それ以外の場合false
         */
        isNull:function(val) {},
        /**
         * valのがundefinedかを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {boolean} undefinedの場合true, それ以外の場合false
         */
        isUndefined:function(val) {},
        /**
         * valのタイプを示す値を返します.
         * @param {Object} val 任意のデータ
         * @return {cm.DataType} データ型定数
         */
        typeOf:function(val) {}
    },
    log:{
        /**
         * Objectの構造をconsole.logで出力します.
         * @param {Object} val 出力したいオブジェクトです.
         * @param {String} prefix 出力時に先頭に付加する接頭辞
         */
        dump:function(val, prefix) {},
        /** 可変長引数に対応したconsole.log. */
        p:function() {},
        /** アプリケーション開発者向けlog出力. */
        d:function() {},
        /** warning log出力. */
        w:function() {},
        /** error log出力. */
        e:function() {},
        /** ライブラリ開発者向けlog出力. */
        $:function() {}//develope
    },
    array:{
        indexOf:function(object) {}
    },
    object:{
        clone:function(from, to) {},
        getOwnPropertyNames:function(object) {}
    },
    string:{
        /**
         * 引数に与えた文字列を結合します.
         */
        concat:function() {},
        capitalize:function() {},
    }
};