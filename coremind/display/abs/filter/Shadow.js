cls.exports(
    "cm.display.abs.fill.Color",
{
    /** @name cm.util */
    $name:"cm.display.abs.filter.Shadow",
    $extends:"cm.display.abs.DisplayParameters",
    $static:
    {
        PROP_INDEX:
        {
            offsetPositionX:1,
            offsetPositionY:2,
            radius         :3,
            offsetSize     :4
        }
    },
    $define:
    /** @lends cm.display.abs.filter.Shadow.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.filter.Shadow
         * @extends cm.display.abs.DisplayParameters
         */
        Shadow:function(
            offsetPositionX,
            offsetPositionY,
            radius,
            offsetSize,
            color,
            inset)
        {
            this.order = 0;//public
            this.mId = this.getRefCount();

            //don't use index 0.
            this.mParams = [-1,
                isNaN(offsetPositionX) ? 5: offsetPositionX,
                isNaN(offsetPositionY) ? 5: offsetPositionY,
                isNaN(radius) ? 5: radius,
                isNaN(offsetSize) ? 5: offsetSize];

            this.mInset = Boolean(inset);
            this.mColor = new cm.display.abs.fill.Color();
            this.editColor().argbAbs(color ? color: 0x80000080);
        },
        destroy:function() {},
        
        id:function() {
            return this.mId;
        },
        
        offsetPosition:function() {
            return this._getWrapper("offsetPositionX");
        },
        offsetPositionAbs:function(val) {
            this.offsetPositionXAbs(val);
            this.offsetPositionYAbs(val);
            return this;
        },

        offsetPositionX:function() {
            return this._getWrapper("offsetPositionX");
        },
        offsetPositionXAbs:function(val) {
            return this._setWrapperAbs("offsetPositionX", val);
        },
        offsetPositionXRel:function(val) {
            return this._setWrapperRel("offsetPositionX", val);
        },

        offsetPositionY:function() {
            return this._getWrapper("offsetPositionY");
        },
        offsetPositionYAbs:function(val) {
            return this._setWrapperAbs("offsetPositionY", val);
        },
        offsetPositionYRel:function(val) {
            return this._setWrapperRel("offsetPositionY", val);
        },
        
        radius:function() {
            return this._getWrapper("radius");
        },
        radiusAbs:function(val) {
            return this._setWrapperAbs("radius", val);
        },
        radiusRel:function(val) {
            return this._setWrapperRel("radius", val);
        },
        
        offsetSize:function() {
            return this._getWrapper("offsetSize");
        },
        offsetSizeAbs:function(val) {
            return this._setWrapperAbs("offsetSize", val);
        },
        offsetSizeRel:function(val) {
            return this._setWrapperRel("offsetSize", val);
        },
        
        isInset:function() {
            return this.mInset;
        },
        enabledInset:function()
        {
            this.mInset = true;
            this.enabledFlag(32);
            return this;
        },

        color:function() {
            return this.mColor;
        },
        editColor:function()
        {
            this.enabledFlag(64);
            return this.mColor;
        }
    },
    $override:
    {
        dumpProp:function()
        {
            this.$super("dumpProp")();
            this.log(ex.string.concat(
                "\nid:", this.id(),
                "\nOffsetPositionX:", this.OffsetPositionX(),
                "\nOffsetPositionY:", this.OffsetPositionY(),
                "\nradius:", this.radius(),
                "\noffsetSize:", this.offsetSize(),
                "\ninset:", this.mInset));
            this.log("Color");
            this.mColor.dumpProp();
        }
    }
});