cls.exports(
    "cm.core.DomInterface",
{
    /** @name cm.cssImpl */
    $name:"cm.cssImpl.AbsCssImpl",
    $define:
    /** @lends cm.cssImpl.AbsCssImpl.prototype */
    {
        AbsCssImpl:function()
        {
            if (eq.isUndefined(this.mCss))
            {
                var _header = cm.dom.d.getElementsByTagName("head")[0];
                if (_header)
                {
                    var _style = cm.dom.d.createElement("style");
                    _header.appendChild(_style);
                    this.mCss = _style.sheet;
                }
            }
            this._createStyleAccessor();
        },
        destroy:function() {},
        
        _createStyleAccessor:function()
        {
            this.mPrefix = "";
            this.accessor = {
                textShadow     :"textShadow",
                boxShadow      :"boxShadow",
                transform      :"transform",
                transformOrigin:"transformOrigin"
            };
        },

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
                ex.string.concat(className, "{", value, "}"),
                index);
        },
        removeRule:function(index) {
            this.mCss.deleteRule(index);
        },
        modifyRule:function(index, value) {
            this.mCss.cssRules[index].style.cssText = value;
        },
        
        gradientToString:function(gradient)
        {
            return gradient.type() === cm.display.abs.fill.Gradient.TYPE.RADIAL ?
                this._gradientToStringByRadial(gradient):
                this._gradientToStringByLinear(gradient);
        },
        _gradientToStringByLinear:function(gradient)
        {
            var _beginColor = gradient.beginColor();
            var _colors = gradient.colors();
            var _thresholds = gradient.threshold();
            var _color, _threshold = 0;
            var _result = ex.string.concat(
                this.mPrefix,
                "linear-gradient(",
                gradient.linearDegree(), "deg, ",
                this.colorToRgbaString(_beginColor), " 0%");
                
            for(var i = 0, len = _colors.length; i < len; i ++)
            {
                _color = _colors[i];
                _threshold += _thresholds[i];
                _result += ex.string.concat(", ", this.colorToRgbaString(_color)," ", _threshold * 100, "%");
            }
            _result += ")";
            return _result;
        },
        _gradientToStringByRadial:function(gradient)
        {
            var _beginColor = gradient.beginColor();
            var _colors = gradient.colors();
            var _thresholds = gradient.threshold();
            var _origin = gradient.radialOrigin();
            var _color, _threshold = 0;
            var _result = ex.string.concat(
                this.mPrefix,
                "radial-gradient(",
                _origin.horizontal() * 100, "% ",
                _origin.vertical() * 100, "%, ",
                gradient.radialShape(), " ",
                gradient.radialSize(), ", ",
                this.colorToRgbaString(_beginColor), " 0%");
                
            for(var i = 0, len = _colors.length; i < len; i ++)
            {
                _color = _colors[i];
                _threshold += _thresholds[i];
                _result += ex.string.concat(", ", this.colorToRgbaString(_color)," ", _threshold * 100, "%");
            }
            return _result + ")";
        },

        transformToString:function(transform)
        {
            return ex.string.concat(
                "scale(",
                transform.scaleX(), ", ",
                transform.scaleY(), ") ",
                "rotate(",
                transform.rotationZ(), "deg)");
        },
        
        transformOriginToString:function(origin)
        {
            return ex.string.concat(
                origin.horizontal() * 100, "% ",
                origin.vertical()   * 100, "%");
        },

        presetShapeToString:function(presetShape)
        {
            var s = presetShape;
            return ex.string.concat(
                s.topLeftCornerWidth(), "px ",     s.topRightCornerWidth(), "px ",
                s.bottomRightCornerWidth(), "px ", s.bottomLeftCornerWidth(), "px ",
                "/ ",
                s.topLeftCornerHeight(), "px ",    s.topRightCornerHeight(), "px ",
                s.bottomRightCornerWidth(), "px ", s.bottomLeftCornerHeight(), "px");
        },

        applyPosition:function(cmDisplay, style)
        {
            var _position = cmDisplay.position;
            var _stylePos = style.position;
            switch (style.position)
            {
                case "fixed":
                case "absolute":
                    _position
                        .xAbs(cm.dom.display.getGlobalX(cmDisplay.parent))
                        .yAbs(cm.dom.display.getGlobalY(cmDisplay.parent));
                    break;
                default :
                    style.position = "relative";
                    _position
                        .xAbs(cm.dom.display.getLocalX(cmDisplay.parent))
                        .yAbs(cm.dom.display.getLocalY(cmDisplay.parent));
                    break;
            }
            _position.applied();
        },
        applyContainer:function(cmDisplay, style)
        {
            var _container = cmDisplay.container;
            _container
                .widthAbs(cm.dom.display.getWidth(cmDisplay.parent))
                .heightAbs(cm.dom.display.getHeight(cmDisplay.parent))
                .contentWidthAbs(cm.dom.display.getContentWidth(cmDisplay.parent))
                .contentHeightAbs(cm.dom.display.getContentHeight(cmDisplay.parent))
                .applied();
        },
        colorToRgbString:function(color) {
            return ex.string.concat("rgb(", color.r(), ",", color.g(), ",", color.b(), ")");
        },
        colorToRgbaString:function(color) {
            return ex.string.concat("rgba(", color.r(), ",", color.g(), ",", color.b(), ",", color.aRatio(), ")");
        },
        computedStyle:function(element, cssProp) {
            return this.d.defaultView.getComputedStyle(element, null).getPropertyValue(cssProp);
        }
        
    }
});