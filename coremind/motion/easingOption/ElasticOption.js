cm.Class.create({
    $name:"cm.motion.easingOption.ElasticOption",
    $static:
    {
        baseEase:function (p) { return p*p*p*p*p*p; },//expo
        amplitude:3
    },
    $define:
    {
        ElasticOption:function(baseEase, amplitude)
        {
            this.baseEase = cm.equal.isFunction(baseEase) ?
                baseEase:
                cm.motion.easingOption.ElasticOption.baseEase;
            
            this.amplitude = cm.equal.isNumber(amplitude) ?
                amplitude:
                cm.motion.easingOption.ElasticOption.amplitude;
        },
        destroy:function(){},
        
        amplitudeFix:function(val) { this.amplitude  = val; },
        amplitudeRel:function(val) { this.amplitude += val; }
    }
});