cls.exports(
{
    /** @name cm.dom */
    $name:"cm.domImpl.FireFoxDomImpl",
    $extends:"cm.domImpl.AbsDomImpl",
    $define:
    /** @lends cm.domImpl.FireFoxDomImpl.prototype */
    {
        FireFoxDomImpl:function() {},
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