cls.exports(
{
    /** @name cm.dom */
    $name:"cm.domImpl.OperaDomImpl",
    $extends:"cm.domImpl.AbsDomImpl",
    $define:
    /** @lends cm.domImpl.OperaDomImpl.prototype */
    {
        OperaDomImpl:function() {},
        destroy:function() {}
    },
    $override:
    {
        _isWheelDown:function() { return this.detail*-1 < 0; },
        _isWheelUp:function() { return this.detail*-1 > 0; }
    }
});