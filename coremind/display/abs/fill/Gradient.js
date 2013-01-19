cm.Class.create(
//import
    "cm.display.abs.fill.Color",
{
    /** @name cm.display */
    $name:"cm.display.abs.fill.Gradient",
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
            this.mColors = [];
            this.mWeight = [];
            this.mThreshold = [];
            this.mDegree = 0;

            this.clear = this._clear;
            this.editBeginColor = this.beginColor;
            this.pushColors = this._pushColors;
        },
        
        beginColor:function() {
            return this.mBeginColor;
        },
        colors:function() {
            return this.mColors;
        },
        threshold:function() {
            return this.mThreshold;
        },
        
        editBeginColor:function()
        {
            this._runtimeInitialize();
            this.editBeginColor();
        },
        
        pushColors:function(color, weight)
        {
            this._runtimeInitialize();
            return this.pushColors(color, weight);
        },
        _pushColors:function(color, weight)
        {
            this.mColors.push(color);
            this.mWeight.push(cm.equal.isNumber(weight) ? weight: 1);
            this._updateThreshold();
            return this;
        },
        colorsLength:function() {
            return this.mColors.length;
        },
        editColors:function(i, weight)
        {
            if (i < 0 || this.mColors.length <= i)
                cm.log.e(i, "is out of index. this array length is", this.mColors.length);
                
            if (cm.equal.isNumber(weight))
            {
                this.mWeight[i] = weight;
                this._updateThreshold();
            }
            return this.mColors[i];
        },
        
        degree:function() {
            return this.mDegree;
        },
        degreeAbs:function(degree) {
            this.mDegree = degree;
        },
        degreeRel:function(degree) {
            this.mDegree += degree;
        }

        clear:function() {
            this._runtimeInitialize();
            this.clear();
        },
        _clear:function() {
            this.mBeginColor.argbAbs(0);
            this.mColors.length = this.mWeight.length = this.mThreshold.length = 0;
        },
        
        _updateThreshold:function()
        {
            var _total = 0;
            for (var i = 0, len = this.mWeight.length; i < len; i++)
                _total += this.mWeight[i];
                
            for (var i = 0, len = this.mWeight.length; i < len; i++)
                this.mThreshold[i] = this.mWeight[i] / _total;
        }

    }
});