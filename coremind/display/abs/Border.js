cm.Class.create(
//import
    "cm.display.abs.fill.Color",
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.Border",
    $extends:"cm.display.abs.DisplayParameters",
    $static:{
        PROP_INDEX:
        {
            weight:1,
            style:2
        },
        SOLID:0,
        DASH:1,
        DOT:2,
        DOUBLE:3
    },
    $define:
    /** @lends cm.display.abs.Border.prototype */
    {
        /**
         * @constructor
         * @name cm.display.Border
         * @extends cm.BaseObject
         */
        Border:function()
        {
            //don't use index 0.
            this.mParams = [-1, 0, 0];
            this.mColor = new cm.display.abs.fill.Color(0xFFFFFFFF);
        },
        destroy:function() {},
        
        /**
         */
        weight:function() {
            return this._getWrapper("weight");
        },
        /**
         */
        weightAbs:function(val) {
            return this._setWrapperAbs("weight", val);
        },
        /**
         */
        weightRel:function(val) {
            return this._setWrapperRel("weight", val);
        },
        
        
        /**
         */
        style:function() {
            return this._getWrapper("style");
        },
        /**
         */
        setStyle:function(val) {
            return this._setWrapperAbs("style", val);
        },
        
        
        /**
         */
        color:function(index) {
            return this.mColor;
        },
        /**
         */
        editColor:function()
        {
            this.enabledFlag(8);
            return this.mColor;
        }

    }
});