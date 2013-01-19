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
        gradientToString:function(gradient)
        {
            var _beginColor = gradient.beginColor();
            var _colors = gradient.colors();
            var _thresholds = gradient.threshold();
            var _color, _threshold = 0;
            var _result = cm.string.concat(
                "liner-gradient(linear, left bottom, left top, from(",
                this.colorToRgbaString(_beginColor),
                ")");
                
            for(var i = 0, len = _colors.length - 1; i < len; i ++)
            {
                _color = _colors[i];
                _threshold += _thresholds[i];
                _result += cm.string.concat(", color-stop(", _threshold, ", ", this.colorToRgbaString(_color), ")");
            }
            _color = _colors[_colors.length - 1];
            _result += cm.string.concat(", to(", this.colorToRgbaString(_color), "))");
            return _result;
        },
        
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
                        .xAbs(parseInt(style.left))
                        .yAbs(parseInt(style.top));
                    break;
                case "fixed":
                case "absolute":
                    _position
                        .xAbs(parseInt(cm.dom.getX(cmDisplay.parent)))
                        .yAbs(parseInt(cm.dom.getY(cmDisplay.parent)));
                    break;
            }
            _position.applied();
        },
        applyContainer:function(cmDisplay, style)
        {
            var _container = cmDisplay.container;
            _container
                .widthAbs(parseInt(style.width))
                .heightAbs(parseInt(style.Height))
                .contentWidthAbs(cm.dom.getContentWidth(cmDisplay.parent))
                .contentHeightAbs(cm.dom.getContentHeight(cmDisplay.parent))
                .applied();
            this.applyShape(_container.shape(), style);
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