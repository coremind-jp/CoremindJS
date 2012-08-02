/**
 * @fileOverview
 * @url https://github.com/otn83/CoremindJS
 * @author otn83 nakahara@coremind.jp
 * @version 0.2.0(beta)
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 */
(function(global)
{
    /**
     * @name cm.Domain
     * @namespace パッケージとディレクトリのルート定義です.
     */
    var domain = {
        /**#@+
         * @type String
         * @constant
         * @memberOf cm.Domain
         */
        /**
         * Coremindパッケージ
         * @name cm
         */
        cm:"./coremind/"
        /**#@-*/
    };
    
	/**
	 * @name cm.DataType
     * @namespace プリミティブデータ型定数
	 */
	var dType = {
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
    };
    
    
    /**#@+ @memberOf cm */ 
    /**
     * valのタイプを示す値を返します.
     * @param {Object} val 任意のデータ
     * @return {cm.DataType} データ型定数
     */
    var typeOf = function(val)
    {
        if (val === null || val === undefined)
            return val;
            
        var _type = typeof val;
        if (_type == dType.O)
        {
            if (val instanceof Boolean)
                return dType.B;
            else
            if (val instanceof Number)
                return dType.N;
            else
            if (val instanceof String)
                return dType.S;
            else
            if (val instanceof Array)
                return dType.A;
            else
            if (val instanceof Function)
                return "function";
            else
            if (val.className
            &&  val.className == "function () { return _className; }")
                return val.className();
            else
            if (val instanceof Object)
                return dType.O;
        }
        else
            return _type;
    };
    /**
     * 可変長引数に対応したconsole.logです.
     * cm.config.traceの値をtrueにする事で使用できます.
     */
    var trace = function()
    {
        if (!global.cm.config.trace)
            return;
            
        var _s = "";
        for(var i = 0, j = arguments.length; i < j; i++)
        {
            _s += arguments[i] + " ";
        };
        console.log(_s);
    };
    /**
     * Objectの構造をconsole.logで出力します.
     * @param {Object} val 出力したいオブジェクトです.
     * @param {String} prefix 出力時に先頭に付加する接頭辞
     */
    var dump = function(val, prefix)
    {
        prefix = prefix ? prefix: "";
        if (val === undefined || val === null)
            trace(prefix, val);
        
        for (var p in val)
        {
            if (typeOf(val[p]) == dType.O)
            {
                trace(prefix, p, "┓");
                dump(val[p], prefix + "\t");
            }
            else
                trace(prefix, p, val[p]);
        }
    };
    /**
     * クラスをインポートします.
     * classNameからjsファイルの位置を特定し動的に読み込みを開始します.
     * カスタムパッケージを使用する場合はcm.Domainを使用します.
     * @param {String} className パッケージ名を含めた完全なクラスパス
     */
    var using = function(className)
    {
        var _classPath = className.split(".");
        var _className = _classPath.pop();
        var _pkg = Class._getPackage(_classPath);
        if (_pkg[_className] === undefined)
        {
            var _domain = _classPath.shift();
            var _jsPath = [domain[_domain], _classPath.join("/"), "/", _className, ".js"].join(""); 
            document.write('<script type="text/javascript" src="' + _jsPath + '"></script>');  
        }
    };
    /**#@-*/
    
    
    /**
     * @class このライブラリで使用する基本クラスです.
     * @name cm.BaseObject
     */
    var BaseObject = function()
    {
        /**
         * インスタンスの名称
         * @name name
         * @memberOf cm.BaseObject#
         * @type String
         */
        this.name = "";
        this.cm_initialize.apply(this, arguments);
    };
    BaseObject.prototype.cm_instanceCounter = 0;
    BaseObject.prototype.cm_initialize = function() { this.BaseObject.apply(this, arguments); };
    /**
     * コンストラクターを実行します.
     * @name BaseObject
     * @constructor
     * @function
     */
    BaseObject.prototype.BaseObject = function() { ++BaseObject.prototype.cm_instanceCounter; };
    /**#@+
     * @memberOf cm.BaseObject#
     * @function
     */
    /**
     * このオブジェクトの破棄処理を実行します.
     * @name destroy
     */
    BaseObject.prototype.destroy = function() { --BaseObject.prototype.cm_instanceCounter; };
    /**
     * クラス名を取得します.
     * @name className
     */
    BaseObject.prototype.className = function() { return "BaseObject"; };
    /**
     * クラスパスを取得します.
     * @name classPath
     */
    BaseObject.prototype.classPath = function() { return "cm"; };
    /**
     * 生成されたインスタンス数を取得します.
     * @name getRefCount
     */
    BaseObject.prototype.getRefCount = function() { return BaseObject.prototype.cm_instanceCounter; };
    /**
     * instanceがこのクラスのインスタンスかを示す値を返します.
     * スーパークラスであった場合でもtrueを返します.
     * @name is
     * @param {Object} instance
     * @return {Boolean} instanceがこのクラスのインスタンスであった場合true
     */
    BaseObject.prototype.is = function(instance)
    {
        return Boolean(
            typeOf(instance.prototype.className) == dType.F
        &&  instance.prototype.className() == "BaseObject");
    };
    /**
     * スーパークラスのメソッドを呼び出します.
     * コンストラクターを取得するには文字列"constructor"を指定します.
     * @name super
     * @param {String} methodName メソッド名
     */
    BaseObject.prototype.super = function() {};
    /**#@-*/
    
    
    /**
     * @name cm.Class
     * @namespace cm.Class
     */
    var Class =
    {
        /**#@+ @memberOf cm.Class */
       /**
         * 生成されたクラスオブジェクトを格納する配列です.
         * @private
         * @name all
         */
        all:[BaseObject],
        /**
         * クラスから生成されたインスタンスの数を出力します.(参照カウンター)
         * new演算子で数を繰り上げ, インスタンスのdestroyメソッドの呼び出しで繰り下げます.
         * サブクラスをnewした場合スーパークラスも数が繰り上がります.
         * @name profile
         * @function
         */
        profile:function()
        {
            for(var i = 0, j = this.all.length; i < j; i++)
                if (this.all[i].prototype.getRefCount() > 0)
                    trace(this.all[i].prototype.className(), this.all[i].prototype.getRefCount());
        },
        /**
         * クラスを作成します.
         * @name create
         * @param {String} className 生成するクラスの名前(パッケージ名も含めた完全な名称)
         * @param {Object} superClass 生成するクラスのスーパークラス、　必要ない場合は生成するクラスの定義オブジェクト
         * @param {Object} subClassDefine 生成するクラスの定義オブジェクト（生成するクラスにスーパークラスがない場合、空）
         * @param {Boolean} singleton 単一のインスタンスのみで使用するクラスの場合true
         * @function
         */
        /**#@-*/
        create:function()
        {
            if (typeof arguments[0] != dType.S)
                throw new Error("Class name is not difined." + dump(arguments));
                
            //* arguments shift
            var _classPath = Array.prototype.shift.apply(arguments).split(".");// *
            var _className = _classPath.pop();
            var superClass = BaseObject;
            var singleton;
            var subClassDefine;
            
            if (typeOf(arguments[0]) == dType.F)
                superClass = Array.prototype.shift.apply(arguments);// *
                
            if (typeOf(arguments[0]) == dType.O
            &&  typeOf(arguments[0][_className] == dType.F))
            {
                subClassDefine = Array.prototype.shift.apply(arguments);// *
                singleton = Array.prototype.shift.apply(arguments) ? true: false;// *
            }
            else
                throw new Error("Constructor is not difined." + dump(arguments));
            
            //copy super class
            var _prototypeClone = function(){};
            _prototypeClone.prototype = superClass;
            var _super = new _prototypeClone();
            
            //create sub class
            var _sub = this.all[this.all.length] = function(){
                this.cm_initialize.apply(this, arguments);
            };
            
            //attach prototype subClass define
            _sub.prototype = subClassDefine;
            //override prototype member
            _sub.prototype.cm_instanceCounter = 0;
            _sub.prototype.name = "";
            _sub.prototype.className = function() { return _className; };
            _sub.prototype.classPath = function() { return _classPath.join("."); };
            _sub.prototype.getRefCount = function() { return _sub.prototype.cm_instanceCounter; };
            _sub.prototype.is = function(instance)
            {
                if (typeOf(instance.prototype.className) == dType.F
                &&  instance.prototype.className() === this.className())
                    return true;
                else
                    _super.prototype.is(instance);
            };
            //method super
            var _superClassName = _super.prototype.className();
            var _constructor = _super.prototype[_superClassName];
            if (typeOf(_constructor) == "function") delete _sub.prototype[_superClassName];
            _sub.prototype.super = function()
            {
                var _methodName = Array.prototype.shift.apply(arguments);
                if (_methodName == "constructor")
                    _super.prototype.cm_initialize.apply(this, arguments);
                else
                {
                    try { return _super.prototype[_methodName].apply(this, arguments); }
                    catch (e) { trace(_methodName, "is not defined method.", e); };
                }
            };
            
            //attach prototype superClass define
            for (var member in _super.prototype)
            {
                //destroy
                if (member == "destroy")
                {
                    var _destroy = function()
                    {
                        _super.prototype.destroy.apply(this, arguments);
                        _sub.prototype.cm_instanceCounter--;
                    };
                    
                    if (typeOf(_sub.prototype.destroy) == dType.F)
                    {
                        var _subClassDestroy = _sub.prototype.destroy;
                        _sub.prototype.destroy = function()
                        {
                            _subClassDestroy.apply(this, arguments);
                            _destroy.apply(this, arguments);
                        };
                    }
                    else
                        _sub.prototype.destroy = _destroy;
                }
                //other
                else
                {
                    if (_sub.prototype[member] === undefined)
                        _sub.prototype[member] = _super.prototype[member];
                }
            }
            
            //create sub class initialize method
            /** @ignore */
            _sub.prototype.cm_initialize = function()
            {
                _super.prototype.cm_initialize.apply(this, arguments);
                this[_className].apply(this, arguments);
                _sub.prototype.cm_instanceCounter++;
            };
            
            //set package(singleton switch)
            this._getPackage(_classPath)[_className] = singleton ? new _sub(): _sub;
        },
        /**
         * パッケージを生成しwindowオブジェクトに割り当てます.
         * @memberOf cm.Class
         * @private
         * @param {Object} pathArray パッケージの完全な名称
         * @return {Object} 生成されたObjectオブジェクト
         */
        _getPackage:function(pathArray)
        {
            var _fullPath = "window";
            var _parentPackage = global;
            for(var i = 0, j = pathArray.length; i < j; i++)
            {
                if (_parentPackage[pathArray[i]] === undefined)
                {
                    _fullPath += "." + pathArray[i];
                    trace("create Package.", _fullPath);
                    _parentPackage[pathArray[i]] = {};
                }
              	_parentPackage = _parentPackage[pathArray[i]];
            }
            return _parentPackage;
        },
    };
    
    
    /**
     * @name cm
     * @namespace CoremindJS
     */
    global.cm = 
    {
        Class:Class,
        config:{
            trace:true
        },
        DataType:dType,
        Domain:domain,
        dump:dump,
        using:using,
        trace:trace,
        typeOf:typeOf,
    };
	global.addEventListener("load", function () {
    /*
		if (window.pageYOffset <= 1) {
			setTimeout (function () {
				scrollTo(0, 1);
			}, 10);
		}
    */
		if (typeOf(global.main) == dType.F) global.main();
	}, false);
})(window);