cm.Class.create(
{
    /** @name cm.util */
    $name:"cm.display.abs.fill.Color",
    $static:{
        sub:function(color1, color2)
        {
            var _result = new cm.display.abs.fill.Color();
            _result.aFix(color1.a() - color2.a());
            _result.rFix(color1.r() - color2.r());
            _result.gFix(color1.g() - color2.g());
            _result.bFix(color1.b() - color2.b());
            return _result;
        },
        add:function(color1, color2)
        {
            var _result = new cm.display.abs.fill.Color();
            _result.aFix(color1.a() + color2.a());
            _result.rFix(color1.r() + color2.r());
            _result.gFix(color1.g() + color2.g());
            _result.bFix(color1.b() + color2.b());
            return _result;
        }
    },
    $define:
    /** @lends cm.display.abs.fill.Color.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.fill.Color
         * @extends cm.BaseObject
         */
        Color:function(hex)
        {
            this.mHex = {};
            this.mRatio = {};
            this.argbFix(hex ? hex: 0);
        },
        destroy:function() {},
        
        argb:function() {
            return (this.a() << 24) + this.rgb();
        },
        argbFix:function(hex)
        {
            this.aFix(hex >>> 24);
            this.rFix(hex << 8 >>> 24);
            this.gFix(hex << 16 >>> 24);
            this.bFix(hex << 24 >>> 24);
            return this;
        },
        
        rgb:function() {
            return cm.string.concat(
                ("0" + this.r().toString(16)).slice(-2),
                ("0" + this.g().toString(16)).slice(-2),
                ("0" + this.b().toString(16)).slice(-2));
        },
        
        //alpha
        a:function() {
            return this.mHex.alpha;
        },
        aFix:function(val) {
            return this._wrapFix("alpha", val);
        },
        aRel:function(val) {
            return this._wrapRel("alpha", val);
        },
        aRatio:function()
        {
            if (cm.equal.isUndefined(this.mRatio.alpha))
                this.mRatio.alpha = this.a() / 0xFF;
            return this.mHex.alpha / 0xFF;
        },
        //red
        r:function() {
            return this.mHex.red;
        },
        rFix:function(val) {
            return this._wrapFix("red", val);
        },
        rRel:function(val) {
            return this._wrapRel("red", val);
        },
        rRatio:function()
        {
            if (cm.equal.isUndefined(this.mRatio.red))
                this.mRatio.red = this.r() / 0xFF;
            return this.mRatio.red;
        },
        //green
        g:function() {
            return this.mHex.green;
        },
        gFix:function(val) {
            return this._wrapFix("green", val);
        },
        gRel:function(val) {
            return this._wrapRel("green", val);
        },
        gRatio:function()
        {
            if (cm.equal.isUndefined(this.mRatio.green))
                this.mRatio.green = this.g() / 0xFF;
            return this.mRatio.green;
        },
        //blue
        b:function() {
            return this.mHex.blue;
        },
        bFix:function(val) {
            return this._wrapFix("blue", val);
        },
        bRel:function(val) {
            return this._wrapRel("blue", val);
        },
        bRatio:function()
        {
            if (cm.equal.isUndefined(this.mRatio.blue))
                this.mRatio.blue = this.b() / 0xFF;
            return this.mRatio.blue;
        },
        
        _wrapFix:function(prop, val)
        {
            val |= 0;
            val = 0 > val ? 0: 255 < val ? 255: val;
            if (val !== this.mHex[prop])
            {
                delete this.mRatio[prop];
                this.mHex[prop] = val;
            }
            return this;
        },
        _wrapRel:function(prop, val)
        {
            val |= 0;
            val = 0 > val ? 0: 255 < val ? 255: val;
            if (val !== 0)
            {
                delete this.mRatio[prop];
                this.mHex[prop] += val;
            }
            return this;
        },
        
        /**
         * 文字列表現を取得します.
         */
        toString:function() {
            return this.argb().toString(16);
        }
    }
});