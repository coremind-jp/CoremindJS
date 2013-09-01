cls.require(
    "cm.core.UserAgent",
function()
{
    out.$("DomInterface preloading.");
    var _ua = cm.core.UserAgent;
    var _target = "Abs";

    if (_ua.isInternetExplorer())
        _target = "InternetExplorer";
    else
    if (_ua.isChrome() || _ua.isSafari())
        _target = "Chrome";
    else
    if (_ua.isFireFox())
        _target = "Fifox";
    else
    if (_ua.isOpera())
        _target = "Opera";

    var _event   = ex.string.concat("cm.domImpl.event.", _target, "DomEvent");
    var _display = ex.string.concat("cm.domImpl.display.", _target, "DomDisplay");
    var _util    = ex.string.concat("cm.domImpl.util.", _target, "DomUtil");

    cls.exports(
        _event,
        _display,
        _util,
    {
        $name:"cm.core.DomInterface",
        $singleton:true,
        $define:
        {
            DomInterface:function()
            {
                cm.dom = { w:window, d:document };
                cm.dom.event = new (cls.get(_event))();
                cm.dom.display = new (cls.get(_display))();
                cm.dom.util = new (cls.get(_util))();
            },
            destroy:function() {}
        }
    });
});