cm.Class.create(
{
    /** @name cm.util */
    $name:"cm.display.abs.fill.Color",
    $static:{
        sub:function(color1, color2)
        {
            var _result = new cm.display.abs.fill.Color();
            _result.aAbs(color1.a() - color2.a());
            _result.rAbs(color1.r() - color2.r());
            _result.gAbs(color1.g() - color2.g());
            _result.bAbs(color1.b() - color2.b());
            return _result;
        },
        add:function(color1, color2)
        {
            var _result = new cm.display.abs.fill.Color();
            _result.aAbs(color1.a() + color2.a());
            _result.rAbs(color1.r() + color2.r());
            _result.gAbs(color1.g() + color2.g());
            _result.bAbs(color1.b() + color2.b());
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
            this.argbAbs(hex ? hex: 0);
        },
        destroy:function() {},
        
        argb:function() {
            return (this.a() << 24) + this.rgb();
        },
        argbAbs:function(hex)
        {
            this.aAbs(hex >>> 24);
            this.rAbs(hex << 8 >>> 24);
            this.gAbs(hex << 16 >>> 24);
            this.bAbs(hex << 24 >>> 24);
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
        aAbs:function(val) {
            return this._wrapAbs("alpha", val);
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
        rAbs:function(val) {
            return this._wrapAbs("red", val);
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
        gAbs:function(val) {
            return this._wrapAbs("green", val);
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
        bAbs:function(val) {
            return this._wrapAbs("blue", val);
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
        
        _wrapAbs:function(prop, val)
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