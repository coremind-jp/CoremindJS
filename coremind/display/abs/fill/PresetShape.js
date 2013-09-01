cls.exports(
{
    /** @name cm.util */
    $name:"cm.display.abs.fill.PresetShape",
    $define:
    /** @lends cm.display.abs.fill.PresetShape.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.fill.PresetShape
         * @extends cm.BaseObject
         */
        PresetShape:function()
        {
            this.applyRect();
        },
        destroy:function() {},
        applyRect:function()
        {
            this.mTlcw = this.mTlch =
            this.mBlcw = this.mBlch =
            this.mTrcw = this.mTrch =
            this.mBrcw = this.mBrch = this.mGroupRound = 0;
            return this;
        },
        applyCircle:function() {
            this.mTlcw = this.mTlch =
            this.mBlcw = this.mBlch =
            this.mTrcw = this.mTrch =
            this.mBrcw = this.mBrch = -1;
            return this;
        },
        round:function() {
            return this.mGroupRound;
        },
        roundAbs:function(arc) {
            this.mTlcw = this.mTlch =
            this.mBlcw = this.mBlch =
            this.mTrcw = this.mTrch =
            this.mBrcw = this.mBrch = this.mGroupRound = arc;
            return this;
        },
        
        //topLeft
        topLeftCorner:function() { return this.mTlcw; },
        topLeftCornerAbs:function(val) {
            this.topLeftCornerWidthAbs(val);
            this.topLeftCornerHeightAbs(val);
            return this;
        },
        topLeftCornerRel:function(val) {
            this.topLeftCornerWidthRel(val);
            this.topLeftCornerHeightRel(val);
            return this;
        },
        topLeftCornerWidth:function() { return this.mTlcw; },
        topLeftCornerWidthAbs:function(val) {
            this.mTlcw = val < 0 ? 0: val;
            return this;
        },
        topLeftCornerWidthRel:function(val) {
            return this.topLeftCornerWidthAbs(this.mTlcw + val);
        },
        topLeftCornerHeight:function() { return this.mTlch; },
        topLeftCornerHeightAbs:function(val) {
            this.mTlch = val < 0 ? 0: val;
            return this;
        },
        topLeftCornerHeightRel:function(val) {
            return this.topLeftCornerHeightAbs(this.mTlch + val);
        },
        
        //bottomLeft
        bottomLeftCorner:function() { return this.mBlcw; },
        bottomLeftCornerAbs:function(val) {
            this.bottomLeftCornerWidthAbs(val);
            this.bottomLeftCornerHeightAbs(val);
            return this;
        },
        bottomLeftCornerRel:function(val) {
            this.bottomLeftCornerWidthRel(val);
            this.bottomLeftCornerHeightRel(val);
            return this;
        },
        bottomLeftCornerWidth:function() { return this.mBlcw; },
        bottomLeftCornerWidthAbs:function(val) {
            this.mBlcw = val < 0 ? 0: val;
            return this;
        },
        bottomLeftCornerWidthRel:function(val)
        {
            return this.bottomLeftCornerWidthAbs(this.mBlcw + val);
        },
        bottomLeftCornerHeight:function() { return this.mBlch; },
        bottomLeftCornerHeightAbs:function(val) {
            this.mBlch = val < 0 ? 0: val;
            return this;
        },
        bottomLeftCornerHeightRel:function(val) {
            return this.bottomLeftCornerHeightAbs(this.mBlch + val);
        },
        
        //topRight
        topRightCorner:function() { return this.mTrcw; },
        topRightCornerAbs:function(val) {
            this.topRightCornerWidthAbs(val);
            this.topRightCornerHeightAbs(val);
            return this;
        },
        topRightCornerRel:function(val) {
            this.topRightCornerWidthRel(val);
            this.topRightCornerHeightRel(val);
            return this;
        },
        topRightCornerWidth:function() { return this.mTrcw; },
        topRightCornerWidthAbs:function(val) {
            this.mTrcw = val < 0 ? 0: val;
            return this;
        },
        topRightCornerWidthRel:function(val) {
            return this.topRightCornerWidthAbs(this.mTrcw + val);
        },
        topRightCornerHeight:function() { return this.mTrch; },
        topRightCornerHeightAbs:function(val) {
            this.mTrch = val < 0 ? 0: val;
            return this;
        },
        topRightCornerHeightRel:function(val) {
            return this.topRightCornerHeightAbs(this.mTrch + val);
        },
        
        //bottomRight
        bottomRightCorner:function() { return this.mBrcw; },
        bottomRightCornerAbs:function(val) {
            this.bottomRightCornerWidthAbs(val);
            this.bottomRightCornerHeightAbs(val);
            return this;
        },
        bottomRightCornerRel:function(val) {
            this.bottomRightCornerWidthRel(val);
            this.bottomRightCornerHeightRel(val);
            return this;
        },
        bottomRightCornerWidth:function() { return this.mBrcw; },
        bottomRightCornerWidthAbs:function(val) {
            this.mBrcw = val < 0 ? 0: val;
            return this;
        },
        bottomRightCornerWidthRel:function(val) {
            return this.bottomRightCornerWidthAbs(this.mBrcw + val);
        },
        bottomRightCornerHeight:function() { return this.mBrch; },
        bottomRightCornerHeightAbs:function(val) {
            this.mBrch = val < 0 ? 0: val;
            return this;
        },
        bottomRightCornerHeightRel:function(val) {
            return this.bottomRightCornerWidthAbs(this.mBrch + val);
        },
        
        isRect:function() {
            return this.mTlcw + this.mTlch + this.mBlcw + this.mBlch
                 + this.mTrcw + this.mTrch + this.mBrcw + this.mBrch == 0;
        },
        isCircle:function() {
            return this.mTlcw < 0 && this.mTlch < 0 && this.mBlcw < 0 && this.mBlch < 0 
                && this.mTrcw < 0 && this.mTrch < 0 && this.mBrcw < 0 && this.mBrch < 0;
        },
        isRound:function() {
            return !this.isRect() && !this.isCircle();
        },

        /**
         * 文字列表現を取得します.
         */
        dumpProp:function()
        {
            this.log(ex.string.concat(
                "\ntopLeftCornerWidth:" ,       this.topLeftCornerWidth(),
                "\ntopLeftCornerHeight:" ,      this.topLeftCornerHeight(),
                "\nbottomLeftCornerWidth:" ,    this.bottomLeftCornerWidth(),
                "\nbottomLeftCornerHeight:" ,   this.bottomLeftCornerHeight(),
                "\ntopRightCornerWidth:" ,      this.topRightCornerWidth(),
                "\ntopRightCornerHeight:" ,     this.topRightCornerHeight(),
                "\nbottomRightCornerWidth:" ,   this.bottomRightCornerWidth(),
                "\nbottomRightCornerHeight:" ,  this.bottomRightCornerHeight()));
        }
    }
});