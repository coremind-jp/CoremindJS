cls.exports(
{
    $name:"cm.motion.Tweener",
    $extends:"cm.util.Updater",
    $define:
    {
        Tweener:function() {
            this.mTweens = [];
        },
        destroy:function()
        {
            while (this.mTweens.length > 0)
            {
                var tween = this.mTweens.shift();
                if (!tween.isRecycle) tween.destroy();
            }
        },
        add:function(tween)
        {
            tween.build();
            this.mTweens[this.mTweens.length] = tween;
            return this;
        },
        remove:function(tween)
        {
            var i = this.mTweens.indexOf(tween);
            if (i > -1) this.mTweens.splice(i, 1);
            return this;
        }
    },
    $override:
    {
        start:function(duration, repeat, isOnce)
        {
            this.mIsOnce = isOnce;
            for(var i = 0, len = this.mTweens.length; i < len; i++)
                this.mTweens[i].update(this.mReverse ? 1: 0);
            this.$super("start")(duration, repeat);
            return this;
        },
        update:function(duration, repeat)
        {
            for(var i = 0, len = this.mTweens.length; i < len; i++)
                if (!this.mTweens[i].isOverrided)
                    this.mTweens[i].update(this.mProgress);
        },
        onUpdate:function()
        {
            for(var i = 0, len = this.mTweens.length; i < len; i++)
                this.mTweens[i].update(this.mReverse ? 0: 1);
            return this.mIsContinue;
        },
        onComplete:function()
        {
            for(var i = 0, len = this.mTweens.length; i < len; i++)
                this.mTweens[i].update(this.mReverse ? 0: 1);

            if (!this.mIsContinue && this.mIsOnce)
                this.destroy();

            return this.mIsContinue;
        }
    }
});