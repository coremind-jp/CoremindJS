cm.Class.create(
{
    $name:"cm.motion.easingOption.BackOption",
    $define:
    {
        BackOption:function(baseEase, skew)
        {
            this.mBaseEase = cm.equal.isFunction(baseEase) ? baseEase: function (p) { return p*p; };
            this.mSkew = cm.equal.isNumber(skew) ? skew: 1.70158;
        },
        destroy:function(){},
        
        baseEase:function() { return this.mBaseEase; },
        setBaseEase:function(easing) { this.mBaseEase = easing; },
        
        skew:function(val) { this.mSkew  = val; },
        skewAbs:function(val) { this.mSkew  = val; },
        skewRel:function(val) { this.mSkew += val; }
    }
});