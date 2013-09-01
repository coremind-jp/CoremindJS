cls.exports(
{
    $name:"cm.cssImpl.OperaCssImpl",
    $extends:"cm.cssImpl.AbsCssImpl",
    $define:
    /** @lends cm.cssImpl.OperaCssImpl.prototype */
    {
    /** @name cm.cssImpl */
        OperaCssImpl:function() {},
        destroy:function() {}
    },
    $override:
    {
        _createStyleAccessor:function(cssPrefix, propertyPrefix)
        {
            this.mPrefix = "-o-";
            this.accessor = {
                textShadow     :"textShadow",
                boxShadow      :"boxShadow",
                transform      :"OTransform",
                transformOrigin:"OTransformOrigin"
            };
        }
    }
});