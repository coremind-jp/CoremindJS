cls.exports(
//import
    "cm.display.abs.fill.Color",
    "cm.util.Bitflag",
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.DisplayParameters",
    $extends:"cm.util.Bitflag",
    $define:
    /** @lends cm.display.abs.DisplayParameters.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.DisplayParameters
         * @extends cm.BaseObject
         */
        DisplayParameters:function()
        {
            //set method alias
            this.isChanged = this.isEnabledAnyFlags;
            this.applied = this.reset;
        },
        destroy:function() {},
        dumpProp:function(){
            this.$super("dumpFlag")();
        },
        /**
         * パラメータ取得ラッパー
         * @param {String} propName プロパティー名
         * @return {Number} 設定値
         */
        _getWrapper:function(propName)
        {
            return this.mParams[this.$class.PROP_INDEX[propName]];
        },
        /**
         * パラメータ絶対値設定ラッパー
         * @param {String} propName プロパティー名
         * @param {Number} 設定値
         * @return {Object} このオブジェクト
         */
        _setWrapperAbs:function(propName, val)
        {
            var _params = this.mParams;
            var _idxObject = this.$class.PROP_INDEX;
            if (_params[_idxObject[propName]] != val)
            {
                this.enabledFlag(Math.pow(2, _idxObject[propName]));
                _params[_idxObject[propName]] = val;
            }
            return this;
        },
        /**
         * パラメータ相対値設定ラッパー
         * @param {String} propName プロパティー名
         * @param {Number} 設定値
         * @return {Object} このオブジェクト
         */
        _setWrapperRel:function(propName, val)
        {
            var _params = this.mParams;
            var _idxObject = this.$class.PROP_INDEX;
            if (val != 0)
            {
                this.enabledFlag(Math.pow(2, _idxObject[propName]));
                _params[_idxObject[propName]] += val;
            }
            return this;
        }
    }
});