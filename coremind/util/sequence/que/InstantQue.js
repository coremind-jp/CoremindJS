cls.exports(
{
    $name:"cm.util.sequence.que.InstantQue",
    $extends:"cm.util.sequence.que.Que",
    $define:
    {
        InstantQue:function(target) {},
        destroy:function() {}
    },
    $override:
    {
        invoke:function()
        {
            var _arg = !this.mArguments ? arguments: this.mArguments;
            this.mTarget[this.mMethodName].apply(this.mTarget, _arg);

            for (var i = 0, len = this.mSequencerCallbacks.length; i < len; i++)
                this.mSequencerCallbacks[i]();
        }
    }
});