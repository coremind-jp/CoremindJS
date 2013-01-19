cm.Class.create(
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.Position",
    $extends:"cm.display.abs.DisplayParameters",
    $static:
    {
        PROP_INDEX:
        {
            x        :1,
            y        :2,
            z        :3
        }
    },
    $define:
    /** @lends cm.display.abs.Position.prototype */
    {
        /**
         * レイアウトパラメータの操作インターフェースを提供します.
         * LayoutInterfaceは様々なオブジェクトにレイアウトに必要なパラメータを付加します.
         * @constructor
         * @name cm.display.abs.Position
         * @extends cm.BaseObject
         */
        Position:function() {
            //don't use index 0.
            this.mParams = [-1, 0, 0, 0];
        },
        destroy:function() {},
        
        /**
         * x座標を取得します.
         */
        x:function() {
            return this._getWrapper("x");
        },
        /**
         * x座標を絶対値で設定します.
         * @param {Number} val 値
         */
        xAbs:function(val) {
            return this._setWrapperAbs("x", val);
        },
        /**
         * x座標を相対値で設定します.
         * @param {Number} val 値
         */
        xRel:function(val) {
            return this._setWrapperRel("x", val);
        },
        
        
        /**
         * y座標を取得します.
         */
        y:function() {
            return this._getWrapper("y");
        },
        /**
         * y座標を絶対値で設定します.
         * @param {Number} val 値
         */
        yAbs:function(val) {
            return this._setWrapperAbs("y", val);
        },
        /**
         * y座標を相対値で設定します.
         * @param {Number} val 値
         */
        yRel:function(val) {
            return this._setWrapperRel("y", val);
        },
        
        
        /**
         * y座標を取得します.
         */
        z:function() {
            return this._getWrapper("z");
        },
        /**
         * y座標を絶対値で設定します.
         * @param {Number} val 値
         */
        zAbs:function(val) {
            return this._setWrapperAbs("z", val);
        },
        /**
         * y座標を相対値で設定します.
         * @param {Number} val 値
         */
        zRel:function(val) {
            return this._setWrapperRel("z", val);
        },
        
        /**
         * 文字列表現を取得します.
         */
        toString:function()
        {
            return cm.string.concat(
                "x:"          , this.x(),
                "\ny:"        , this.y(),
                "\nz:"        , this.z(),
                "\n", this.$super("toString")());
        }
    }
});