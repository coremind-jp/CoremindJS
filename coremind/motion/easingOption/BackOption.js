cm.Class.create({
    $name:"cm.motion.easingOption.BackOption",
    $static:
    {
        baseEase:function (p) { return p*p; },
        skew:1.70158
    },
    $define:
    {
        BackOption:function(baseEase, skew)
        {
            this.baseEase = cm.equal.isFunction(baseEase) ?
                baseEase:
                cm.motion.easingOption.ElasticOption.baseEase;
            
            this.skew = cm.equal.isNumber(skew) ?
                skew:
                cm.motion.easingOption.ElasticOption.skew;
        },
        destroy:function(){},
        
        skewFix:function(val) { this.skew  = val; },
        skewRel:function(val) { this.skew += val; }
    }
});