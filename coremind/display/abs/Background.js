cm.Class.create(
//import
    "cm.display.abs.fill.Color",
    "cm.display.abs.fill.Gradient",
    "cm.display.abs.fill.ImageData",
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.Background",
    $extends:"cm.display.abs.DisplayParameters",
    $define:
    /** @lends cm.display.abs.Background.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.Background
         * @extends cm.BaseObject
         */
        Background:function()
        {
            this.mImage = new cm.display.abs.fill.ImageData();
            this.mColor = new cm.display.abs.fill.Color(0);
            this.mGradient = new cm.display.abs.fill.Gradient();
        },
        destroy:function() {},
        
        /**
         */
        color:function(index) { return this.mColor; },
        /**
         */
        editColor:function()
        {
            this.enabledFlag(2);
            this.disabledFlag(4);
            this.disabledFlag(8);
            return this.mColor;
        },
        
        /**
         */
        gradient:function() { return this.mGradient; },
        /**
         */
        editGradient:function()
        {
            this.disabledFlag(2);
            this.enabledFlag(4);
            this.disabledFlag(8);
            return this.mGradient;
        },
        
        /**
         */
        image:function() { return this.mImage; },
        /**
         */
        editImage:function()
        {
            this.disabledFlag(2);
            this.disabledFlag(4);
            this.enabledFlag(8);
            return this.mImage;
        }
    }
});