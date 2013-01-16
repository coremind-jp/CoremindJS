cm.Class.create(
{
    /** @name cm.util */
    $name:"cm.util.Align",
    $define:
    /** @lends cm.util.Align.prototype */
    {
        /**
         * @constructor
         * @name cm.util.Align
         * @extends cm.BaseObject
         */
        Align:function() {
            this.mVertical = this.mHorizontal = 0;
        },
        destroy:function() {},
        
        horizontal:function() {
            return this.mHorizontal;
        },
        vertical:function() {
            return this.mVertical;
        },
        
        manualH:function(val) {
            this.mHorizontal = val;
            return this;
        },
        applyAutoH:function() {
            this.mHorizontal = 0;
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
        
        manualH:function(val) {
            this.mVertical = val;
            return this;
        },
        applyAutoV:function() {
            this.mVertical = 0;
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
        }
        
    }
});