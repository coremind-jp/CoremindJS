cm.Class.create(
//import
    "cm.event.Event",
    "cm.util.Dictionary",
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
        EventDispatcher:function(thisObject) {
            this.m_self = thisObject ? thisObject: this;
        },
        /**
         * このクラスはイベント処理を行う全てのクラスの基底クラスになるはずなので大量に生成される可能性がある。 
         * その為、初期化時に不用意にオブジェクト生成しない様にメソッド呼び出し直後までメンバーの初期化を行わないように実装している。
         * 各パブリックメソッドが呼ばれた時に初期化を行いその後、初期化を含まないメソッドに差し替えている。
         */
        _runtimeInitialize:function()
        {
            this.m_eventStream = {};
            this.m_callbacks = new cm.util.Dictionary();
            this.m_listenerCount = 0;
            
            //override method
            this.addEventListener = this.__addEventListener;
            this.hasEventListener = this.__hasEventListener;
            this.dispatchEvent = this.__dispatchEvent;
        },
        destroy:function()
        {
            this.m_self = this.m_eventStream = null;
        },
        /**
         * この オブジェクトに、特定のリスナーがあるかどうかを確認します.
         * 第二、第三引数は特定のeventTypeやコールバックについてリスナーの存在を問い合わせたい場合に指定します.
         * @param {Object} eventType イベントフローに送出されるイベントオブジェクト
         * @param {Object} listener リスナーオブジェクト
         * @param {Object} callback イベントを処理するリスナー関数
         */
        hasEventListener:function(eventType, listener, callback)
        {
            this._runtimeInitialize();
            this.hasEventListener.call(this, eventType, listener, callback);
        },
        __hasEventListener:function(eventType, listener, callback)
        {
            this.m_hasIndex = -1;
            
            //指定したlistenerObjectがキーとなっているコールバックが存在しない場合false
            this.m_hasData = this.m_callbacks.get(listener);
            if (this.m_hasData === undefined)
                return false;
                
            //指定したイベントタイプをlistenしているコールバックが存在しない場合false
            var _callbacks = this.m_hasData[eventType];
            if (_callbacks === undefined)
                return Boolean(eventType === undefined);
                
            //コールバックまで絞り込みしていない場合、true
            if (callback === undefined)
                return true;
                
            //コールバックの絞り込み
            for (var i = 0, _len = _callbacks.length; i < _len; i++)
            {
                if (_callbacks[i] === callback)
                {
                    this.m_hasIndex = i;
                    return true;
                }
            }
            
            //ここまでくる場合、全ての検索条件にマッチしないためfalse
            return false;
        },
        dispatchEvent:function()
        {
            this._runtimeInitialize();
            this.dispatchEvent.apply(this, arguments);
        },
        __dispatchEvent:function()
        {
            var _callbacks = this.m_eventStream[Array.prototype.shift.apply(arguments)];
            if (_callbacks)
                for ( var i = 0, _len = _callbacks.length; i < _len; i++)
                    _callbacks[i].bindCallback.apply(this, arguments);
        },
        /**
         * イベントリスナーオブジェクトをこのオブジェクトに登録し、リスナーがイベントの通知を受け取るようにします.
         * @param {Object} eventType イベントフローに送出されるイベントオブジェクト
         * @param {Object} listener リスナーオブジェクト
         * @param {Object} callback イベントを処理するリスナー関数
         * @param {Number} priority イベントリスナーの優先度レベルです.数値が大きくなるほど優先度が高くなります.複数のリスナーに対して同じ優先度が設定されている場合、それらは追加された順番に処理されます.デフォルトの優先度は 0 です.
         */
        addEventListener:function()
        {
            this._runtimeInitialize();
            this.addEventListener.apply(this, arguments);
        },
        __addEventListener:function()
        {
            if (arguments.length < 3)
              cm.log.e("Arguments Error.");
              
            var _eventType = arguments[0];
            var _listener  = arguments[1];
            var _callback  = arguments[2];
            var _priority  = arguments[3];
            
            if (this.hasEventListener(_eventType, _listener, _callback))
                return;
            
            this._addCallbackFromArray(_eventType, _listener, _callback);
            this._addCallbackFromStream(_eventType, _listener, _callback, _priority);
            delete this.m_hasData;
            delete this.m_hasIndex;
            this.m_listenerCount++;
        },
        /**
         * オブジェクトからリスナーを削除します.
         * @param {Object} eventType イベントフローに送出されるイベントオブジェクト
         * @param {Object} listener リスナーオブジェクト
         * @param {Object} callback イベントを処理するリスナー関数
         */
        removeEventListener:function(eventType, listener, callback)
        {
            if (!this.hasEventListener(eventType, listener, callback))
                return;
            
            this._removeCallbackFromStream(eventType);
            this._removeCallbackFromArray(eventType, listener);
            delete this.m_hasData;
            delete this.m_hasIndex;
            this.m_listenerCount--;
        },
        /**
         * オブジェクトに登録されているリスナーの数を返します.
         * @return {Number} 登録されているリスナーの数
         */
        getListenerCount:function()
        {
            return this.m_listenerCount;
        },
        /**#@+ @private */
        //コールバック管理配列にコールバックを追加
        _addCallbackFromArray:function(eventType, listener, callback)
        {
            var _data = this.m_hasData;
            
            if (_data === undefined)
            {
                _data = {};
                _data[eventType] = [callback];
                this.m_callbacks.set(listener, _data);
            }
            else
            {
                var _callbacks = _data[eventType];
                _callbacks === undefined ?
                    _data[eventType] = [callback]:
                    _callbacks.push(callback);
            }
        },
        //イベントフロー制御配列にコールバックを追加
        _addCallbackFromStream:function(eventType, listener, callback, priority)
        {
            var _eventStream = this.m_eventStream[eventType];
            var _stream = {
                priority    :priority === undefined ? 0: priority,
                callback    :callback,
                bindCallback:function()
                {
                    var _event = new cm.event.Event(this, eventType);
                    Array.prototype.unshift.call(arguments, _event);
                    callback.apply(listener, arguments);
                    _event.destroy();
                }
            };
            
            if (_eventStream === undefined)
            {
                this.m_eventStream[eventType] = [];
                this.m_eventStream[eventType].push(_stream);
            }
            else
            {
                for (var i = 0, _len = _eventStream.length; i < _len; i++)
                {
                    if (_eventStream[i].priority < _stream.priority)
                    {
                        _eventStream.splice(i, 0, _stream);
                        return;
                    }
                }
                _eventStream.push(_stream);
            }
        },  
        //イベントフロー制御配列からコールバックを削除
        _removeCallbackFromStream:function(eventType)
        {
            var _eventStream = this.m_eventStream[eventType];
            var _callback    = this.m_hasData[eventType][this.m_hasIndex];
            
            for (var i = 0, _len = _eventStream.length; i  < _len; i ++)
            {
                if (_eventStream[i].callback === _callback)
                {
                    _eventStream.splice(i, 1);
                    if (_eventStream.length == 0)
                        delete this.m_eventStream[eventType];
                    return;
                }
            }
        },
        //コールバック管理配列からコールバックを削除
        _removeCallbackFromArray:function(eventType, listener)
        {
            var _index = this.m_hasIndex;
            var _data = this.m_hasData;
            var _callbacks = _data[eventType];
            
            _callbacks.splice(_index, 1);
            if (_callbacks.length == 0)
            {
                delete _data[eventType];
                for (var p in _data) return;
                this.m_callbacks.del(listener);
            }
        }
        /**#@-*/
    }
});