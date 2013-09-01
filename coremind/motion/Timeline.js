cls.exports(
    "cm.util.Updater",
{
    $name:"cm.motion.Timeline",
    $extends:"cm.util.sequence.Sequencer",
    $define:
    {
        Timeline:function(isLinked, isReverse)
        {
            this.mTweeners = [];
            this.mTriggerPoints = [];

            this.mEditPoint = 0;
            this.mEditTweeners = null;
        },
        destroy:function()
        {
            var _invokeNextQue = this.$bind("_invokeNextQue");
            for (var i = 0, len = mSequence.length; i < len; i++)
                cm.util.sequence.que.QueContainer.getQue(mSequence[i])
                    ._spliceSequencerCallback(_invokeNextQue);
        },
        setTrigger:function(delay)
        {
            this.mEditPoint = delay;

            for (var i = 0, len = this.mTriggerPoints.length; i < len; i++)
            {
                if (delay < this.mTriggerPoints[i])
                    continue;
                else
                if (delay == this.mTriggerPoints[i])
                    this.mEditTweeners = this.mEditTweeners;
                else
                if (this.mTriggerPoints[i] < delay)
                {
                    this.mEditTweeners
                }
            }
            return this;
        },
        pushTweener:function()
        {
            var _tweeners = this.mTriggers[]
            this.mCurrent = 0;
            this._getQueObject().invoke();
        },
        resume:function(que, throwNum)
        {
            var _containerIndex = que._getContainerIndex();
            var _incidence = 0;

            throwNum = eq.isNumber(throwNum) ? throwNum: 0;
            for (var i = 0, len = this.mSequence.length; i < len; i++)
            {
                if (_containerIndex == this.mSequence[i]
                &&  _incidence++ == throwNum)
                {
                    this.mCurrent = i;
                    this._getQueObject().invoke();
                }
            }
        },
        _getQueObject:function() {
            return cm.util.sequence.que.QueContainer.get(this.mSequence[this.mCurrent]);
        },
        _invokeNextQue:function()
        {
            (this.mCurrent += 1) < this.mSequence.length ?
                this._getQueObject().invoke():
                this.linked ?
                    this.begin():
                    this.dispatchEvent(cm.event.Event.COMPLETE); 
        }
    }
});