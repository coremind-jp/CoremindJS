/**
 * @author h.nakahara
 */
(function(global)
{
	/**
	 * データ型定数
	 */
	var dType = {
    	S:"string",
    	N:"number",
    	B:"boolean",
    	F:"function",
    	O:"object",
    	A:"array"
    };
    /**
     * valのタイプを示す値を返します.
     * @param val 任意のデータ
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
            if (val.toString
            &&  val.toString == "function () { return _className; }")
                return val.toString();
            else
            if (val instanceof Object)
                return dType.O;
        }
        else
            return _type;
    };
    /**
     * 可変長引数に対応したconsole.logです.
     * cm.config.traceの値をtrueにする事で使用できます。
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
     * Objectをダンプします.
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
     * 
     */
    var $import = function(className)
    {
        var _classPath = className.split(".");
        var _className = _classPath.pop();
        var _pkg = Class._getPackage(_classPath);
        if (_pkg[_className] === undefined)
        {
            _classPath.shift(); //delete "cm"
            var _jsPath = ["./coremind/", _classPath.join("/"), "/", _className, ".js"].join(""); 
            document.write('<script type="text/javascript" src="' + _jsPath + '"></script>');  
        }
        return _pkg[_className];
    };
    /**
     * このライブラリで使用する基本クラスです.
     */
    var BaseObject = function()
    {
        this.name = "";
        this.__initialize.apply(this, arguments);
    };
    BaseObject.prototype.__instanceCounter = 0;
    BaseObject.prototype.__initialize = function() { this.BaseObject.apply(this, arguments); };
    BaseObject.prototype.BaseObject   = function() { ++BaseObject.prototype.__instanceCounter; };
    BaseObject.prototype.destroy      = function() { --BaseObject.prototype.__instanceCounter; };
    BaseObject.prototype.toString     = function() { return "BaseObject"; };
    BaseObject.prototype.getRefCount  = function() { return BaseObject.prototype.__instanceCounter; };
    /**
     * クラスを生成するためのClassパッケージです.
     */
    var Class =
    {
        /**
         * 生成されたクラスオブジェクトを格納する配列です.
         */
        all:[BaseObject],
        /**
         * クラスから生成されたインスタンスの数を出力します.(参照カウンター)
         * new演算子で数を繰り上げ, インスタンスのdestroyメソッドの呼び出しで繰り下げます。
         * サブクラスをnewした場合スーパークラスも数が繰り上がります。
         */
        profile:function()
        {
            for(var i = 0, j = this.all.length; i < j; i++)
                if (this.all[i].prototype.getRefCount() > 0)
                    trace(this.all[i].prototype.toString(), this.all[i].prototype.getRefCount());
        },
        /**
         * クラスを生成します.
         * @param {String} className 生成するクラスの名前(パッケージ名も含めた完全な名称)
         * @param {Object, Class} superClass 生成するクラスのスーパークラス、　必要ない場合は生成するクラスの定義オブジェクト
         * @param {Object} subClassDefine 生成するクラスの定義オブジェクト（生成するクラスにスーパークラスがない場合、空）
         */
        create : function()
        {
            //arguments check
            if (typeof arguments[0] != dType.S)
                throw new Error("Class name is not difined." + arguments);
                
            var _classPath = Array.prototype.shift.apply(arguments).split(".");
            var _className = _classPath.pop();
            
            if ((arguments.length == 1 && (typeOf(arguments[0]) != dType.O || typeOf(arguments[0][_className]) != "function"))
            ||  (arguments.length == 2 && (typeOf(arguments[1]) != dType.O || typeOf(arguments[1][_className]) != "function")))
                throw new Error("Constructor is not difined." + arguments);
                
            if (arguments.length == 2)
            {
                superClass     = arguments[0];
                subClassDefine = arguments[1];
            }
            else
            {
                superClass     = BaseObject;
                subClassDefine = arguments[0];
            }
            
            //copy super class
            var _prototypeClone = function(){};
            _prototypeClone.prototype = superClass;
            var _super = new _prototypeClone();
            
            //create sub class
            var _sub = this._getPackage(_classPath)[_className] = this.all[this.all.length] = function(){
                this.__initialize.apply(this, arguments);
            };
            
            //attach prototype
            _sub.prototype = subClassDefine;
            
            //override prototype member
            //参照カウンタ
            _sub.prototype.__instanceCounter = 0;
            /**
             * インスタンス名
             */
            _sub.prototype.name = "";
            /**
             * 参照カウンタを取得します.
             * @param 
             */
            _sub.prototype.getRefCount = function() { return _sub.prototype.__instanceCounter; };
            /**
             * クラス名を取得します.
             */
            _sub.prototype.toString = function() { return _className; };
            /**
             * クラスパスを取得します.
             */
            _sub.prototype.classPath = function() { return _classPath.join("."); };
            /**
             * classObjectがこのクラスのインスタンスかを示す値を返します.
             * スーパークラスだった場合でもtrueを返します。
             */
            _sub.prototype.is = function(classObject)
            {
                if (classObject.prototype.toString() == "BaseObject")
                    return true;
                else
                if (typeOf(_super.prototype.is) == "function"
                && _super.prototype.is(classObject))
                    return true;
                else
                if (classObject.prototype.toString() === this.toString())
                    return true;
                else
                    return false;
            };
            
            //create super method
            var _superClassName = _super.prototype.toString();
            var _constructor = _super.prototype[_superClassName];
            if (typeOf(_constructor) == "function")
                delete _sub.prototype[_superClassName];
            /**
             * スーパークラスのメソッドを呼び出します.
             */
            _sub.prototype.super = function()
            {
                var _methodName = Array.prototype.shift.apply(arguments);
                if (_methodName == "constructor")
                    _super.prototype.__initialize.apply(this, arguments);
                //if (_methodName == "constructor" && typeOf(_constructor) == "function")
                    //_constructor.apply(this, arguments);
                else
                {
                    try { return _super.prototype[_methodName].apply(this, arguments); }
                    catch (e) { trace(_methodName, "is not defined method.", e); };
                }
            };
            
            //create override method
            for (var member in _super.prototype)
            {
                //destroy
                if (member == "destroy")
                {
                    var _destroy = function()
                    {
                        _super.prototype.destroy.apply(this, arguments);
                        _sub.prototype.__instanceCounter--;
                    };
                    
                    if (typeOf(_sub.prototype.destroy) == "function")
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
            _sub.prototype.__initialize = function()
            {
                _super.prototype.__initialize.apply(this, arguments);
                this[_className].apply(this, arguments);
                _sub.prototype.__instanceCounter++;
            };
        },
        /**
         * パッケージを生成しwindowオブジェクトに割り当てます.
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
     * @namespace cm
     */
    global.cm = {
        Class:Class,
        config:{
            trace:true
        },
        DataType:dType,
        dump:dump,
        $import:$import,
        trace:trace,
        $typeof:typeOf,
    };
	global.addEventListener("load", function () {
		if (window.pageYOffset <= 1) {
			setTimeout (function () {
				scrollTo(0, 1);
			}, 10);
		}
		if (typeOf(global.main) == dType.F) global.main();
	}, false);
})(window);