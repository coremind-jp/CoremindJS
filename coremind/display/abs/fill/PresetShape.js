cm.Class.create(
//import
    "cm.math.Vector2D",
{
    /** @name cm.util */
    $name:"cm.display.abs.fill.PresetShape",
    $define:
    /** @lends cm.display.abs.fill.PresetShape.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.fill.PresetShape
         * @extends cm.BaseObject
         */
        PresetShape:function()
        {
            this.mTopLeft = new cm.math.Vector2D();
            this.mBottomLeft = new cm.math.Vector2D();
            this.mTopRight = new cm.math.Vector2D();
            this.mBottomRight = new cm.math.Vector2D();
            this.mGroupRound = 0;
            this.applyRect();
        },
        destroy:function() {},
        applyRect:function()
        {
            this.mTopLeft.x = this.mTopLeft.y =
            this.mBottomLeft.x = this.mBottomLeft.y =
            this.mTopRight.x = this.mTopRight.y =
            this.mBottomRight.x = this.mBottomRight.y = 0;
            return this;
        },
        applyCircle:function() {
            this.mTopLeft.x = this.mTopLeft.y =
            this.mBottomLeft.x = this.mBottomLeft.y =
            this.mTopRight.x = this.mTopRight.y =
            this.mBottomRight.x = this.mBottomRight.y = -1;
            return this;
        },
        round:function() {
            return this.mGroupRound;
        },
        roundFix:function(arc) {
            this.mTopLeft.x = this.mTopLeft.y =
            this.mBottomLeft.x = this.mBottomLeft.y =
            this.mTopRight.x = this.mTopRight.y =
            this.mBottomRight.x = this.mBottomRight.y = this.mGroupRound = arc;
            return this;
        },
        
        topLeft:function() { return this.mTopLeft; },
        topLeftFix:function(arcX, arcY) {
            this.mTopLeft.x = arcX < 0 ? 0: arcX;
            this.mTopLeft.y = arcX < 0 ? 0: arcX;
            return this;
        },
        topLeftRel:function(arcX, arcY) {
            this.topLeftFix(
                this.mTopLeft.x + arcX,
                this.mTopLeft.y + arcY);
            return this;
        },
        
        bottomLeft:function() { return this.mBottomLeft; },
        bottomLeftFix:function(arcX, arcY) {
            this.mBottomLeft.x = arcX < 0 ? 0: arcX;
            this.mBottomLeft.y = arcY < 0 ? 0: arcY;
            return this;
        },
        bottomLeftRel:function(arcX, arcY)
        {
            this.bottomLeftFix(
                this.mBottomLeft.x + arcX,
                this.mBottomLeft.y + arcY);
            return this;
        },
        
        topRight:function() { return this.mTopRight; },
        topRightFix:function(arcX, arcY)
        {
            this.mTopRight.x = arcX < 0 ? 0: arcX;
            this.mTopRight.y = arcY < 0 ? 0: arcY;
            return this;
        },
        topRightRel:function(arcX, arcY)
        {
            this.topRightFix(
                this.mTopRight.x + arcX,
                this.mTopRight.y + arcY);
            return this;
        },
        
        bottomRight:function() { return this.mBottomRight; },
        bottomRightFix:function(arcX, arcY) {
            this.mBottomRight.x = arcX < 0 ? 0: arcX;
            this.mBottomRight.y = arcY < 0 ? 0: arcY;
            return this;
        },
        bottomRightRel:function(arcX, arcY)
        {
            this.bottomRightFix(
                this.mBottomRight.x + arcX,
                this.mBottomRight.y + arcY);
            return this;
        },
        
        isRect:function() {
            return this.mTopLeft.x     + this.mTopLeft.y
                 + this.mBottomLeft.x  + this.mBottomLeft.y
                 + this.mTopRight.x    + this.mTopRight.y
                 + this.mBottomRight.x + this.mBottomRight.y == 0;
        },
        isCircle:function() {
            return this.mTopLeft.x < 0     && this.mTopLeft.y < 0 
                && this.mBottomLeft.x < 0  && this.mBottomLeft.y < 0 
                && this.mTopRight.x < 0    && this.mTopRight.y < 0 
                && this.mBottomRight.x < 0 && this.mBottomRight.y < 0;
        },
        isRound:function() {
            return !this.isRect() && !this.isCircle();
        }
    }
});