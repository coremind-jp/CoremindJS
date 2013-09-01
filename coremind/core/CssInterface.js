cls.require(
    "cm.core.UserAgent",
function()
{
    out.$("CssInterface preloading.");
    var _ua = cm.core.UserAgent;
    var _css = "Abs";
    var _dwarable = "Css3";

    if (_ua.isInternetExplorer())
    {
        _css = "InternetExplorer";
        _dwarable = !document.documentMode || document.documentMode < 9 ?
                "InternetExplorer7_8Impl":
                document.documentMode == 9 ?
                    "InternetExplorer9":
                    "Css3";
    }
    else
    if (_ua.isChrome() || _ua.isSafari())
        _css = "Chrome";
    else
    if (_ua.isFireFox())
        _css = "Fifox";
    else
    if (_ua.isOpera())
        _css = "Opera";

    _css      = ex.string.concat("cm.cssImpl.", _css, "CssImpl");
    _dwarable = ex.string.concat("cm.display.impl.Drawable", _dwarable, "Impl");

    cls.exports(
        _css,
        _dwarable,
    {
        $name:"cm.core.CssInterface",
        $singleton:true,
        $define:
        {
            CssInterface:function()
            {
                cm.css = new (cls.get(_css))();
                cm.cssDrawable = cls.get(_dwarable);
            },
            destroy:function() {}
        }
    });
});