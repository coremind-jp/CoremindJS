cls.exports(
{
    $name:"cm.motion.easingOption.ElasticOption",
    $define:
    {
        ElasticOption:function(baseEase, amplitude)
        {
            this.mBaseEase = eq.isFunction(baseEase) ? baseEase: function (p) { return p*p*p*p*p*p; };//expo
            this.mAmplitude = eq.isNumber(amplitude) ? amplitude: 3;
        },
        destroy:function(){},
        
        baseEase:function() { return this.mBaseEase; },
        setBaseEase:function(easing) { this.mBaseEase = easing; },

        amplitude:function() { return this.mAmplitude; },
        amplitudeAbs:function(val) { this.mAmplitude  = val; },
        amplitudeRel:function(val) { this.mAmplitude += val; }
    }
});