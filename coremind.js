/**
 * @fileOverview
 * @url https://github.com/otn83/CoremindJS
 * @author otn83 nakahara@coremind.jp
 * @version 0.2.0(beta)
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 */
(function(global)
{
    if (isUndefined(global.cm))
        logE("It is necessary to load manifest.js before this file.");
        
    var manifest = global.cm;
    var dType = {
        S:"string",
        N:"number",
        B:"boolean",
        F:"function",
        O:"object",
        A:"array"
    };
    function typeOf(val)
    {
        if (isNull(val) || isUndefined(val)) return val;
        else if (isBoolean(val)) return dType.B;
        else if (isNumber(val)) return dType.N;
        else if (isString(val)) return dType.S;
        else if (isArray(val)) return dType.A;
        else if (isFunction(val)) return dType.F;
        else if (isObject(val)) return dType.O;
        else return typeof val;
    }
    function isBoolean(val) {
        return typeof val == dType.B || val instanceof Boolean;
    }
    function isNumber(val) {
        return typeof val == dType.N || val instanceof Number;
    }
    function isString(val) {
        return typeof val == dType.S || val instanceof String;
    }
    function isArray(val) {
        return typeof val == dType.A || val instanceof Array;
    }
    function isFunction(val) {
        return typeof val == dType.F || val instanceof Function;
    }
    function isObject(val) {
        return typeof val == dType.O && !(val instanceof Array) && val instanceof Object;
    }
    function isUndefined(val) {
        return val === undefined;
    }
    function isNull(val) {
        return val === null;
    }
    function concat() {
        var result = "";
        for(var i = 0, len = arguments.length; i < len; i ++)
            result += arguments[i];
        return result;
    }
    function clone(from, to)
    {
        for(var p in from) to[p] = from[p];
        return to;
    }
    function indexOf(object)
    {
        for(var i = 0, len = this.length; i < len; i ++)
            if (this[i] === object)
                return i;
        return -1;
    }
    function getOwnPropertyNames(object)
    {
        try { return Object.getOwnPropertyNames(object); }
        catch (e)
        {
            var _result = [];
            for (var p in object)
                if (object.hasOwnProperty(p))
                    _result.push(p);
            return _result;
        }
    }
    function capitalize(str) {
        return str.toLowerCase().replace(/^\w/, function(val) { return val.toUpperCase(); });
    }
    function log() {
        console.log(getArrayString.apply(this, arguments));
    }
    function logD() {
        Array.prototype.unshift.call(arguments, "DEBUG|");
        console.log(getArrayString.apply(this, arguments));
    }
    function log$()
    {
        Array.prototype.unshift.call(arguments, "DEV|");
        console.log(getArrayString.apply(this, arguments));
    }
    function logW() {
        console.warn(getArrayString.apply(this, arguments));
    }
    function logE() {
        throw new Error(getArrayString.apply(this, arguments));
    }
    function getArrayString() {
        var _result = arguments.length == 0 ? "": arguments[0];
        for(var i = 1, len = arguments.length; i < len; i ++)
        {
            _result += " ";
            _result += arguments[i];
        }
        return _result;
    }
    function dump(val, prefix, max, now)
    {
        now = isUndefined(now) ? 0: now;
        max = isUndefined(max) ? 0: max;
        
        prefix = prefix ? prefix + "  " : "  ";
        if (isNull(val) || isUndefined(val))
            logD(prefix, val);
        
        for (var p in val)
        {
            if (isFunction(val[p]))
                logD(prefix, p, "function {}");
            else
            if (isObject(val[p]) && max >= 1+now)
            {
                logD(prefix, "property [", p, "]");
                dump(val[p], prefix + "  ", max, 1+now);
            }
            else
                logD(prefix, p, " ", val[p]);
        }
    }
    function assert(text, fn, expected)
    {
        var _result = fn();
        _result == expected ?
            log(text, ":", _result, "===", expected):
            logW(text, ":", _result, "!==", expected);
    }
    /**
     * パッケージオブジェクトを取得します.
     * オブジェクトが存在しない場合パッケージを生成します.
     * @private
     * @param {String} classPpath パッケージの完全な名称
     * @return {Object} 生成されたObjectオブジェクト
     */
    function getPackage(className)
    {
        var _fullPath = "global";
        var _parentPackage = global;
        var _pathArray = className.split(".");
        for(var i = 0, j = _pathArray.length; i < j; i++)
        {
            _fullPath += concat(".", _pathArray[i]);
            if (isUndefined(_parentPackage[_pathArray[i]]))
            {
                _parentPackage[_pathArray[i]] = {};
                log$("create package:", _fullPath);
            }
            _parentPackage = _parentPackage[_pathArray[i]];
        }
        return _parentPackage;
    }
    function popupSaveDialog(context, filename) //chrome only
    {
        var d = document;
        var e = d.createEvent("MouseEvents");
        e.initMouseEvent('click');
        var a = d.createElement("a");
       a.href = "data:text/plain," + encodeURIComponent(context);
        a.download = filename;
        a.dispatchEvent(e);
    }

    var Class =
    {
        TAG:"Class|",
        mImportFiles:[],
        mJoinedSource:"",
        mRegistedClass:{},
        mClassDefines:{},
        profile:function()
        {
            logD(this.TAG, "profile");
            for(var p in this.mRegistedClass)
            {
                var _classObject = this.mRegistedClass[p].prototype;
                var _counter = _classObject.getRefCount();
                if (_counter > 0)
                    logD(concat(_classObject.classPath, ".", _classObject.className), _counter);
            }
        },
        get:function(className)
        {
            if (isUndefined(this.mRegistedClass[className]))
            {
                var _classPath = className.split(".");
                var _className = _classPath.pop();
                var _pkg = getPackage(_classPath.join("."));
                return _pkg[_className];
            }
            else
                return this.mRegistedClass[className];
        },
        importJsFile:function (className)
        {
            if (isUndefined(Class.get(className))
            && !manifest.isJoinedSource)
            {
                var _classPath = className.split(".");
                var _className = _classPath.pop();
                var _pkg = getPackage(_classPath.join("."));
                var _domain = _classPath.shift();
                var _jsPath = [manifest.domain[_domain], _classPath.join("/"), "/", _className, ".js"].join("");
                log$("impoet js File:", _jsPath);
                document.write(concat('<script type="text/javascript" src="' ,_jsPath, '"></script>'));
                this.mImportFiles.push(_jsPath);
                _pkg[_className] = "defined";//set flag
            }
        },
        getJoinedSource:function (callback)
        {
            var finish = function()
            {
                isFunction(callback) ?
                    callback(Class.mJoinedSource):
                    popupSaveDialog(Class.mJoinedSource, manifest.joinedSource.name);
            };
            var xhrOnLoad = function()
            {
                result += (result == "" ? "": "\n") + this.responseText;
                this.onload = null;
                this.abort();
                if (++loaded == total)
                {
                    Class.mJoinedSource = result;
                    finish();
                }
            };
            
            if (Class.mJoinedSource != "")
                finish();
            else
            {
                var result = "";
                var total = 0;
                var loaded = 0;
                for (var i = 0, len = this.mImportFiles.length; i < len; i++)
                {
                    var xhr = new XMLHttpRequest();
                    xhr.onload = xhrOnLoad;
                    xhr.open("POST", this.mImportFiles[i], true);
                    xhr.send(null);
                    total++;
                }
            }
        },
        getSnippetTemplate:function ()
        {
            var oldFile, newFile;
            var xhrNewFileOnLoad = function()
            {
                this.onload = null;
                this.abort();
                logD(Class.mJoinedSource);
                popupSaveDialog(this.responseText, manifest.snippetSource.name);
            };
            var convert = function(source)
            {
                var xhr = new XMLHttpRequest();
                xhr.onload = xhrNewFileOnLoad;
                xhr.open("POST",
                    manifest.snippetGenerator.path +
                    manifest.snippetGenerator.name, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("newFile=" + escape(source) + "&oldFile=" + oldFile);
            };
            var xhrOldFileOnLoad = function()
            {
                oldFile = this.responseText;
                this.onerror = this.onload = null;
                this.abort();
                cm.Class.getJoinedSource(convert);
            };
            var xhrOldFileOnError = function()
            {
                oldFile = "";
                this.onerror = this.onload = null;
                this.abort();
                cm.Class.getJoinedSource(convert);
            };
            
            var xhr = new XMLHttpRequest();
            xhr.onload = xhrOldFileOnLoad;
            xhr.onerror = xhrOldFileOnError;
            xhr.open("GET",
                manifest.snippetSource.path +
                manifest.snippetSource.name, true);
            xhr.send(null);
        },
        create:function()
        {
            var _classDefine = arguments[arguments.length - 1];
            
            if (isUndefined(_classDefine.$extends))
                _classDefine.$extends = "cm.core.BaseObject";
                
            this._checkDefine(_classDefine);
            this._attach$Import.apply(this, arguments);
            
            this.mClassDefines ?
                this.mClassDefines[_classDefine.$name] = _classDefine://preload
                this._register(_classDefine, this._create(_classDefine));//runtime
        },
        _checkDefine:function(classDefine)
        {
            var _name = classDefine.$name;
            if (!isString(_name))
                logE("$name is not String. ", _name);
            if (!isFunction(classDefine.$define[classDefine.$name.split(".").pop()]))
                logE(_name, "method[constructor] is undefined.");
            if (!isFunction(classDefine.$define.destroy))
                logE(_name, "method[destroy] is undefined.");
            if (!isString(classDefine.$extends))
                logE("$extends is not String. " + classDefine.$extends);
        },
        _attach$Import:function()
        {
            var _len = arguments.length;
            var _classDefine = arguments[_len - 1];
            _classDefine.$import = [_classDefine.$extends];
            
            if (_classDefine.$extends !== "Object")
                this.importJsFile(_classDefine.$extends);
            
            for(var i = 0, len = _len - 1; i < len; i ++)
            {
                if (isString(arguments[i]))
                {
                    _classDefine.$import.push(arguments[i]);
                    this.importJsFile(arguments[i]);
                }
            }
        },
        load:function()
        {
            var _len = arguments.length;
            var _completeFunction = arguments[_len - 1];
            var onLoad = function() {
                //global.removeEventListener(this);
                Class._onLoad();
                _completeFunction.call(global);
            };
            
            if (!manifest.isJoinedSource)
                for(var i = 0, len = _len - 1; i < len; i ++)
                    if (isString(arguments[i])) this.importJsFile(arguments[i]);
            
            global.addEventListener ?
                global.addEventListener("load", onLoad, false)://other
                global.attachEvent("onload", onLoad);//IE
        },
        _onLoad:function()
        {
            log$("loadComplete");
            var _baseObjectDef = this.mClassDefines["cm.core.BaseObject"];
            var _userAgentDef = this.mClassDefines["cm.core.UserAgent"];
            this._register(_baseObjectDef, this._create(_baseObjectDef));
            this._register(_userAgentDef, this._create(_userAgentDef));
            this._registerAllDefines();
            delete this.mClassDefines;
        },
        _registerAllDefines:function()
        {
            var p;
            for (p in this.mClassDefines)
            {
                var _classDefine = this.mClassDefines[p];
                if (this._isAllowRegisterClass(_classDefine))
                    this._register(_classDefine, this._create(_classDefine));
            }
            for (p in this.mClassDefines)
                return this._registerAllDefines();
        },
        _isAllowRegisterClass:function(classDefine)
        {
            if (isUndefined(this.mRegistedClass[classDefine.$extends]))
                return false;
            else
            if (classDefine.$singleton)
                for(var i = 0, len = classDefine.$import.length; i < len; i++)
                    if (isUndefined(this.mRegistedClass[classDefine.$import[i]]))
                        return false;
            return true;
        },
        _create:function(classDefine)
        {
            var _classPathArray = classDefine.$name.split(".");
            this._className = _classPathArray.pop();//*
            this._classPath = _classPathArray.join(".");//*
            
            var _classObject = this._createPlainClass(classDefine);
            this._copySuperClassPrototype(classDefine, _classObject);
            this._copySubClassPrototype(classDefine, _classObject);
            this._copyStaticMember(classDefine, _classObject);
            if (classDefine.$name != "cm.core.BaseObject")
            {
                this._tryOverrideConstructor(_classObject);
                this._tryOverrideDestroy(_classObject);
            }
            return _classObject;
        },
        _createPlainClass:function(classDefine)
        {
            var _className = this._className;
            var _classFullName = concat(this._classPath, ".", _className);
            var _classObject = function() { this[_className].apply(this, arguments); };
            
            _classObject.superClass = this._getSuperClass(classDefine.$extends);
            _classObject.toString = function() { return _classFullName; };
            _classObject.equal = function(instance)
            {
                while (!isUndefined(instance)
                && isFunction(instance.getClassFullName))
                    if (_classFullName === instance.getClassFullName()) return true;
                    else instance = instance.$class.superClass.prototype;
                return false;
            };
            _classObject.prototype.$class = _classObject;
            return _classObject;
        },
        _copySuperClassPrototype:function(classDefine, classObjct)
        {
            var _superClass = classObjct.superClass;
            var _classObjctPrototype = classObjct.prototype;
            var _superClassPrototype = _superClass.prototype;
            var p;
            //prototype member
            for(p in _superClassPrototype)
                if (p != "$class")
                    _classObjctPrototype[p] = _superClassPrototype[p];
                
            //static member
            for(p in _superClass)
                if (p != "superClass" && p != "toString" && p != "equal")
                    classObjct[p] = _superClass[p];
        },
        _getSuperClass:function(superClass) {
            return superClass === "Object" ? function(){}: this.get(superClass);
        },
        _copySubClassPrototype:function(classDefine, classObjct)
        {
            var _classObjctPrototype = classObjct.prototype;
            var _subClassDefine = classDefine.$define;
            var _classPath = classDefine.$name.split(".");
            var _superClassPath = classDefine.$extends.split(".");
            
            for(var p in _subClassDefine)
                _classObjctPrototype[p] = _subClassDefine[p];
                
            _classObjctPrototype.className = _classPath.pop();
            _classObjctPrototype.classPath = _classPath.join(".");
            
            _classObjctPrototype.superClassName = _superClassPath.pop();
            _classObjctPrototype.superClassPath = _superClassPath.join(".");
        },
        _copyStaticMember:function(classDefine, classObjct)
        {
            var _staticObject = classDefine.$static;
            if (!isUndefined(_staticObject))
                for (var p in _staticObject)
                    classObjct[p] =
                        isString(_staticObject[p])
                        && _staticObject[p].match(/^\$eval\:/) ?
                            eval(_staticObject[p]):
                            _staticObject[p];
        },
        _tryOverrideConstructor:function(classObjct)
        {
            var _proto = classObjct.prototype;
            var _constructorString = _proto[_proto.className].toString();
            if (!_constructorString.match(/this\.\$super\(.?["|']initialize["|'].?\)/))
            {
                var _superClassPrototype = cm.Class.get(_proto.getSuperClassFullName()).prototype;
                var _superClassConstructor = _superClassPrototype[_proto.superClassName];
                var _subClassConstructor = _proto[_proto.className];
                _proto[_proto.className] = function()
                {
                    _superClassConstructor.apply(this, arguments);
                    _subClassConstructor.apply(this, arguments);
                };
            }
        },
        _tryOverrideDestroy:function(classObjct)
        {
            var _proto = classObjct.prototype;
            var _destroyString = _proto.destroy.toString();
            if (!_destroyString.match(/this\.\$super\(.?["|']destroy["|'].?\)/))
            {
                var _superClassPrototype = cm.Class.get(_proto.getSuperClassFullName()).prototype;
                var _superClassDestroy = _superClassPrototype.destroy;
                var _subClassDestroy = _proto.destroy;
                _proto.destroy = function()
                {
                    _subClassDestroy.apply(this, arguments);
                    _superClassDestroy.apply(this, arguments);
                };
            }
        },
        _register:function(classDefine, classObject)
        {
            var _pkg = getPackage(this._classPath);
            _pkg[this._className] = classObject;
            
            if (classDefine.$singleton)
            {
                _pkg[this._className] = new classObject();
                _pkg[this._className]._instanceCounter = 1;
                for (var p in classObject)
                {
                    _pkg[this._className][p] = classObject[p];
                    delete classObject[p];
                }
            }
            else
                classObject._instanceCounter = 0;
            
            this.mRegistedClass[classDefine.$name] = classObject;
            if (this.mClassDefines) delete this.mClassDefines[classDefine.$name];
            log$(this.TAG, "registed:", concat(this._classPath, ".", this._className));
        }
    };
    
    if (!manifest.enabledLog)
        log = logD = logW = logE = log$ = dump = function(){};
    
    global.cm = {
        manifest:manifest,
        Class:Class,
        equal:{
            isBoolean:isBoolean,
            isNumber:isNumber,
            isString:isString,
            isArray:isArray,
            isFunction:isFunction,
            isObject:isObject,
            isNull:isNull,
            isUndefined:isUndefined,
            typeOf:typeOf
        },
        log:{
            dump:dump,
            p:log,
            d:logD,
            w:logW,
            e:logE,
            $:log$//develope
        },
        array:{
            indexOf:indexOf
        },
        object:{
            clone:clone,
            getOwnPropertyNames:getOwnPropertyNames
        },
        string:{
            concat:concat,
            capitalize:capitalize
        },
        dataType:dType,
        assert:assert
    };
    
    //IE hasn't Array.indexOf method
    if (isUndefined(Array.prototype.indexOf))
        Array.prototype.indexOf = indexOf;
    
    if (manifest.isJoinedSource)
        document.write(concat(
            '<script type="text/javascript" src="',
            manifest.joinedSource.path,
            manifest.joinedSource.name,
            '"></script>'));
    else
    {
        cm.Class.importJsFile("cm.core.BaseObject");
        cm.Class.importJsFile("cm.core.UserAgent");
    }
})(window);