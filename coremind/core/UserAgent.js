cm.Class.create(
{
    $name:"cm.core.UserAgent",
    $singleton:true,
    $static:
    {
        Vendor:{
            Unknown:0,
            WebKit:1,
            Mozilla:2,
            MicroSoft:3,
            Opera:4
        },
        Browser:{
            Unknown:0,
            Chrome:1,
            Safari:2,
            FireFox:3,
            Mozilla:4,
            InternetExplorer:5,
            Opera:6,
            NetScape:7,
            Lunascape:8
        },
        Platform:{
            Pc:0,
            Android:1,
            iPhone:2,
            iPad:3,
            iPod:4,
            WindowsPhone:5,
            Symbian:6,
            BlackBerry:7
        },
        VendorPrefix:["", "webkit", "moz", "ms", "O"],
        VendorName:["Unknown", "WebKit", "Mozilla", "MicroSoft", "Opera"],
        BrowserName:["Unknown", "Chrome", "Safari", "FireFox", "Mozilla", "InternetExplorer", "Opera", "NetScape", "Lunascape"],
        PlatformName:["Pc", "Android", "iPhone", "iPad", "iPod", "WindowsPhone", "Symbian", "BlackBerry"]
    },
    $define:
    {
        UserAgent:function()
        {
            var ua = navigator.userAgent;
            this.vendor = this.getVendor(ua);
            this.vendorPrefix = this.getVendorPrefix();
            this.platform = this.getPlatform(ua);
            this.platformVersion = this.getPlatformVersion(ua);
            this.browser = this.getBrowser(ua);
            this.browserVersion = this.getBrowserVersion(ua);
        },
        destroy:function() {},
        isAndroid:function() {
            return this.platform == cm.core.UserAgent.Platform.Android
        },
        isiPhone:function() {
            return this.platform == cm.core.UserAgent.Platform.iPhone
        },
        isiPad:function() {
            return this.platform == cm.core.UserAgent.Platform.iPad
        },
        isiPod:function() {
            return this.platform == cm.core.UserAgent.Platform.iPod
        },
        isWindowsPhone:function() {
            return this.platform == cm.core.UserAgent.Platform.iPod
        },
        isMobile:function() {
            return this.Platform.Pc < this.platform;
        },
        isRequiredVersionByBrowser:function(version) {
            this._isRequiredVersion(version, this.browserVersion);
        },
        isRequiredVersionByPlatform:function(version) {
            this._isRequiredVersion(version, this.platformVersion);
        },
        _isRequiredVersion:function(requiredVersion, userVersion)
        {
            requiredVersion = requiredVersion === undefined ? 0: requiredVersion;
            requiredVersion = userVersion === undefined ? 0: userVersion;
            var _rvs = requiredVersion.toString().sprit(".");
            var _uvs = userVersion.toString().split(".");
            while (_uvs.length > 0 && _rvs.length > 0)
            {
                var _uv = _uvs.shift();
                var _rv = _rvs.shift();
                if (_rv < _uv) return true;
                else
                if (_rv > _uv) return false;
            }
            return false;
        },
        getVendor:function(ua)
        {
            if (ua.match(/opera/i))
                return cm.core.UserAgent.Vendor.Opera;
            else
            if (ua.match(/msie/i))
                return cm.core.UserAgent.Vendor.MicroSoft;
            else
            if (ua.match(/webkit/i))
                return cm.core.UserAgent.Vendor.WebKit;
            else
            if (ua.match(/(gecko|mozilla)/i))
                return cm.core.UserAgent.Vendor.Mozilla;
            else
                return cm.core.UserAgent.Vendor.Unknown;
        },
        getVendorName:function() {
            return cm.core.UserAgent.VendorName[this.vendor];
        },
        getPlatform:function(ua)
        {
            if (ua.match(/android/i))
                return cm.core.UserAgent.Platform.Android;
            else
            if (ua.match(/ipod/i))
                return cm.core.UserAgent.Platform.iPod;
            else
            if (ua.match(/iphone/i))
                return cm.core.UserAgent.Platform.iPhone;
            else
            if (ua.match(/ipad/i))
                return cm.core.UserAgent.Platform.iPad;
            else
            if (ua.match(/windows phone/i))
                return cm.core.UserAgent.Platform.WindowsPhone;
            else
            if (ua.match(/blackberry/i))
                return cm.core.UserAgent.Platform.BlackBerry;
            else
            if (ua.match(/symbian/i))
                return cm.core.UserAgent.Platform.Symbian;
            else
                return cm.core.UserAgent.Platform.Pc;
        },
        getPlatformName:function() {
            return cm.core.UserAgent.PlatformName[this.platform];
        },
        getPlatformVersion:function(ua)
        {
            ua = ua.toLowerCase();
            switch (this.getPlatform(ua))
            {
                case cm.core.UserAgent.Platform.Pc:
                    return "0";
                    
                case cm.core.UserAgent.Platform.Android:
                    var _match = ua.match(/android ?[0-9|\.]+[;|-]/);
                    if (_match)
                        return ua.match(/android ?[0-9|\.]+[;|-]/)[0].toString()
                            .replace("android", "")
                            .replace(" ", "")
                            .replace("-", "")
                            .replace(";", "");
                    else
                        return "0";//firefox browser
                        
                case cm.core.UserAgent.Platform.iPhone:
                case cm.core.UserAgent.Platform.iPad:
                    return ua.match(/os ?[0-9|_]+ ?like/)[0].toString().split("_").join(".")
                        .replace("_", ".")
                        .replace("os", "")
                        .replace(" ", "")
                        .replace("like", "");
                        
                case cm.core.UserAgent.Platform.iPod:
                    if (ua.match(/mobile\/3a100a/))
                        return "2.0";
                    else
                        return ua.match(/os ?[0-9|_]+? ?like/)[0].toString().split("_").join(".")
                            .replace("_", ".")
                            .replace("os", "")
                            .replace(" ", "")
                            .replace("like", "");
                            
                case cm.core.UserAgent.Platform.WindowsPhone:
                    return ua.match(/windows phone (os )?[0-9|\.]+;?/)[0].toString()
                        .replace("windows phone ", "")
                        .replace("os ", "")
                        .replace(";", "");
                        
                case cm.core.UserAgent.Platform.BlackBerry:
                    var _match = ua.match(/blackberry ?[0-9]+;?/);
                    if (_match)
                        return _match[0].toString()
                            .replace("blackberry", "")
                            .replace(" ", "");
                    else
                        return "0";//opera browser
                        
                case cm.core.UserAgent.Platform.Symbian:
                    return ua.match(/symbian(os)?\/[0-9|\.]+;?/)[0].toString()
                        .replace("symbian", "")
                        .replace("os", "")
                        .replace("/", "")
                        .replace(";", "");
            }
        },
        getBrowser:function(ua)
        {
            if (ua.match(/opera/i))
                return cm.core.UserAgent.Browser.Opera;
            else
            if (ua.match(/firefox/i))
                return cm.core.UserAgent.Browser.FireFox;
            else
            if (ua.match(/netscape/i))
                return cm.core.UserAgent.Browser.NetScape;
            else
            if (ua.match(/lunascape/i))
                return cm.core.UserAgent.Browser.Lunascape;
            else
            if (ua.match(/chrome/i))
                return cm.core.UserAgent.Browser.Chrome;
            else
            if (ua.match(/safari|Mobile\/8L1|Mobile\/7B405|Mobile\/8C134/i))
                return cm.core.UserAgent.Browser.Safari;
            else
            if (ua.match(/msie/i))
                return cm.core.UserAgent.Browser.InternetExplorer;
            else
            if (ua.match(/mozilla/i))//ver 0.0~4.9
                return cm.core.UserAgent.Browser.Mozilla;
            else
                return cm.core.UserAgent.Browser.Unknown;
        },
        getBrowserName:function() {
            return cm.core.UserAgent.BrowserName[this.browser];
        },
        getBrowserVersion:function(ua)
        {
            ua = ua.toLowerCase();
            switch (this.getBrowser(ua))
            {
                case cm.core.UserAgent.Browser.Unknown:
                    return "0";
                
                case cm.core.UserAgent.Browser.Opera:
                    var _match = ua.match(/^opera\/[0-9|\.]+/);
                    if (_match)
                    {
                        _match = _match[0].toString();
                        if (!_match.match(/9.80/))
                            return _match.replace("opera/", "");
                        else
                            return ua.match(/version\/[0-9|\.]+/)[0].toString().replace("version/", "");
                    }
                    else
                        return ua.match(/opera ?[0-9|\.]+ ?/)[0].toString()
                            .replace("opera", "")
                            .replace(" ", "");
                            
                case cm.core.UserAgent.Browser.FireFox:
                    return ua.match(/firefox\/[0-9|\.]+/)[0].toString().replace("firefox/", "");
                    
                case cm.core.UserAgent.Browser.NetScape:
                    var _match = ua.match(/netscape6\/[0-9|\.]+/);
                    if (_match)
                        return _match[0].toString().replace("netscape6/", "");
                    else
                        return ua.match(/netscape\/[0-9|\.]+/)[0].toString().replace("netscape/", "");
                        
                case cm.core.UserAgent.Browser.Mozilla:
                    var _match = ua.match(/mozilla\/[0-4]\.[0-9|\.]+/);
                    if (_match)
                        return _match[0].toString().replace("mozilla/", "");
                    else
                    if (_match = ua.match(/gecko\/[0-9]+/))
                        return _match[0].toString().replace("gecko/", "");
                    else
                        return "0";//symbian os3
                        
                case cm.core.UserAgent.Browser.Lunascape:
                    return ua.match(/lunascape ?[0-9|\.]+/)[0].toString()
                        .replace("lunascape", "")
                        .replace(" ", "");
                        
                case cm.core.UserAgent.Browser.Chrome:
                    return ua.match(/chrome\/[0-9|\.]+/)[0].toString().replace("chrome/", "");
                    
                case cm.core.UserAgent.Browser.Safari:
                    var _match = ua.match(/applewebkit\/(85|[1-3][0-9\.]+)/);
                    if (_match)
                        return "1.0";
                    else
                    if (_match = ua.match(/applewebkit\/4[0-9\.]+/))
                        return "2.0";
                    else
                    if (_match = ua.match(/version\/[0-9\.]+/))
                        return _match[0].toString().replace("version/", "");
                    else
                        return "0";//unknown
                
                case cm.core.UserAgent.Browser.InternetExplorer:
                    return ua.match(/msie ?[0-9|\.]+/)[0].toString()
                        .replace("msie", "")
                        .replace(" ", "");
            }
        },
        getVendorPrefix:function() {
            return cm.core.UserAgent.VendorPrefix[this.vendor];
        }
    }
});