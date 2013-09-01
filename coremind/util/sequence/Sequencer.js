cls.exports(
    "cm.event.Event",
    "cm.util.sequence.que.QueContainer",
{
    $name:"cm.util.sequence.Sequencer",
    $extends:"cm.event.EventDispatcher",
    $define:
    {
        Sequencer:function(isLinked, isReverse)
        {
            //public
            this.linked = Boolean(isLinked);
            this.mCurrent = 0;
            this.mSequence = [];
        },
        destroy:function()
        {
            var _invokeNextQue = this.$bind("_invokeNextQue");
            for (var i = 0, len = mSequence.length; i < len; i++)
                cm.util.sequence.que.QueContainer.getQue(mSequence[i])
                    ._spliceSequencerCallback(_invokeNextQue);
        },
        setSequence:function()
        {
            var
                _queArray = eq.isArray(arguments[0]) ?
                    arguments[0].slice(0):
                    arguments,
                _que;

            this.mSequence.length = 0;
            for (var i = 0, len = _queArray.length; i < len; i++)
            {
                _que = _queArray[i];
                _que._pushSequencerCallback(this.$bind("_invokeNextQue"));
                this.mSequence[i] = _que._getContainerIndex();
            }

            return this;
        },
        begin:function()
        {
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