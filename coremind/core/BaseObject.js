/**
 * @class このライブラリで使用する基本クラスです.
 * @name cm.BaseObject
 */
cm.Class.create(
{
    $name:"cm.core.BaseObject",
    $extends:"Object",
    $define:
    /** @lends cm.BaseObejct.prototype */
    {
        /**
         * インスタンスの名称
         * @name tag
         * @memberOf cm.BaseObject#
         * @type String
         */
        tag:"",
        /**
         * スーパークラスのメソッドを取得します.
         * コンストラクターを取得するには文字列"initialize"を指定します.
         * @name $super
         * @param {String} methodName メソッド名
         */
        $super:function(methodName)
        {
            if (cm.equal.isUndefined(this.__currentSuper__))
            {
                this.__currentSuper__ = {};
                this.__calledCount__ = 0;
            }
            
            this.__currentSuper__[methodName] =
                cm.equal.isUndefined(this.__currentSuper__[methodName]) ?
                    cm.equal.isUndefined(this.__prevCalledMethodName__) ?
                        this.$class.superClass:
                        this.$class.superClass:
                        //this.__currentSuper__[this.__prevCalledMethodName__].superClass:
                    this.__currentSuper__[methodName].superClass;
                    
            var _method = methodName == "initialize" ?
                this.__currentSuper__[methodName].prototype.constructor:
                this.__currentSuper__[methodName].prototype[methodName];
                
            this.__prevCalledMethodName__ = methodName;
            this.__calledCount__++;
            
            var _this = this;
            return function()
                {
                    var _result = _method.apply(_this, arguments);
                    
                    //super method finish code.
                    delete _this.__currentSuper__[methodName];
                    if (methodName == "destroy")
                        delete _this.__currentSuper__;
                    if (--_this.__calledCount__ == 0)
                    {
                        delete _this.__prevCalledMethodName__;
                        //_this.log("delete _this.__prevCalledMethodName__");
                    }
                        
                    return _result;
                };
        },
        
        $bind:function(methodName)
        {
            if (cm.equal.isUndefined(this.mBindCash))
                this.mBindCash = new Object();
                
            var _this = this;
            if (cm.equal.isUndefined(this.mBindCash[methodName]))
                this.mBindCash[methodName] = function(){
                    _this.$class.prototype[methodName].apply(_this, arguments);
                };
                
            return this.mBindCash[methodName];
        },
        /**
         * コンストラクターを実行します.
         * @name BaseObject
         * @constructor
         * @function
         */
        BaseObject:function() {
            ++this.$class._instanceCounter;
        },
        /**
         * このオブジェクトの破棄処理を実行します.
         * @name destroy
         */
        destroy:function() {
            --this.$class._instanceCounter;
            this._deletePropertys();
        },
        _deletePropertys:function()
        {
            var _props = cm.object.getOwnPropertyNames(this);
            for (var i = 0, len = _props.length; i < len; i++)
            {
                var p = _props[i];
                if (p == "__prevCalledMethodName__"
                ||  p == "__calledCount__"
                ||  p == "__currentSuper__")
                    continue;
                    
                var _pValue = this[p];
                if (!_pValue)
                    continue;
                else
                if (cm.equal.isFunction(_pValue.destroy))
                    _pValue.destroy();
                else
                if (cm.equal.isObject(_pValue)
                ||  cm.equal.isArray(_pValue))
                    this._deletePropertys.call(_pValue);
                else
                {
                    this[p] = null;
                    delete this[p];
                }
            }
        },
        getClassFullName:function() {
            return cm.string.concat(this.classPath, ".", this.className);
        },
        getSuperClassFullName:function() {
            return cm.string.concat(this.superClassPath, ".", this.superClassName);
        },
        /**
         * 生成されたインスタンス数を取得します.
         * @name getRefCount
         */
        getRefCount:function() {
            return this.$class._instanceCounter;
        },
        log:function()
        {
            Array.prototype.unshift.call(arguments, this.className);
            cm.log.p.apply(this, arguments);
        },
        equal:function(val) {
            return val === this;
        }
        /**#@-*/
    }
});