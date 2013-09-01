cls.exports(
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
            this.mReverse = false;
            this.mStretch = 1;
            this.mTransition = null;
            this.mProgress = 0;
        },
        destroy:function() {
            this.stop();
        },
        getCount:function() { return this.mCount; },
        getDelta:function() { return this.mDelta; },
        getProgress:function() { return this.mProgress; },
        getWaitTime:function() { return this.mWait; },
        /**
         * 計測を開始します.
         * 既に計測中だった場合それまでの計測データは破棄され上書きされます.
         * @param {Number} delay　更新間隔(ms)
         * @param {Number} repeat 繰り返し回数(0以下の値、または未指定の場合永続的に繰り返します)
         */
        start:function(delay, repeat, delta)
        {
            this.mWait = 0;
            this.mPause = false;
            this.mDelay = delay;
            this.mRepeat = isNaN(repeat) || repeat < 0 ? 0: repeat;
            this.mIsContinue = true;

            if (this.mReverse)
            {
                this.mProgress = 1;
                this.mCount = this.mRepeat;
                this.mDelta = isNaN(delta) || delta < 0 ?
                    this.mDelay * (this.mRepeat == 0 ? 1: this.mRepeat):
                    delta;
            }
            else
            {
                this.mProgress = 0;
                this.mCount = 0;
                this.mDelta = isNaN(delta) || delta < 0 ? 0: delta;
            }
            cm.util.UpdateDispatcher.addUpdater(this);
        },
        /**
         * 計測を停止し初期化します.
         * pause中だった場合pauseはキャンセルされます.
         */
        stop:function()
        {
            cm.util.UpdateDispatcher.removeUpdater(this);
            this.mWait = 0;
            this.mPause = false;
        },
        /**
         * 計測を一定時間停止します.
         * 直ちにwaitを解除したい場合このメソッドに0を指定します.
         * @param {Number} delay 計測停止時間(ms).
         */
        wait:function(delay) {
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
        toggleReverse:function()
        {
            this.mReverse = this.mReverse ? false: true;
            return this;
        },
        setTimeTransition:function(easing, easingOption) {
            this.mTransition = easing;
            this.mTransitionOption = easingOption;
        },
        timeStretch:function() { return this.mStretch; },
        timeStretchAbs:function(val) { this._timeStretch(val); },
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
            
            return this.isPause() || this.isWait(elapsed) ?
                true:
                this._updateProgress(dateNow, elapsed);
        },
        _updateProgress:function(dateNow, elapsed)
        {
            var _isComplete, _progress, _ratio;
            if (this.mReverse)
            {
                _isComplete = this._isCompleteByReverse;
                this.mDelta -= elapsed;
            }
            else
            {
                _isComplete = this._isCompleteByDefault;
                this.mDelta += elapsed;
            }
            _progress = this.mDelta / this.mDelay;
            _ratio = this.mProgress;

            this.mCount = _progress|0;
            _progress -= this.mCount;

            this.mProgress = eq.isNull(this.mTransition) ?
                _progress:
                this.mTransition(_progress, this.mTransitionOption);

            return _isComplete.call(this, _progress, _ratio, dateNow, elapsed);
        },
        _isCompleteByDefault:function(progress, ratio, dateNow, elapsed)
        {
            if (progress < ratio)
                return this.mRepeat == 0 || this.mCount < this.mRepeat ?
                    this.onUpdate():
                    this.onCompleteByPreprocess();
            else
            {
                this.update(dateNow, elapsed);
                return this.mIsContinue;
            }
        },
        _isCompleteByReverse:function(progress, ratio, dateNow, elapsed)
        {
            if (ratio < progress || progress < 0)
                return this.mRepeat == 0 || 0 < this.mCount ?
                    this.onUpdate():
                    this.onCompleteByPreprocess();
            else
            {
                this.update(dateNow, elapsed);
                return this.mIsContinue;
            }
        },
        update:function(dateNow, elapsed) {},
        onUpdate:function() {
            this.dispatchEvent(cm.event.Event.UPDATE);
            return this.mIsContinue;
        },
        onCompleteByPreprocess:function()
        {
            //onCompleteのコールバック関数実行時にUpdaterをもう一度再生を呼び出された場合、
            //再生直後にonCompleteコールバックの戻り値に寄って停止されてしまう問題を解決する為に、
            //UpdateDispatcherに戻す判定をmIsContinueに移譲する。
            this.mIsContinue = false;
            this.onComplete();
            return this.mIsContinue;
        },
        onComplete:function() {
            this.dispatchEvent(cm.event.Event.COMPLETE);
            return this.mIsContinue;
        },
        /**
         * pauseかを示す値を返します.
         * pause中だった場合、計測開始時刻をpause分ずらします.
         */
        isPause:function() {
            return this.mPause;
        },
        /**
         * waitかを示す値を返します.
         * wait中だった場合、待機時間からelapsedを差し引きます.
         */
        isWait:function(elapsed) {
            if (eq.isUndefined(elapsed)) elapsed = 0;
            return this.mWait > 0 && (this.mWait -= elapsed) > 0;
        }
        /**#@-*/
    }
});