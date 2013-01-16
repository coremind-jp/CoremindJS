cm.Class.create(
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
        Vector2D:function()
        {
            this.x = 0;
            this.y = 0;
        },
        destroy:function() {},
        
        toString:function() {
            return cm.string.concat("x:", this.x, " y:", this.y);
        }
    }
});