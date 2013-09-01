cls.exports(
{
    /** @name cm.dom */
    $name:"cm.domImpl.display.AbsDomDisplay",
    $define:
    /** @lends cm.domImpl.AbsDomImpl.prototype */
    {
        AbsDomDisplay:function() {},
        destroy:function() {},
        
        getGlobalX:function(element) { return parseInt("0"+element.offsetLeft); },
        getGlobalY:function(element) { return parseInt("0"+element.offsetTop); },
        getLocalX:function(element) { return parseInt("0"+element.style.left); },
        getLocalY:function(element) { return parseInt("0"+element.style.top); },
        getWidth:function(element) { return parseInt("0"+element.clientWidth); },
        getHeight:function(element) { return parseInt("0"+element.clientHeight); },
        getContentWidth:function(element) { return parseInt("0"+element.scrollWidth); },
        getContentHeight:function(element) { return parseInt("0"+element.scrollHeight); }
    }
});