cls.exports(
{
    $name:"cm.motion.easingOption.BackOption",
    $define:
    {
        BackOption:function(baseEase, skew)
        {
            this.mBaseEase = eq.isFunction(baseEase) ? baseEase: function (p) { return p*p; };
            this.mSkew = eq.isNumber(skew) ? skew: 1.70158;
        },
        destroy:function(){},
        
        baseEase:function() { return this.mBaseEase; },
        setBaseEase:function(easing) { this.mBaseEase = easing; },
        
        skew:function(val) { return this.mSkew; },
        skewAbs:function(val) { this.mSkew  = val; },
        skewRel:function(val) { this.mSkew += val; }
    }
});