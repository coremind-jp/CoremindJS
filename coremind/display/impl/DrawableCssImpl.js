cls.exports(
    "cm.display.abs.Border",
    "cm.core.CssInterface",
    "cm.core.DomInterface",
{
    /** @name cm.display */
    $name:"cm.display.impl.DrawableCssImpl",
    $extends:"cm.display.abs.Drawable",
    $define:
    /** @lends cm.display.impl.DrawableCssImpl.prototype */
    {
        DrawableCssImpl:function(cmDisplay, forcedAbsolute)
        {
            if (!cm.dom.util.isHtmlDomElement(cmDisplay.parent))
                out.e("target is not HTMLElement");
                
            this.mContent = cmDisplay.parent;
            this.mContentStyle = this.mContent.style;
            if (forcedAbsolute) this.mContentStyle.position = "absolute";
        },
        destroy:function() {}
    },
    $override:
    {
        applySorceParameters:function()
        {
            if (this.mContent.parentNode)
            {
                cm.css.applyPosition(this.mContent.cmDisplay, this.mContentStyle);
                cm.css.applyContainer(this.mContent.cmDisplay, this.mContentStyle);
            }
        },

        //toplevel
        updateVisible:function(val) {
            this.mContentStyle.visibility = Boolean(val) ? "visible": "hidden";
        },
        updateAlpha:function(val) {
            this.mContentStyle.opacity = val;
        },

        //border
        updateBorderWeight:function(val) {
            this.mContentStyle.borderWidth = val + "px";
        },
        updateBorderStyle:function(val)
        {
            switch (val)
            {
                case cm.display.abs.Border.DASH:
                    this.mContentStyle.borderStyle = "dashed";
                    break;
                case cm.display.abs.Border.DOT:
                    this.mContentStyle.borderStyle = "dotted";
                    break;
                case cm.display.abs.Border.DOUBLE:
                    this.mContentStyle.borderStyle = "double";
                    break;
                default:
                    this.mContentStyle.borderStyle = "solid";
                    break;
            }
        },
        updateBorderColor:function(color) {
            this.mContentStyle.borderColor = cm.css.colorToRgbString(color);
        },
        disabledBorder:function() {
            this.mContentStyle.borderStyle = "none";
        },

        //position
        updateX:function(val) {
            this.mContentStyle.left = val + "px";
        },
        updateY:function(val) {
            this.mContentStyle.top = val + "px";
        },
        
        //container
        updateWidth:function(val) {
            this.mContentStyle.width = val + "px";
        },
        updateHeight:function(val) {
            this.mContentStyle.height = val + "px";
        },

        //background
        updateBackgroundColor:function(color) {
            this.mContentStyle.backgroundColor = cm.css.colorToRgbaString(color);
        },
        updateBackgroundImage:function(imageData)
        {
            var _origin = imageData.origin();
            this.mContentStyle.background = ex.string.concat(
                "url(", imageData.source(), ")",
                imageData.repeat(), " ",
                (_origin.horizontal() * 100 | 0), "% ",
                (_origin.vertical() * 100 | 0), "%");
        },
        disabledBackground:function() {
            this.mContentStyle.background = "";
        }
        
    }
});