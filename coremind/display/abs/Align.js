cls.exports(
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.Align",
    $define:
    /** @lends cm.display.abs.Align.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.Align
         * @extends cm.BaseObject
         */
        Align:function() {
            this.mVertical = this.mHorizontal = 0;
        },
        destroy:function() {},
        
        horizontal:function() {
            return this.mHorizontal;
        },
        horizontalAbs:function(val) {
            this.mHorizontal = val;
            return this;
        },
        horizontalRel:function(val) {
            this.mHorizontal += val;
            return this;
        },

        vertical:function() {
            return this.mVertical;
        },
        verticalAbs:function(val) {
            this.mVertical = val;
            return this;
        },
        verticalRel:function(val) {
            this.mVertical += val;
            return this;
        },

        applyLeft:function() {
            this.mHorizontal = 0;
            return this;
        },
        applyCenterH:function() {
            this.mHorizontal = .5;
            return this;
        },
        applyRight:function() {
            this.mHorizontal = 1;
            return this;
        },
        
        applyTop:function() {
            this.mVertical = 0;
            return this;
        },
        applyCenterV:function() {
            this.mVertical = .5;
            return this;
        },
        applyBottom:function() {
            this.mVertical = 1;
            return this;
        },

        /**
         * 文字列表現を取得します.
         */
        dumpProp:function()
        {
            this.log(ex.string.concat(
                "\nvertical:"   , this.vertical(),
                "\nhorizontal:" , this.horizontal()));
        }
        
    }
});