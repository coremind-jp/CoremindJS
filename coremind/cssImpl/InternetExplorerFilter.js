cls.exports(
    "cm.domImpl.InternetExplorerDomImpl",
{
    /** @name cm.cssImpl */
    $name:"cm.cssImpl.InternetExplorerFilter",
    $singleton:true,
    $static:
    {
        MATRIX:"DXImageTransform.Microsoft.Matrix",
        ALPHA:"DXImageTransform.Microsoft.Alpha",
        BLUR:"DXImageTransform.Microsoft.Blur"
    },
    $define:
    /** @lends cm.cssImpl.InternetExplorerCssImpl.prototype */
    {
        InternetExplorerFilter:function()
        {
            cm.ieFilter = this;
        },
        destroy:function() {},
        
        get:function(filterName, element)
        {
            var _style = element.style, _result;

            if (_style.filter.length > 0)
            {
                if (_style.filter.indexOf(filterName) == -1)
                    _style.filter += ex.string.concat("progid:", filterName, "()");
                _result = element.filters.item(filterName);
            }
            else
            {
                var _parentNode = element.parentNode, _nextSibling = element.nextSibling;
                if (cm.core.UserAgent.browserVersion <= 7)
                    cm.dom.d.appendChild(element);
                else
                    cm.dom.d.body.appendChild(element);

                if (_style.filter.indexOf(filterName) == -1)
                    _style.filter = ex.string.concat("progid:", filterName, "()");
                _result = element.filters.item(filterName);

                if (!eq.isNull(_parentNode))
                    _parentNode.insertBefore(element, _nextSibling);
            }

            return _result;
        },
        disabled:function(element, filterName)
        {
            element.style.filter.replace(
                new RegExp(cm.string("progid:", filterName, "\(*?\)"),
                ""));
        }

    }
});