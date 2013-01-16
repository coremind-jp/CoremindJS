cm.Class.create(
{
    /** @name cm.cssImpl */
    $name:"cm.cssImpl.AbsCssImpl",
    $define:
    /** @lends cm.cssImpl.AbsCssImpl.prototype */
    {
        AbsCssImpl:function()
        {
            cm.css = this;
            if (cm.equal.isUndefined(this.mCss))
            {
                var _header = document.getElementsByTagName("head")[0];
                if (_header)
                {
                    var _style = document.createElement("style");
                    _header.appendChild(_style);
                    this.mCss = _style.sheet;
                }
            }
        },
        destroy:function() {},
        
        /*
         * css file modify
         */
        ruleLength:function() {
            return this.mCss.cssRules.length;
        },
        getRule:function(index){
            return this.mCss.cssRules[index];
        },
        appendRule:function(className, value, index) {
            this.mCss.insertRule(
                cm.string.concat(className, "{", value, "}"),
                index);
        },
        removeRule:function(index) {
            this.mCss.deleteRule(index);
        },
        modifyRule:function(index, value) {
            this.mCss.cssRules[index].style.cssText = value;
        },
        
        /*
         * style context wrapper
         * */
        gradientToString:function() {},
        
        applyPosition:function(cmDisplay, style)
        {
            var _position = cmDisplay.position;
            var _stylePos = style.position;
            switch (style.position)
            {
                case "":
                case "static":
                case "relative":
                    style.position = "relative";
                    _position
                        .xFix(parseInt(style.left))
                        .yFix(parseInt(style.top));
                    break;
                case "fixed":
                case "absolute":
                    _position
                        .xFix(parseInt(cm.dom.getX(cmDisplay.parent)))
                        .yFix(parseInt(cm.dom.getY(cmDisplay.parent)));
                    break;
            }
            _position.applied();
        },
        applyContainer:function(cmDisplay, style)
        {
            var _container = cmDisplay.container;
            _container
                .widthFix(parseInt(style.width))
                .heightFix(parseInt(style.Height))
                .contentWidthFix(cm.dom.getContentWidth(cmDisplay.parent))
                .contentHeightFix(cm.dom.getContentHeight(cmDisplay.parent))
                .applied();
            this.applyShape(_container.shape(), style);
        },
        applyShape:function(presetShape, style)
        {
            presetShape.topLeftFix(parseInt(style.borderTopLeftRadius));
            presetShape.bottomLeftFix(parseInt(style.borderBottomLeftRadius));
            presetShape.topRightFix(parseInt(style.borderTopRightRadius));
            presetShape.bottomRightFix(parseInt(style.borderBottomRightRadius));
        },
        applyBackground:function(cmDisplay, style)
        {
            var _background = cmDisplay.background;
        },
        applyColor:function(color, style)
        {
            var val = new String(style.backgroundColor);
            if (val == "transparent"
            ||  val == "")
                color.argbFix(0);
            else
            {
                var _val = val.subString(val.indexOf("(") + 1, val.length - 2).split(",");
                var _member = ["rFix", "gFix", "bFix", "aFix"];
                for (var i = 0, len = _val.length; i < len; i++)
                {
                    var _colorInt = i < 3 ? parseInt(_val[i]): Number(_val[i]);
                    this.log(_colorInt);
                    color[_member[i]](_colorInt);
                }
            }
        },
        
        colorToRgbString:function(color) {
            return cm.string.concat("rgb(", color.r(), ",", color.g(), ",", color.b(), ")");
        },
        colorToRgbaString:function(color) {
            return cm.string.concat("rgba(", color.r(), ",", color.g(), ",", color.b(), ",", color.aRatio(), ")");
        },
        computedStyle:function(element, cssProp) {
            return this.d.defaultView.getComputedStyle(element, null).getPropertyValue(cssProp);
        }
        
    }
});