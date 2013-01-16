cm.Class.create(
    "cm.domImpl.OperaDomImpl",
    "cm.domImpl.FireFoxDomImpl",
    "cm.domImpl.ChromeSafariDomImpl",
    "cm.domImpl.InternetExplorerDomImpl",
    "cm.cssImpl.OperaCssImpl",
    "cm.cssImpl.FireFoxCssImpl",
    "cm.cssImpl.ChromeSafariCssImpl",
    "cm.cssImpl.InternetExplorerCssImpl",
{
    /** @name cm.core */
    $name:"cm.core.BrowserInterface",
    $singleton:true,
    $define:
    /** @lends cm.core.BrowserInterface.prototype */
    {
        BrowserInterface:function()
        {
            this._switchImpl();
        },
        _switchImpl:function()
        {
            var _ua = cm.core.UserAgent;
            switch (_ua.browser)
            {
                case _ua.Browser.InternetExplorer:
                    cm.log.$("browser internetExplorer");
                    new cm.domImpl.InternetExplorerDomImpl();
                    new cm.cssImpl.InternetExplorerCssImpl();
                    break;
                    
                case _ua.Browser.FireFox:
                    cm.log.$("browser firefox");
                    new cm.domImpl.FireFoxDomImpl();
                    new cm.cssImpl.FireFoxCssImpl();
                    break;
                    
                case _ua.Browser.Chrome:
                case _ua.Browser.Safari:
                    //TODO sprit chrome safari
                    cm.log.$("browser chrome or safari");
                    new cm.domImpl.ChromeSafariDomImpl();
                    new cm.cssImpl.ChromeSafariCssImpl();
                    break;
                    
                case _ua.Browser.Opera:
                    cm.log.$("browser opera");
                    new cm.domImpl.OperaDomImpl();
                    new cm.cssImpl.OperaCssImpl();
                    break;
                    
                default:
                    cm.log.$("browser unknown");
                    new cm.domImpl.AbsDomImpl();
                    new cm.cssImpl.AbsCssImpl();
                    break;
            }
        },
        
        destroy:function() {}
    }
});