cm.Class.create(
    "cm.event.Event",
    "cm.util.UpdateDispatcher",
{
    /** @name cm.util */
    $name:"cm.util.Updater",
    $extends:"cm.event.EventDispatcher",
    $define:
    /** @lends cm.util.Updater.prototype */
    {
        /**
         *　Updater クラスは、時間を監視するクラスです.
         * @constructor
         * @name cm.util.Timer
         * @extends cm.BaseObject
         */
        Updater:function()
        {
            this.mStretch = 1;
            this.mReverse = false;
        },
        destroy:function() {
            this.stop();
        },
        getCount:function() { return this.mCount; },
        getDelta:function() { return this.mDelta; },
        getRatio:function() { return this.mRatio; },
        getWaitTime:function() { return this.mWait; },
        /**
         * 計測を開始します.
         * 既に計測中だった場合それまでの計測データは破棄され上書きされます.
         * @param {Number} delay　更新間隔(ms)
         * @param {Number} repeat 繰り返し回数(0以下の値、または未指定の場合永続的に繰り返します)
         */
        start:function(delay, repeat, delta)
        {
            this.mDelay = delay;
            this.mRepeate = isNaN(repeat) || repeat < 0 ? 0: repeat;
            this.mDelta = isNaN(delta) || delta < 0 ? 0: delta;
            this._resetDetail();
            cm.util.UpdateDispatcher.addUpdater(this);
        },
        _resetDetail:function()
        {
            this.mWaitOffset = this.mCount = this.mRatio = this.mWait = 0;
            this.mPause = false;
        },
        /**
         * 計測を停止し初期化します.
         * pause中だった場合pauseはキャンセルされます.
         */
        stop:function()
        {
            cm.util.UpdateDispatcher.removeUpdater(this);
            this._resetDetail();
        },
        /**
         * 計測を一定時間停止します.
         * 直ちにwaitを解除したい場合このメソッドに0を指定します.
         * @param {Number} delay 計測停止時間(ms).
         */
        wait:function(delay)
        {
            if (this.mWait > 0) this.mWaitOffset -= this.mWait;
            this.mWaitOffset += delay;
            this.mWait = delay;
        },
        /**
         * 計測を停止します.
         * resumeメソッドを呼び出すまで計測は再開されません.
         */
        pause:function() {
            this.mPause = true;
        },
        /**
         * 計測を再開します.
         */
        resume:function() {
            this.mPause = false;
        },
        reverse:function(val)
        {
            this.mReverse = val;
            return this;
        },
        timeStretch:function() { return this.mStretch; },
        timeStretchFix:function(val) { this._timeStretch(val); },
        timeStretchRel:function(val) { this._timeStretch(val + this.mStretch); },
        _timeStretch:function(val)
        {
            this.mStretch = val;
            return this;
        },
        /**
         * 時間計測値を更新します. 
         * @param {Number} dateNow 現在のDate.now()値
         * @param {Number} elapsed 前回のupdateからの経過時間(ms)
         */
        _update:function(dateNow, elapsed)
        {
            elapsed = this.mStretch != 1 ? this.mStretch * elapsed: elapsed;
            
            return this._isPause() || this._isWait(elapsed) ?
                true:
                this._updateDetail(dateNow, this.mReverse ? -elapsed: elapsed);
        },
        _updateDetail:function(dateNow, elapsed)
        {
            this.mDelta += elapsed;
            var _per = this.mDelta / this.mDelay;
            var _currentCount = parseInt(_per);
            this.mRatio = _per - _currentCount;
            
            if (this.mCount != _currentCount)
            {
                this.mCount = _currentCount;
                return this.mRepeate <= this.mCount ? this.onComplete(): this.onUpdate();
            }
            
            if (this.mRatio < 0)
                return this.onComplete();
            
            this.update(dateNow, elapsed);
            return true;
        },
        update:function(dateNow, elapsed) {},
        onUpdate:function() {
            this.dispatchEvent(cm.event.Event.UPDATE);
            return true;
        },
        onComplete:function() {
            this.dispatchEvent(cm.event.Event.COMPLETE);
            return false;
        },
        /**
         * pauseかを示す値を返します.
         * pause中だった場合、計測開始時刻をpause分ずらします.
         */
        _isPause:function() {
            return this.mPause;
        },
        /**
         * waitかを示す値を返します.
         * wait中だった場合、待機時間からelapsedを差し引きます.
         */
        _isWait:function(elapsed) {
            return this.mWait > 0 && (this.mWait -= elapsed) > 0;
        }
        /**#@-*/
    }
});