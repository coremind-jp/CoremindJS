cm.Class.create(
{
    /** @name cm.cssImpl */
    $name:"cm.cssImpl.FireFoxCssImpl",
    $extends:"cm.cssImpl.AbsCssImpl",
    $define:
    /** @lends cm.cssImpl.FireFoxCssImpl.prototype */
    {
        FireFoxCssImpl:function() {},
        destroy:function() {},
        
        getGradientCssText:function(colorArray, thresholdArray, from, to)
        {
            var _result = cm.string.concat("-moz-linear-gradient(", from, ", ", colorArray[0]);
            var _total = 1;
            
            for(var i = 0, len = thresholdArray.length; i < len; i ++)
                _total += thresholdArray[i];
            
            for(var i = 0, len = colorArray.length - 1; i < len; i ++)
                _result += cm.string.concat(", #", colorArray.toString(16), " ", thresholdArray[i] / _total);
            _result += cm.string.concat(", #", colorArray[colorArray.length - 1].toString(16), ");");
            
            return _csstext;
        }
        
    }
});