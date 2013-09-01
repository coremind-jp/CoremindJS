cls.exports(
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
            this.platform = this.getPlatform(ua);
            this.platformVersion = this.getPlatformVersion(ua);
            this.browser = this.getBrowser(ua);
            this.browserVersion = this.getBrowserVersion(ua);

            this.log(
                "Vendor:", this.getVendorName(),
                "Browser:", this.getBrowserName(),
                "Version:", this.browserVersion);
        },
        destroy:function() {},
        
        isAndroid:function() {
            return this.platform == this.$class.Platform.Android;
        },
        isiPhone:function() {
            return this.platform == this.$class.Platform.iPhone;
        },
        isiPad:function() {
            return this.platform == this.$class.Platform.iPad;
        },
        isiPod:function() {
            return this.platform == this.$class.Platform.iPod;
        },
        isWindowsPhone:function() {
            return this.platform == this.$class.Platform.iPod;
        },
        isMobile:function() {
            return this.Platform.Pc < this.platform;
        },

        isChrome:function() {
            return this.browser == this.$class.Browser.Chrome;
        },
        isSafari:function() {
            return this.browser == this.$class.Browser.Safari;
        },
        isFireFox:function() {
            return this.browser == this.$class.Browser.FireFox;
        },
        isOpera:function() {
            return this.browser == this.$class.Browser.Opera;
        },
        isInternetExplorer:function() {
            return this.browser == this.$class.Browser.InternetExplorer;
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
                return this.$class.Vendor.Opera;
            else
            if (ua.match(/msie/i))
                return this.$class.Vendor.MicroSoft;
            else
            if (ua.match(/webkit/i))
                return this.$class.Vendor.WebKit;
            else
            if (ua.match(/(gecko|mozilla)/i))
                return this.$class.Vendor.Mozilla;
            else
                return this.$class.Vendor.Unknown;
        },
        getVendorName:function() {
            return this.$class.VendorName[this.vendor];
        },
        getPlatform:function(ua)
        {
            if (ua.match(/android/i))
                return this.$class.Platform.Android;
            else
            if (ua.match(/ipod/i))
                return this.$class.Platform.iPod;
            else
            if (ua.match(/iphone/i))
                return this.$class.Platform.iPhone;
            else
            if (ua.match(/ipad/i))
                return this.$class.Platform.iPad;
            else
            if (ua.match(/windows phone/i))
                return this.$class.Platform.WindowsPhone;
            else
            if (ua.match(/blackberry/i))
                return this.$class.Platform.BlackBerry;
            else
            if (ua.match(/symbian/i))
                return this.$class.Platform.Symbian;
            else
                return this.$class.Platform.Pc;
        },
        getPlatformName:function() {
            return this.$class.PlatformName[this.platform];
        },
        getPlatformVersion:function(ua)
        {
            var P = this.$class.Platform;
            ua = ua.toLowerCase();
            switch (this.getPlatform(ua))
            {
                case P.Pc:
                    return "0";
                    
                case P.Android:
                    var _match = ua.match(/android ?[0-9|\.]+[;|-]/);
                    if (_match)
                        return ua.match(/android ?[0-9|\.]+[;|-]/)[0].toString()
                            .replace(/android|[ ;\-]/g, "");
                    else
                        return "0";//firefox browser
                        
                case P.iPhone:
                case P.iPad:
                    return ua.match(/os ?[0-9|_]+ ?like/)[0].toString().split("_").join(".")
                        .replace("_", ".")
                        .replace("/os|like|[ ]/g", "");
                        
                case P.iPod:
                    if (ua.match(/mobile\/3a100a/))
                        return "2.0";
                    else
                        return ua.match(/os ?[0-9|_]+? ?like/)[0].toString().split("_").join(".")
                            .replace("_", ".")
                            .replace(/os|like|[ ]/g, "");
                            
                case P.WindowsPhone:
                    return ua.match(/windows phone (os )?[0-9|\.]+;?/)[0].toString()
                        .replace(/windows phone |os|;/g, "");
                        
                case P.BlackBerry:
                    var _match = ua.match(/blackberry ?[0-9]+;?/);
                    if (_match)
                        return _match[0].toString().replace(/blackberry|[\s]/g, "");
                    else
                        return "0";//opera browser
                        
                case P.Symbian:
                    return ua.match(/symbian(os)?\/[0-9|\.]+;?/)[0].toString()
                        .replace(/symbian|os|[\/;]/g, "");
            }
        },
        getBrowser:function(ua)
        {
            var B = this.$class.Browser;
            if (ua.match(/opera/i))
                return B.Opera;
            else
            if (ua.match(/firefox/i))
                return B.FireFox;
            else
            if (ua.match(/netscape/i))
                return B.NetScape;
            else
            if (ua.match(/lunascape/i))
                return B.Lunascape;
            else
            if (ua.match(/chrome/i))
                return B.Chrome;
            else
            if (ua.match(/safari|Mobile\/8L1|Mobile\/7B405|Mobile\/8C134/i))
                return B.Safari;
            else
            if (ua.match(/msie/i))
                return B.InternetExplorer;
            else
            if (ua.match(/mozilla/i))//ver 0.0~4.9
                return B.Mozilla;
            else
                return B.Unknown;
        },
        getBrowserName:function() {
            return this.$class.BrowserName[this.browser];
        },
        getBrowserVersion:function(ua)
        {
            var B = this.$class.Browser;
            ua = ua.toLowerCase();
            switch (this.getBrowser(ua))
            {
                case B.Unknown:
                    return "0";
                
                case B.Opera:
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
                            
                case B.FireFox:
                    return ua.match(/firefox\/[0-9|\.]+/)[0].toString().replace("firefox/", "");
                    
                case B.NetScape:
                    var _match = ua.match(/netscape6\/[0-9|\.]+/);
                    if (_match)
                        return _match[0].toString().replace("netscape6/", "");
                    else
                        return ua.match(/netscape\/[0-9|\.]+/)[0].toString().replace("netscape/", "");
                        
                case B.Mozilla:
                    var _match = ua.match(/mozilla\/[0-4]\.[0-9|\.]+/);
                    if (_match)
                        return _match[0].toString().replace("mozilla/", "");
                    else
                    if (_match = ua.match(/gecko\/[0-9]+/))
                        return _match[0].toString().replace("gecko/", "");
                    else
                        return "0";//symbian os3
                        
                case B.Lunascape:
                    return ua.match(/lunascape ?[0-9|\.]+/)[0].toString()
                        .replace("lunascape", "")
                        .replace(" ", "");
                        
                case B.Chrome:
                    return ua.match(/chrome\/[0-9|\.]+/)[0].toString().replace("chrome/", "");
                    
                case B.Safari:
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
                
                case B.InternetExplorer:
                    return ua.match(/msie ?[0-9|\.]+/)[0].toString()
                        .replace("msie", "")
                        .replace(" ", "");
            }
        }
    }
});