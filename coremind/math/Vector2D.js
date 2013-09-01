cls.exports(
{
    /** @name cm.display */
    $name:"cm.math.Vector2D",
    $define:
    /** @lends cm.math.Vector2D.prototype */
    {
        /**
         * @constructor
         * @name cm.math.Vector2D
         * @extends cm.BaseObject
         */
        Vector2D:function(x, y)
        {
            this.x = x ? x: 0;
            this.y = y ? y: 0;
        },
        destroy:function() {},
        
        dumpProp:function()
        {
            this.log(ex.string.concat(
                "\nx:", this.x,
                "\ny:", this.y));
        }
    }
});