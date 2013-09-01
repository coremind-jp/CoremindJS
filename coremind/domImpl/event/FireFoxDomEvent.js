cls.exports(
    "cm.event.Event",
{
    /** @name cm.dom */
    $name:"cm.domImpl.event.FireFoxDomEvent",
    $extends:"cm.domImpl.event.AbsDomEvent",
    $define:
    /** @lends cm.domImpl.AbsDomImpl.prototype */
    {
        FireFoxDomEvent:function() {},
        destroy:function() {},
        _DOMMouseScroll:this._mousewheel
    },
    $override:
    {
        _overrideEventDefine:function()
        {
            this.$super("_overrideEventDefine")();
            cm.event.Event.MOUSE_WHEEL = "DOMMouseScroll";
        },
        _isWheelDown:function() { return this.detail > 0; },
        _isWheelUp:function() { return this.detail < 0; }
    }
});