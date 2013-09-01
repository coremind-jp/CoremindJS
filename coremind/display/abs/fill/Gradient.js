cls.exports(
//import
    "cm.display.abs.fill.Color",
    "cm.display.abs.fill.GradientColor",
{
    /** @name cm.display */
    $name:"cm.display.abs.fill.Gradient",
    $static:
    {
        TYPE:
        {
            LINER:"liner",
            RADIAL:"radial"
        },
        RADIAL_SHAPE:
        {
            CIRCLE:"circle",
            ELLIPS:"ellipse"
        },
        RADIAL_SIZE:
        {
            FARTHEST_SIDE:"farthest-side",
            CLOSEST_SIDE:"closest-side",
            FARTHEST_CORNER:"farthest-corner",
            CLOSEST_CORNER:"closest-corner"
        }
    },
    $define:
    /** @lends cm.display.abs.fill.Gradient.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.fill.Gradient
         * @extends cm.BaseObject
         */
        Gradient:function() {},
        destroy:function() {},
        
        _runtimeInitialize:function()
        {
            this.mBeginColor = new cm.display.abs.fill.Color();
            this.mOrigin = new cm.display.abs.Align();
            this.mColors = [];
            this.mThreshold = [];
            this.mDegree = 0;
            this.mType = this.$class.TYPE.LINER;
            this.mSize = this.$class.RADIAL_SIZE.FARTHEST_SIDE;
            this.mShape = this.$class.RADIAL_SHAPE.ELLIPS;

            this.clear = this._clear;
            this.editBeginColor = this.beginColor;
            this.editRadialOrigin = this.radialOrigin;
            this.pushColor = this._pushColor;
        },
        
        beginColor:function() {
            return this.mBeginColor;
        },
        editBeginColor:function()
        {
            this._runtimeInitialize();
            return this.editBeginColor();
        },

        radialOrigin:function() {
            return this.mOrigin;
        },
        editRadialOrigin:function() {
            this._runtimeInitialize();
            return this.editRadialOrigin();
        },

        colors:function() {
            return this.mColors;
        },
        colorsLength:function() {
            return this.mColors.length;
        },
        threshold:function() {
            return this.mThreshold;
        },
        
        pushColor:function(color, weight)
        {
            this._runtimeInitialize();
            return this.pushColor(color, weight);
        },
        _pushColor:function(color, weight)
        {
            this.mColors.push(new cm.display.abs.fill.GradientColor(color, weight));
            return this;
        },
        editColor:function(i)
        {
            if (i < 0 || this.mColors.length <= i)
                out.e(i, "is out of index. this array length is", this.mColors.length);
            return this.mColors[i];
        },
        
        type:function() { return this.mType; },
        setType:function(gradientType) {
            this.mType = gradientType;
            return this;
        },

        radialSize:function() { return this.mSize; },
        setRadialSize:function(radialSize) {
            this.mSize = radialSize;
            return this;
        },

        radialShape:function() { return this.mShape; },
        setRadialShape:function(radialShape) {
            this.mShape = radialShape;
            return this;
        },

        linearDegree:function() { return this.mDegree; },
        linearDegreeAbs:function(linearDegree) {
            this.mDegree = linearDegree;
            return this;
        },
        linearDegreeRel:function(linearDegree) {
            this.mDegree += linearDegree;
            return this;
        },

        clear:function() {
            this._runtimeInitialize();
            this.clear();
        },
        _clear:function() {
            this.mBeginColor.argbAbs(0);
            this.mColors.length = this.mThreshold.length = 0;
        },
        
        updateThreshold:function()
        {
            var i, _total = 0;
            for (i = 0, len = this.mColors.length; i < len; i++)
                _total += this.mColors[i].weight();
                
            for (i = 0, len = this.mColors.length; i < len; i++)
                this.mThreshold[i] = this.mColors[i].weight() / _total;
        },

        dumpProp:function()
        {
            if (eq.isUndefined(this.mBeginColor))
                this.log("\ngradient:", undefined);
            else
            {
                var _colors = "";
                for (var i = 0, len = this.mColors.length; i < len; i++)
                {
                    _colors += ex.string.concat(
                        "\t[", i, "]",
                        " color:"    , this.mColors[i].argb().toString(16),
                        " weight:"   , this.mColors[i].weight(),
                        " threshold:", this.mThreshold[i],
                        "\n");
                }
                this.log(ex.string.concat(
                    "\ntype:"      , this.mType,
                    "\ndegree:"    , this.mDegree,
                    "\nbeginColor:", this.mBeginColor.argb().toString(16),
                    "\ncolors:"    , _colors));
                this.mOrigin.dumpProp();
            }
        }
    }
});