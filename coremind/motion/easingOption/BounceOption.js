cls.exports(
{
    $name:"cm.motion.easingOption.BounceOption",
    $define:
    {
        BounceOption:function(bounceNum, reflection)
        {
            this.mBounceNum = eq.isNumber(bounceNum) ? bounceNum: 3;
            this.mRreflection = eq.isNumber(reflection) ? reflection: .25;
        },
        destroy:function(){},
        
        bounceNum:function() { return this.mBounceNum; },
        bounceNumAbs:function(val) { this.mBounceNum  = val; },
        bounceNumRel:function(val) { this.mBounceNum += val; },

        reflection:function(val) { return this.mRreflection; },
        reflectionAbs:function(val) { this.mRreflection  = val; },
        reflectionRel:function(val) { this.mRreflection += val; }
    }
});