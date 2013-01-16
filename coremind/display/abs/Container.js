cm.Class.create(
//import
    "cm.display.abs.fill.PresetShape",
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.Container",
    $extends:"cm.display.abs.DisplayParameters",
    $static:
    {
        PROP_INDEX:
        {
            width :1,
            height:2,
            contentWidth:3,
            contentHeight:4
        }
    },
    $define:
    /** @lends cm.display.abs.Container.prototype */
    {
        /**
         * @constructor
         * @name cm.display.LayoutInterface
         * @extends cm.BaseObject
         */
        Container:function()
        {
            //don't use index 0.
            this.mParams = [-1, 0, 0];
            this.mShape = new cm.display.abs.fill.PresetShape();
        },
        destroy:function() {},
        
        createTweenParameters:function(property, to, from)
        {
            if (property == "width" || property == "height")
                return this.$super("createTweenParameters");
            
            var _this = this, 
            from = cm.equal.isUndefined(from) ? this.shape()[property](): from;
            return {
                begin: from,
                distance: to - from,
                setter: function(val) {
                    _this.editShape()[_methodName](property == "round" ? "applyRound": p);
                }
            }
        },
        
        /**
         * 横幅を取得します.
         */
        width:function() {
            return this._getWrapper("width");
        },
        /**
         * 横幅を絶対値で設定します.
         * @param {Number} val 値
         */
        widthFix:function(val) {
            return this._setWrapperFix("width", val);
        },
        /**
         * 横幅を相対値で設定します.
         * @param {Number} val 値
         */
        widthRel:function(val) {
            return this._setWrapperRel("width", val);
        },
        
        
        /**
         * 縦幅を取得します.
         */
        height:function() {
            return this._getWrapper("height");
        },
        /**
         * 縦幅を絶対値で設定します.
         * @param {Number} val 値
         */
        heightFix:function(val) {
            return this._setWrapperFix("height", val);
        },
        /**
         * 縦幅を相対値で設定します.
         * @param {Number} val 値
         */
        heightRel:function(val) {
            return this._setWrapperRel("height", val);
        },
        
        
        /**
         * 横幅を取得します.
         */
        contentWidth:function() {
            return this._getWrapper("contentWidth");
        },
        /**
         * 横幅を絶対値で設定します.
         * @param {Number} val 値
         */
        contentWidthFix:function(val) {
            return this._setWrapperFix("contentWidth", val);
        },
        /**
         * 横幅を相対値で設定します.
         * @param {Number} val 値
         */
        contentWidthRel:function(val) {
            return this._setWrapperRel("contentWidth", val);
        },
        
        
        /**
         * 縦幅を取得します.
         */
        contentHeight:function() {
            return this._getWrapper("contentHeight");
        },
        /**
         * 縦幅を絶対値で設定します.
         * @param {Number} val 値
         */
        contentHeightFix:function(val) {
            return this._setWrapperFix("contentHeight", val);
        },
        /**
         * 縦幅を相対値で設定します.
         * @param {Number} val 値
         */
        contentHeightRel:function(val) {
            return this._setWrapperRel("contentHeight", val);
        },
        
        
        /**
         */
        shape:function() { return this.mShape; },
        /**
         */
        editShape:function()
        {
            this.enabledFlag(32);
            return this.mShape;
        },
        
        
        /**
         * 文字列表現を取得します.
         */
        toString:function()
        {
            return cm.string.concat(
                "\nwidth:"        , this.width(),
                "\nheight:"       , this.height(),
                "\ncontentWidth:" , this.contentWidth(),
                "\ncontentHeight:", this.contentHeight(),
                "\n", this.$super("toString")());
        }
    }
});