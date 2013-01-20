cm.Class.create(
{
    /** @name cm.cssImpl */
    $name:"cm.cssImpl.ChromeSafariCssImpl",
    $extends:"cm.cssImpl.AbsCssImpl",
    $define:
    /** @lends cm.cssImpl.ChromeSafariCssImpl.prototype */
    {
        ChromeSafariCssImpl:function() {},
        destroy:function() {},
        
        gradientToString:function(gradient)
        {
            var _beginColor = gradient.beginColor();
            var _colors = gradient.colors();
            var _thresholds = gradient.threshold();
            var _color, _threshold = 0;
            var _result = cm.string.concat(
                "-webkit-gradient(linear, left bottom, left top, from(",
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
        }
    }
});