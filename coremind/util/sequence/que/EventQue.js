cls.exports(
    "cm.core.DomInterface",
    "cm.event.EventDispatcher",
{
    $name:"cm.util.sequence.que.EventQue",
    $extends:"cm.util.sequence.que.Que",
    $define:
    {
        EventQue:function(object)
        {
            if (cm.dom.util.isHtmlDomElement(this.mTarget))
            {
                this._startObserve = this._startObserveByDomEvent;
                this._stopObserve = this._stopObserveByDomEvent;
            }
            else
            if (cm.event.EventDispatcher.equal(this.mTarget))
            {
                this._startObserve = this._startObserveByCmEvent;
                this._stopObserve = this._stopObserveByCmEvent;
            }
            else
                out.e("object is Event unsupported.");
        },
        destroy:function() {
            this.mTarget[this.mCallbackName] = this.mBeforeCallback;
        },
        observeEventType:function() {
            this.mEventType = eventType;
            return this;
        },
        _startObserveByDomEvent:function() {
            cm.dom.event.addEventListener(this.mEventType, this.mTarget, this._onDispatch, true);
        },
        _startObserveByCmEvent:function() {
            this.mTarget.addEventListener(this.mEventType, this.$bind("_onDispatch"));
        },
        _stopObserveByDomEvent:function() {
            cm.dom.event.removeEventListener(this.mEventType, this.mTarget, this._onDispatch, true);
        },
        _stopObserveByCmEvent:function() {
            this.mTarget.removeEventListener(this.mEventType, this.$bind("_onDispatch"));
        }
    }
});