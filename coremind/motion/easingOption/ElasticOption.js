cm.Class.create(
{
    $name:"cm.motion.easingOption.ElasticOption",
    $define:
    {
        ElasticOption:function(baseEase, amplitude)
        {
            this.mBaseEase = cm.equal.isFunction(baseEase) ? baseEase: cm.motion.Easing.ExpoIn;
            this.mAmplitude = cm.equal.isNumber(amplitude) ? amplitude: 3;
        },
        destroy:function(){},
        
        baseEase:function() { return this.mBaseEase; },
        setBaseEase:function(easing) { this.mBaseEase = easing; },

        amplitude:function() { return this.mAmplitude; },
        amplitudeAbs:function(val) { this.mAmplitude  = val; },
        amplitudeRel:function(val) { this.mAmplitude += val; }
    }
});