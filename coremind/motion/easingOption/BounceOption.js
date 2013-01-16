cm.Class.create({
    $name:"cm.motion.easingOption.BounceOption",
    $static:
    {
        bounceNum:3,
        reflection:.25
    },
    $define:
    {
        BounceOption:function(bounceNum, reflection)
        {
            this.bounceNum = cm.equal.isNumber(bounceNum) ?
                bounceNum:
                cm.motion.easingOption.ElasticOption.bounceNum;
            
            this.reflection = cm.equal.isNumber(reflection) ?
                reflection:
                cm.motion.easingOption.ElasticOption.reflection;
        },
        destroy:function(){},
        
        bounceNumFix:function(val) { this.bounceNum  = val; },
        bounceNumRel:function(val) { this.bounceNum += val; },
        reflectionFix:function(val) { this.reflection  = val; },
        reflectionRel:function(val) { this.reflection += val; }
    }
});