cm.Class.create(
    "cm.core.BrowserInterface",
{
    $name:"cm.display.impl.DrawableCss3Impl",
    $extends:"cm.display.impl.DrawableCssImpl",
    $static:
    {
        GRADIENT:"$eval:'-' + cm.core.UserAgent.vendorPrefix + '-' + cm.core.UserAgent.vendorPrefix == 'moz' ? 'linear-': '' + 'gradient'",
        BOX_SHADOW:"$eval:cm.core.UserAgent.vendorPrefix + 'BoxShadow'",
        TEXT_SHADOW:"$eval:cm.core.UserAgent.vendorPrefix + 'textShadow'",
        TRANSFORM:"$eval:'-' + cm.core.UserAgent.vendorPrefix + '-transform'",
        TRANSFORM_ORIGIN:"$eval:'-' + cm.core.UserAgent.vendorPrefix + '-transform-origin'",
    },
    $define:
    /** @lends cm.display.DrawableCss3Impl.prototype */
    {
        DrawableCss3Impl:function(target) {},
        destroy:function() {},
        
        //border
        enabledBorder:function() {},
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
            this.mContentStyle.borderColor = cm.css.colorToRgbaString(color);
        },
        disabledBorder:function() {
            this.mContentStyle.borderStyle = "none";
        },
        
        //background
        enabledBackground:function() {},
        updateBackgroundColor:function(color) {
            this.mContentStyle.backgroundColor = cm.css.colorToRgbaString(color);
        },
        updateBackgroundGradient:function(gradient) {
            this.mContentStyle.background = cm.css.gradientToString(gradient);
        },
        updateBackgroundImage:function(imageData)
        {
            var _aling = imageData.align();
            this.mContentStyle.backgroundImage =
                cm.string.concat("url(", imageData.source(), ")");
            this.mContentStyle.backgroundPosition = cm.string.concat(
                (_aling.vertical() * 100 | 0), "% ",
                (_aling.horizontal() * 100 | 0), "%");
        },
        disabledBackground:function() {
            this.mContentStyle.backgroundColor = "transparent";
            this.mContentStyle.backgroundImage = "none";
        },
        
        //position
        updateZ:function(val) {},
        
        //transform
        updateScaleX:function(val) {
        },
        updateScaleY:function(val) {
        },
        updateScaleZ:function(val) {
        },
        updateRotationX:function(val) {
        },
        updateRotationY:function(val) {
        },
        updateRotationZ:function(val) {
        },
        updateOriginX:function(val) {
            this.mContentStyle.webkitTransformOriginX
        },
        updateOriginY:function(val) {
            this.mContentStyle.webkitTransformOriginY
        },
        
        //container
        updateShape:function(presetShape)
        {
            if (presetShape.isRect())
                this.mContentStyle.borderRadius = "";
            else
            if (presetShape.isCircle())
            {
                var _wR = this.mContent.cmDisplay.container.width() / 2 + "px ";
                var _hR = this.mContent.cmDisplay.container.height() / 2 + "px ";
                this.mContentStyle.borderRadius = cm.string.concat(
                    _wR, _wR, _wR, _wR, "/ ",_hR, _hR, _hR, _hR);
            }
            else
            {
                var _tl = presetShape.topLeft();
                var _tr = presetShape.topRight();
                var _bl = presetShape.bottomLeft();
                var _br = presetShape.bottomRight();
                this.mContentStyle.borderRadius = cm.string.concat(
                    _tl.x, "px ", _tr.x, "px ", _br.x, "px ", _bl.x, "px ", "/ ",
                    _tl.y, "px ", _tr.y, "px ", _br.y, "px ", _bl.y, "px ");
            }
        },

        //filter
        applyShadow:function(shadow)
        {
            var p, _shadowCss, _currentStyle;
            if (this.mContent.tagName.toLowerCase().match(/div|table|img|frame|dl|ul|ol/))
            {
                _shadowCss = cm.string.concat(
                    cm.css.colorToRgbaString(shadow.color()),
                    shadow.offsetPosition().x, "px ",
                    shadow.offsetPosition().y, "px ",
                    shadow.radius(), "px ",
                    shadow.offsetSize(), "px",
                    shadow.isInset() ? " inset": "");
                    
                p = cm.display.impl.DrawableCss3Impl.BOX_SHADOW;
                _currentStyle = this.mContentStyle[p]
                    .match(/rgba\(( ?[0-9]+,){3} ?[0-9|.]+\)( ?-?[0-9]+px){4}( inset)?/g);
                    
                if (!_currentStyle)
                    this.mContentStyle[p] = _shadowCss;
                else
                {
                    _currentStyle[shadow.order] = _shadowCss;
                    this.mContentStyle[p] = _currentStyle.join(",");
                }
            }
        },
        removeShadow:function(shadow)
        {
            var p, _currentStyle;
            if (this.mContent.tagName.toLowerCase().match(/div|table|img|frame|dl|ul|ol/))
            {
                p = cm.display.impl.DrawableCss3Impl.BOX_SHADOW;

                _currentStyle = this.mContentStyle[p]
                    .match(/rgba\(( ?[0-9]+,){3} ?[0-9|.]+\)( ?-?[0-9]+px){4}/g);
                    
                if (_currentStyle)
                {
                    _currentStyle.splice(shadow.order, 1);
                    this.mContentStyle[p] = _currentStyle.join(",");
                }
            }
        }
        
    }
});