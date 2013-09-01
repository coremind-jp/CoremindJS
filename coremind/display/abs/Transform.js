cls.exports(
    "cm.display.abs.Align",
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
            perspective:7
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
        Transform:function()
        {
            //don't use index 0.
            this.mParams = [-1, 1, 1, 1, 0, 0, 0];
            this.mOrigin = new cm.display.abs.Align();
            //this.mOrigin.applyCenterV().applyCenterH();
        },
        destroy:function() {},
        
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
        scaleXAbs:function(val) {
            return this._setWrapperAbs("scaleX", val);
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
        scaleYAbs:function(val) {
            return this._setWrapperAbs("scaleY", val);
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
        scaleZAbs:function(val) {
            return this._setWrapperAbs("scaleZ", val);
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
        rotationXAbs:function(val) {
            return this._setWrapperAbs("rotationX", val);
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
        rotationYAbs:function(val) {
            return this._setWrapperAbs("rotationY", val);
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
        rotationZAbs:function(val) {
            return this._setWrapperAbs("rotationZ", val);
        },
        /**
         * z軸の回転値を相対値で設定します.
         * @param {Number} val 値
         */
        rotationZRel:function(val) {
            return this._setWrapperRel("rotationZ", val);
        },
        
        /**
         * z軸の回転値を取得します.
         */
        perspective:function() {
            return this._getWrapper("perspective");
        },
        /**
         * z軸の回転値を絶対値で設定します.
         * @param {Number} val 値
         */
        perspectiveAbs:function(val) {
            return this._setWrapperAbs("perspective", val);
        },
        /**
         * z軸の回転値を相対値で設定します.
         * @param {Number} val 値
         */
        perspectiveRel:function(val) {
            return this._setWrapperRel("perspective", val);
        },
        
        /**
         * 基準値を取得します.
         */
        origin:function() {
            return this.mOrigin;
        },
        /**
         * 基準値オブジェクトを取得します.
         * @param {Number} val 値
         */
        editOrigin:function()
        {
            this.enabledFlag(256);
            return this.mOrigin;
        }
    },
    $override:
    {
        /**
         * 文字列表現を取得します.
         */
        dumpProp:function()
        {
            this.$super("dumpProp")();
            this.log(ex.string.concat(
                "\nscaleX:"    , this.scaleX(),
                "\nscaleY:"    , this.scaleY(),
                "\nscaleZ:"    , this.scaleZ(),
                "\nrotationX:" , this.rotationX(),
                "\nrotationY:" , this.rotationY(),
                "\nrotationZ:" , this.rotationZ()),
                "\nperspective:", this.perspective());
            this.mOrigin.dumpProp();
        }
    }
});