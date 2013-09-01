cls.exports(
{
    /** @name cm.dom */
    $name:"cm.domImpl.event.OperaDomEvent",
    $extends:"cm.domImpl.event.AbsDomEvent",
    $define:
    /** @lends cm.domImpl.AbsDomImpl.prototype */
    {
        OperaDomEvent:function() {},
        destroy:function() {}
    },
    $override:
    {
        _isWheelDown:function() { return this.detail*-1 < 0; },
        _isWheelUp:function() { return this.detail*-1 > 0; }
    }
});