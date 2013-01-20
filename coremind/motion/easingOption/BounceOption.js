cm.Class.create(
{
    $name:"cm.motion.easingOption.BounceOption",
    $define:
    {
        BounceOption:function(bounceNum, reflection)
        {
            this.mBounceNum = cm.equal.isNumber(bounceNum) ? bounceNum: 3;
            this.mRreflection = cm.equal.isNumber(reflection) ? reflection: .25;
        },
        destroy:function(){},
        
        bounceNum:function() { return this.mBounceNum; },
        bounceNumAbs:function(val) { this.mBounceNum  = val; },
        bounceNumRel:function(val) { this.mBounceNum += val; },

        reflection:function(val) { this.mRreflection = val; },
        reflectionAbs:function(val) { this.mRreflection  = val; },
        reflectionRel:function(val) { this.mRreflection += val; }
    }
});