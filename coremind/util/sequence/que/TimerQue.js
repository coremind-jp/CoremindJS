cls.exports(
    "cm.util.Updater",
{
    $name:"cm.util.sequence.que.TimerQue",
    $extends:"cm.util.sequence.que.Que",
    $define:
    {
        TimerQue:function(target) {},
        destroy:function() {},
        observeDuration:function(duration)
        {
            this.mDuration = duration;
            return this;
        }
    },
    $override:
    {
        _startObserve:function()
        {
            var _d = this.$bind("_onDispatch");
            var _updater = new cm.util.Updater();
            _updater.onComplete = function() { _d(); return false; };
            _updater.start(this.mDuration, 1);
        }
    }
});