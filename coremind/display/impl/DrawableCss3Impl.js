cls.exports(
    "cm.core.CssInterface",
{
    $name:"cm.display.impl.DrawableCss3Impl",
    $extends:"cm.display.impl.DrawableCssImpl",
    $define:
    /** @lends cm.display.DrawableCss3Impl.prototype */
    {
        DrawableCss3Impl:function(target, forcedAbsolute) {},
        destroy:function() {},

        updateTransform:function(transform) {
            this.mContentStyle[cm.css.accessor.transform] =
                cm.css.transformToString(transform);
        }
    },
    $override:
    {
        updateBorderColor:function(color) {
            this.mContentStyle.borderColor = cm.css.colorToRgbaString(color);
        },
        //background
        updateBackgroundGradient:function(gradient) {
            this.mContentStyle.background = cm.css.gradientToString(gradient);
        },
        //transform
        _tryUpdateTransform:function(transform)
        {
            if (!eq.isUndefined(transform) && transform.isChanged())
            {
                if (transform.isEnabled(2)
                ||  transform.isEnabled(4)
                ||  transform.isEnabled(64))
                    this.updateTransform(transform);

                if (transform.isEnabled(256))
                    this.updateOrigin(transform.origin());

                transform.applied();
            }
        },
        updateOrigin:function(origin) {
            this.mContentStyle[cm.css.accessor.transformOrigin] =
                cm.css.transformOriginToString(origin);
        },
        //container
        updateShape:function(presetShape)
        {
            var _radius = "";

            if (presetShape.isRect())
                _radius = "";
            else
            if (presetShape.isCircle())
                _radius = "50% 50% 50% 50% / 50% 50% 50% 50%";
            else
                _radius = cm.css.presetShapeToString(presetShape);

            this.mContentStyle.borderRadius = _radius;
        },
        //filter
        applyShadow:function(shadow)
        {
            var p, _shadowCss, _currentStyle;
            if (this.mContent.tagName.toLowerCase().match(/div|table|img|frame|dl|ul|ol/))
            {
                _shadowCss = ex.string.concat(
                    cm.css.colorToRgbaString(shadow.color()), " ",
                    shadow.offsetPositionX(), "px ",
                    shadow.offsetPositionY(), "px ",
                    shadow.radius(), "px ",
                    shadow.offsetSize(), "px",
                    shadow.isInset() ? " inset": "");
                    
                p = cm.css.accessor.boxShadow;

                _currentStyle = this.mContentStyle[p]
                    .match(/(rgb|rgba)\(([0-9]+,? ?){3}([0-9|.]+)?\)( [\-|0-9]+px){4}/g);

                if (eq.isNull(_currentStyle))
                    this.mContentStyle[p] = _shadowCss;
                else
                {
                    _currentStyle[shadow.order] = _shadowCss;
                    this.mContentStyle[p] = _currentStyle.join(", ");
                }
            }
        },
        removeShadow:function(shadow)
        {
            var p, _currentStyle;
            if (this.mContent.tagName.toLowerCase().match(/div|table|img|frame|dl|ul|ol/))
            {
                p = cm.css.accessor.boxShadow;

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