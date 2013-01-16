cm.Class.create(
{
    /** @name cm.display */
    $name:"cm.display.abs.Transform",
    $extends:"cm.display.abs.DisplayParameters",
    $static:
    {
        PROP_INDEX:
        {
            scaleX   :1,
            scaleY   :2,
            scaleZ   :3,
            rotationX:4,
            rotationY:5,
            rotationZ:6,
            originX  :7,
            originY  :8
        },
        TWEEN_ACCESSOR:
        {
            x: {
                get:"x",
                set:"xFix"
            }
        }
    },
    $define:
    /** @lends cm.display.abs.Transform.prototype */
    {
        /**
         * レイアウトパラメータの操作インターフェースを提供します.
         * LayoutInterfaceは様々なオブジェクトにレイアウトに必要なパラメータを付加します.
         * @constructor
         * @name cm.display.abs.Transform
         * @extends cm.BaseObject
         */
        Transform:function() {
            //don't use index 0.
            this.mParams = [-1, 1, 1, 1, 0, 0, 0, 0, 0];
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
        xFix:function(val) {
            return this._setWrapperFix("x", val);
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
        yFix:function(val) {
            return this._setWrapperFix("y", val);
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
        zFix:function(val) {
            return this._setWrapperFix("z", val);
        },
        /**
         * y座標を相対値で設定します.
         * @param {Number} val 値
         */
        zRel:function(val) {
            return this._setWrapperRel("z", val);
        },
        
        
        /**
         * x軸のスケールを取得します.
         */
        scaleX:function() {
            return this._getWrapper("scaleX");
        },
        /**
         * x軸のスケールを絶対値で設定します.
         * @param {Number} val 値
         */
        scaleXFix:function(val) {
            return this._setWrapperFix("scaleX", val);
        },
        /**
         * x軸のスケールを相対値で設定します.
         * @param {Number} val 値
         */
        scaleXRel:function(val) {
            return this._setWrapperRel("scaleX", val);
        },
        
        
        /**
         * y軸のスケールを取得します.
         */
        scaleY:function() {
            return this._getWrapper("scaleY");
        },
        /**
         * y軸のスケールを絶対値で設定します.
         * @param {Number} val 値
         */
        scaleYFix:function(val) {
            return this._setWrapperFix("scaleY", val);
        },
        /**
         * y軸のスケールを相対値で設定します.
         * @param {Number} val 値
         */
        scaleYRel:function(val) {
            return this._setWrapperRel("scaleY", val);
        },
        
        
        /**
         * z軸のスケールを取得します.
         */
        scaleZ:function() {
            return this._getWrapper("scaleZ");
        },
        /**
         * z軸のスケールを絶対値で設定します.
         * @param {Number} val 値
         */
        scaleZFix:function(val) {
            return this._setWrapperFix("scaleZ", val);
        },
        /**
         * z軸のスケールを相対値で設定します.
         * @param {Number} val 値
         */
        scaleZRel:function(val) {
            return this._setWrapperRel("scaleZ", val);
        },
        
        
        /**
         * x軸の回転値を取得します.
         */
        rotationX:function() {
            return this._getWrapper("rotationX");
        },
        /**
         * x軸の回転値を設定します.
         * @param {Number} val 値
         */
        rotationXFix:function(val) {
            return this._setWrapperFix("rotationX", val);
        },
        /**
         * x軸の回転値を設定します.
         * @param {Number} val 値
         */
        rotationXRel:function(val) {
            return this._setWrapperRel("rotationX", val);
        },
        
        
        /**
         * y軸の回転値を取得します.
         */
        rotationY:function() {
            return this._getWrapper("rotationY");
        },
        /**
         * y軸の回転値を絶対値で設定します.
         * @param {Number} val 値
         */
        rotationYFix:function(val) {
            return this._setWrapperFix("rotationY", val);
        },
        /**
         * y軸の回転値を相対値で設定します.
         * @param {Number} val 値
         */
        rotationYRel:function(val) {
            return this._setWrapperRel("rotationY", val);
        },
        
        
        /**
         * z軸の回転値を取得します.
         */
        rotationZ:function() {
            return this._getWrapper("rotationZ");
        },
        /**
         * z軸の回転値を絶対値で設定します.
         * @param {Number} val 値
         */
        rotationZFix:function(val) {
            return this._setWrapperFix("rotationZ", val);
        },
        /**
         * z軸の回転値を相対値で設定します.
         * @param {Number} val 値
         */
        rotationZRel:function(val) {
            return this._setWrapperRel("rotationZ", val);
        },
        
        
        /**
         * x軸の基準値を取得します.
         */
        originX:function() {
            return this._getWrapper("originX");
        },
        /**
         * x軸の基準値を絶対値で設定します.
         * @param {Number} val 値
         */
        originXFix:function(val) {
            return this._setWrapperFix("originX", val);
        },
        /**
         * x軸の基準値を相対値で設定します.
         * @param {Number} val 値
         */
        originXRel:function(val) {
            return this._setWrapperRel("originX", val);
        },
        
        
        /**
         * x軸の基準値を取得します.
         */
        originY:function() {
            return this._getWrapper("originY");
        },
        /**
         * x軸の基準値を絶対値で設定します.
         * @param {Number} val 値
         */
        originYFix:function(val) {
            return this._setWrapperFix("originY", val);
        },
        /**
         * x軸の基準値を相対値で設定します.
         * @param {Number} val 値
         */
        originYRel:function(val) {
            return this._setWrapperRel("originY", val);
        },
        
        
        /**
         * 文字列表現を取得します.
         */
        toString:function()
        {
            return cm.string.concat(
                "scaleX:"   , this.scaleX(),
                "\nscaleY:"   , this.scaleY(),
                "\nscaleZ:"   , this.scaleZ(),
                "\nrotationX:", this.rotationX(),
                "\nrotationY:", this.rotationY(),
                "\nrotationZ:", this.rotationZ(),
                "\noriginX:"  , this.originX(),
                "\noriginY:"  , this.originY(),
                "\n", this.$super("toString")());
        }
    }
});