cm.Class.create(
//import
    "cm.math.Vector2D",
    "cm.display.abs.fill.Color",
{
    /** @name cm.util */
    $name:"cm.display.abs.fill.Shadow",
    $extends:"cm.display.abs.DisplayParameters",
    $define:
    /** @lends cm.display.abs.fill.Shadow.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.fill.Shadow
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
            this.mColor = new cm.display.abs.fill.Color();
            this.mOffsetPosition = new cm.math.Vector2D();
            
            this.editOffsetPosition().x = isNaN(offsetPositionX) ? 5: offsetPositionX;
            this.editOffsetPosition().y = isNaN(offsetPositionY) ? 5: offsetPositionY;
            this.radiusFix(isNaN(radius) ? 5: radius)
            this.offsetSizeFix(isNaN(offsetSize) ? 5: offsetSize);
            this.editColor().argbFix(color ? color: 0x80000080);
            if (inset) this.enabledInset();
        },
        destroy:function() {},
        
        id:function() {
            return this.mId;
        },
        
        color:function() {
            return this.mColor;
        },
        editColor:function()
        {
            this.enabledFlag(2);
            return this.mColor;
        },
        
        offsetPosition:function() {
            return this.mOffsetPosition;
        },
        editOffsetPosition:function()
        {
            this.enabledFlag(4);
            return this.mOffsetPosition;
        },
        
        radius:function() {
            return this.mRadius;
        },
        radiusFix:function(val)
        {
            this.enabledFlag(8);
            this.mRadius = val;
            return this;
        },
        radiusRel:function(val)
        {
            this.enabledFlag(8);
            this.mRadius += val;
            return this;
        },
        
        offsetSize:function() {
            return this.mOffsetSize;
        },
        offsetSizeFix:function(val)
        {
            this.enabledFlag(16);
            this.mOffsetSize = val;
            return this;
        },
        offsetSizeRel:function(val)
        {
            this.enabledFlag(16);
            this.mOffsetSize += val;
            return this;
        },
        
        isInset:function() {
            return this.mInset;
        },
        enabledInset:function()
        {
            this.mInset = true;
            this.enabledFlag(32);
            return this;
        }
        
    }
});