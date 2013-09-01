cls.exports(
//import
    "cm.event.Event",
{
    /** @name cm.event */
    $name:"cm.event.EventDispatcher",
    $define:
    /** @lends cm.event.EventDispatcher.prototype */
    {
        /**
         *　EventDispatcher クラスは、イベントを送出するすべてのクラスの基本クラスです.
         * @constructor
         * @param {Object} thisObject listenerがイベントをキャッチした際に実行するコールバックに渡されるEventオブジェクトのtargetプロパティーに格納される参照.指定しない場合このオブジェクトとなります.
         * @name cm.event.EventDispatcher
         * @extends cm.BaseObject
         */
        EventDispatcher:function() {},
        destroy:function() {},
        getListenerCount:function() {
            var _num = 0;
            if (this.mListenersRefCounter)
                for (var i = 0, _len = this.mListenersRefCounter.length; i < _len; i++)
                    _num += this.mListenersRefCounter[i];
            return _num;
        },
        hasEventListener:function(eventType, listener)
        {
            return (!eventType && listener) ?
                        this._hasListenerByFunction(listener):
                        (eventType && !listener) ?
                            this._hasListenerByEventType(eventType):
                            (eventType && listener) ?
                                this._hasListener(eventType, listener):
                                false;
        },
        _hasListenerByFunction:function(listener) {
            return Boolean(this.mListeners && this.mListeners.indexOf(listener) > -1);
        },
        _hasListenerByEventType:function(eventType) {
            return Boolean(this.mEntity && this.mEntity[eventType] && this.mEntity[eventType].stream.length > 0);
        },
        _hasListener:function(eventType, listener) {
            return Boolean(this._hasListenerByFunction(listener) && this._hasListenerByEventType(eventType));
        },
        dispatchEvent:function()
        {
            var _type = Array.prototype.shift.apply(arguments);
            if (this._hasListenerByEventType(_type))
            {
                Array.prototype.unshift.call(arguments, new cm.event.Event(this, _type));
                var _entity= this._getEntity(_type);
                for (var i = 0, _len = _entity.stream.length; i < _len; i++)
                    this.mListeners[_entity.stream[i]].apply(null, arguments);
            }
        },
        addEventListener:function(eventType, listener, priority)
        {
            if (!eq.isString(eventType) || !eq.isFunction(listener))
                out.e("arguments error.");

            var _listenerIdx = this._addListener(listener);
            var _entity = this._getEntity(eventType);
            this._updateEntity(_entity, _listenerIdx, priority);
        },
        _addListener:function(listener)
        {
            if (!this.mListeners) this.mListeners = [];
            if (!this.mListenersRefCounter) this.mListenersRefCounter = [];

            var _idx = this.mListeners.indexOf(listener);
            if (_idx == -1)
            {
                _idx = this.mListeners.length;
                this.mListenersRefCounter[_idx] = 0;
                this.mListeners.push(listener);
            }
            return _idx;
        },
        _getEntity:function(eventType)
        {
            if (!this.mEntity) this.mEntity = {};

            if (eq.isUndefined(this.mEntity[eventType]))
                this.mEntity[eventType] = {
                    stream:[],
                    priority:[]
                };
            return this.mEntity[eventType];
        },
        _updateEntity:function(entity, listenerIdx, priority)
        {
            this._removeStream(entity, listenerIdx);

            for (var i = 0, _len = entity.priority.length; i < _len; i++)
                if (entity.priority[i] < priority)
                    return this._addStream(entity, i, listenerIdx, priority);
                
            this._addStream(entity, _len, listenerIdx, priority);
        },
        _removeStream:function(entity, listenerIdx)
        {
            var _idx = entity.stream.indexOf(listenerIdx);
            if (_idx > -1)
            {
                entity.stream.splice(_idx, 1);
                entity.priority.splice(_idx, 1);
                this.mListenersRefCounter[listenerIdx]--;
            }
            return this.mListenersRefCounter[listenerIdx];
        },
        _addStream:function(entity, entityIdx, listenerIdx, priority)
        {
            var _idx = entity.stream.indexOf(listenerIdx);
            if (_idx == -1)
            {
                entity.stream.splice(entityIdx, 0, listenerIdx);
                entity.priority.splice(entityIdx, 0, priority);
                this.mListenersRefCounter[listenerIdx]++;
            }
            return this.mListenersRefCounter[listenerIdx];
        },
        removeEventListener:function(eventType, listener)
        {
            if (this.getListenerCount() > 0)
                (!eventType && listener) ?
                    this._removeListenerByFunction(listener):
                    (eventType && !listener) ?
                        this._removeListenerByEventType(eventType):
                        (eventType && listener) ?
                            this._removeListener(eventType, listener):
                            out.e("arguments error.");
        },
        _removeListener:function(eventType, listener)
        {
            var _idx = this._removeFunction(listener);
            if (_idx > -1)
                this._removeStream(this._getEntity(eventType), _idx);
        },
        _removeListenerByFunction:function(listener)
        {
            var _idx = this._removeFunction(listener);
            if (_idx > -1)
                for (var p in this.mEntity)
                    this._removeStream(this.mEntity[p], _idx);
        },
        _removeListenerByEventType:function(eventType)
        {
            var _entity = this._getEntity(eventType);
            while (_entity.stream.length > 0)
            {
                var _listenerIdx = _entity.stream[0];
                if (this._removeStream(_entity, _listenerIdx) == 0)
                    this._removeFunction(this.mListeners[_listenerIdx]);
            }
        },
        _removeFunction:function(listener)
        {
            var _idx = this.mListeners.indexOf(listener);
            if (_idx > -1)
                this.mListeners[_idx] = null;
            return _idx;
        }
        /**#@-*/
    }
});