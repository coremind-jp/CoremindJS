cls.exports(
{
    /** @name cm.cssImpl */
    $name:"cm.cssImpl.FireFoxCssImpl",
    $extends:"cm.cssImpl.AbsCssImpl",
    $define:
    {
        FireFoxCssImpl:function() {},
        destroy:function() {}
    },
    $override:
    {
        _createStyleAccessor:function()
        {
            this.mPrefix = "-moz-";
            this.accessor = {
                textShadow     :"textShadow",
                boxShadow      :"boxShadow",
                transform      :"MozTransform",
                transformOrigin:"MozTransformOrigin",
                perspective    :"MozPerspective"
            };
        }
    }
});