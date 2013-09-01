cls.exports(
    "cm.event.Event",
    "cm.domImpl.event.AbsDomEvent",
    "cm.domImpl.event.AbsDomDisplay",
    "cm.domImpl.event.AbsDomUtil",
{
    /** @name cm.dom */
    $name:"cm.domImpl.AbsDomImpl",
    $define:
    /** @lends cm.domImpl.AbsDomImpl.prototype */
    {
        AbsDomImpl:function()
        {
            cm.dom = this;
            new cm.domImpl.event.AbsDomEvent();
            new cm.domImpl.event.AbsDomDisplay();
            new cm.domImpl.event.AbsDomUtil();

            this.w = window;
            this.d = document;
        },
        destroy:function() {},
    }
});