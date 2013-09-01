cls.exports(
    "cm.math.Vector2D",
    "cm.math.Matrix2D",
    "cm.display.impl.DrawableVmlImpl",
    "cm.core.DomInterface",
    "cm.core.CssInterface",
{
    /** @name cm.display */
    $name:"cm.display.impl.DrawableInternetExplorer9Impl",
    $extends:"cm.display.impl.DrawableCss3Impl",
    $static:{
        CHILD_NUM:0,
        SVG_TEMPLETE:
        {
            isCreated:false,
            ROOT:null,
            RECT:null,
            LINEAR_GRADIENT:null,
            RADIAL_GRADIENT:null
        }
    },
    $define:
    /** @lends cm.display.impl.DrawableOldInternetExplorerImpl.prototype */
    {
        DrawableInternetExplorer9Impl:function(cmDisplay, forcedAbsolute) {
            this._tryCreateSVGElementTemplete();
            this.mId = this.$class.CHILD_NUM++;
        },
        destroy:function() {},
        
        _tryCreateSVGElementTemplete:function()
        {
            if (!eq.isNull(this.$class.SVG_TEMPLETE.isCreated))
            {
                var T = this.$class.SVG_TEMPLETE;
                var _id = "svg" + this.mId;
                var _svg = cm.dom.util.createElement("svg");
                var _rect = cm.dom.util.createElement("rect");
                var _linear = cm.dom.util.createElement("lineargradient");
                var _radial = cm.dom.util.createElement("radialgradient");

                _svg.id = _id;
                _svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                _svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
                _svg.setAttribute("viewBox", "0 0 1, 1");
                _svg.setAttribute("width", "100%");
                _svg.setAttribute("height", "100%");

                _rect.setAttribute("fill", "url(#g)");
                _rect.setAttribute("x", "0");
                _rect.setAttribute("y", "0");
                _rect.setAttribute("width", "1");
                _rect.setAttribute("height", "1");
                _svg.appendChild(_rect);

                _linear.id = "g";
                _linear.setAttribute("x1", "0%");
                _linear.setAttribute("y1", "0%");
                _linear.setAttribute("x2", "100%");
                _linear.setAttribute("y2", "0%");

                _radial.id = "g";
                _radial.setAttribute("cx", "50%");
                _radial.setAttribute("cy", "50%");
                _radial.setAttribute("r" , "50%");

                T.ROOT = _svg;
                T.RECT = _rect;
                T.LINEAR_GRADIENT = _linear;
                T.RADIAL_GRADIENT = _radial;
            }
        },
        _applyLinearGradient:function(gradient)
        {
            var
                T = this.$class.SVG_TEMPLETE,
                _svg = T.ROOT.cloneNode(true),
                _shape = _svg.firstChild,
                _linear = T.LINEAR_GRADIENT.cloneNode();

            _shape.setAttribute("transform", "rotate(" + -gradient.linearDegree()+ ", .5, .5)");
            this._appendGradientStopElement(gradient, _linear);
            _svg.appendChild(_linear);

            this._applySvgBackground(_svg, "linearGradient");
        },
        _applyRadialGradient:function(gradient)
        {
            var
                T = this.$class.SVG_TEMPLETE,
                _origin = gradient.radialOrigin();
                _colors = gradient.colors(),
                _len = _colors.length,
                _endColor = _colors[_len - 1],
                _svg = T.ROOT.cloneNode(true),
                _radial = T.RADIAL_GRADIENT.cloneNode(),
                _background = _svg.firstChild,
                _radialShape = cm.dom.util.createElement("ellipse");
                _radialSize = cm.display.impl.DrawableVmlImpl.prototype._calcRadialGradientSize(gradient);

            _background.id = "";
            _background.setAttribute("fill", "#" + _endColor.rgbStr());
            _background.setAttribute("opacity", _endColor.aRatio());

            _radialShape.setAttribute("cx", _origin.horizontal());
            _radialShape.setAttribute("cy", _origin.vertical());
            _radialShape.setAttribute("rx", _radialSize.width);
            _radialShape.setAttribute("ry", _radialSize.height);
            _radialShape.setAttribute("fill", "url(#g)");
            _svg.appendChild(_radialShape);

            this._appendGradientStopElement(gradient, _radial);
            _svg.appendChild(_radial);

            this._applySvgBackground(_svg, "radialGradient");
        },
        _appendGradientStopElement:function(gradient, svgGradient)
        {
            var
                _stopElement = cm.dom.util.createElement("stop"),
                _beginColor = gradient.beginColor(),
                _colors = gradient.colors(),
                _thresholds = gradient.threshold(),
                _threshold = 0;

            _stopElement.setAttribute("offset", "0%");
            _stopElement.setAttribute("stop-color"  , "#" + _beginColor.rgbStr());
            _stopElement.setAttribute("stop-opacity", _beginColor.aRatio());
            svgGradient.appendChild(_stopElement);

            for(var i = 0, len = _colors.length; i < len; i ++)
            {
                _threshold += _thresholds[i];
                _stopElement = cm.dom.util.createElement("stop");
                _stopElement.setAttribute("offset", _threshold * 100 + "%");
                _stopElement.setAttribute("stop-color", "#" + _colors[i].rgbStr());
                _stopElement.setAttribute("stop-opacity", _colors[i].aRatio());
                svgGradient.appendChild(_stopElement);
            }
        },
        _applySvgBackground:function(svg, tagName)
        {
            var _div = cm.dom.util.createElement("div"), _data;

            _div.appendChild(svg);
            _data = _div.innerHTML.replace(/(lineargradient|radialgradient)/ig,
                    function(val) { return tagName; });
            this.mContentStyle.backgroundImage =
                "url(data:image/svg+xml;base64," + Base64.encode(_data) + ")";
        }
    },
    $override:
    {
        updateBorderColor:function(color) {
            this.mContentStyle.borderColor = cm.css.colorToRgbaString(color);
        },
        //background
        updateBackgroundGradient:function(gradient) {
            return gradient.type() === cm.display.abs.fill.Gradient.TYPE.RADIAL ?
                this._applyRadialGradient(gradient):
                this._applyLinearGradient(gradient);
        }
     }
});
/*
 * $Id: base64.js,v 2.6 2012/08/24 05:23:18 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */

(function(global) {
'use strict';
// if node.js, we use Buffer
var buffer;
if (typeof module !== 'undefined' && module.exports) {
    buffer = require('buffer').Buffer;
}
// constants
var b64chars
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var b64tab = function(bin) {
    var t = {};
    for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
    return t;
}(b64chars);
var fromCharCode = String.fromCharCode;
// encoder stuff
var cb_utob = function(c) {
    var cc = c.charCodeAt(0);
    return cc < 0x80 ? c
        : cc < 0x800 ? fromCharCode(0xc0 | (cc >>> 6))
                     + fromCharCode(0x80 | (cc & 0x3f))
        : fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
        + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
        + fromCharCode(0x80 | ( cc         & 0x3f));
};
var utob = function(u) {
    return u.replace(/[^\x00-\x7F]/g, cb_utob);
};
var cb_encode = function(ccc) {
    var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
    return chars.join('');
};
var btoa = global.btoa || function(b) {
    return b.replace(/[\s\S]{1,3}/g, cb_encode);
};
var _encode = buffer
    ? function (u) { return (new buffer(u)).toString('base64') } 
    : function (u) { return btoa(utob(u)) }
    ;
var encode = function(u, urisafe) {
    return !urisafe 
        ? _encode(u)
        : _encode(u).replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        });
};
var encodeURI = function(u) { return encode(u, true) };
// decoder stuff
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}/g;
var cb_btou = function(ccc) {
    return fromCharCode(
        ccc.length < 3 ? ((0x1f & ccc.charCodeAt(0)) << 6)
                       |  (0x3f & ccc.charCodeAt(1))
                       : ((0x0f & ccc.charCodeAt(0)) << 12)
                       | ((0x3f & ccc.charCodeAt(1)) << 6)
                       |  (0x3f & ccc.charCodeAt(2))
    );
};
var btou = function(b) {
    return b.replace(re_btou, cb_btou);
};
var cb_decode = function(cccc) {
    var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
          | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
          | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
          | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
};
var atob = global.atob || function(a){
    return a.replace(/[\s\S]{1,4}/g, cb_decode);
};
var _decode = buffer
    ? function(a) { return (new buffer(a, 'base64')).toString() }
    : function(a) { return btou(atob(a)) }
    ;
var decode = function(a){
    return _decode(
        a.replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
         .replace(/[^A-Za-z0-9\+\/]/g, '')
    );
};
// export Base64
global.Base64 = {
    atob: atob,
    btoa: btoa,
    fromBase64: decode,
    toBase64: encode,
    utob: utob,
    encode: encode,
    encodeURI: encodeURI,
    btou: btou,
    decode: decode
};
// if ES5 is available, make Base64.extendString() available
if (typeof Object.defineProperty === 'function') {
    var noEnum = function(v){
        return {value:v,enumerable:false,writable:true,configurable:true};
    };
    global.Base64.extendString = function () {
        Object.defineProperty(
            String.prototype, 'fromBase64', noEnum(function () {
            return decode(this)
        }));
        Object.defineProperty(
            String.prototype, 'toBase64', noEnum(function (urisafe) {
                return encode(this, urisafe)
        }));
    };
}
// that's it!
})(this);