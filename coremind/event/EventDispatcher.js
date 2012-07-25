cm.using("cm.data.Dictionary");
cm.using("cm.event.Event");
cm.Class.create("cm.event.EventDispatcher",
{
	EventDispatcher:function(thisObject)
	{
	    this.m_self = thisObject ? thisObject: this;
	    this.m_initFlag = true;
	    this.m_listenerCount = 0;
	},
	destroy:function()
	{
		this.m_callbacks.destroy();
		this.m_self = this.m_eventStream = this.m_callbacks = null;
	},
	/**
	 * @param {Object} listener
     * @param {Object} eventType
     * @param {Object} callbak
	 */
	hasEventListener:function(listener, eventType, callback)
	{
	    if (this.m_initFlag) return false;
	    
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
        if (this.m_initFlag) return;
        
	    var _callbacks = this.m_eventStream[Array.prototype.shift.apply(arguments)];
	    if (_callbacks)
	        for ( var i = 0, _len = _callbacks.length; i < _len; i++)
	            _callbacks[i].bindCallback.apply(null, arguments);
	},
	/**
	 * @param {Object} listener
     * @param {Object} eventType
     * @param {Object} callbak
     * @param {Number} proprity
	 */
	addEventListener:function()
	{
		if (arguments.length < 3)
		  throw new Error("Arguments Error.");
		  
		var _listener  = arguments[0];
		var _eventType = arguments[1];
		var _callback  = arguments[2];
		var _priority  = arguments[3];
		
        if (this.m_initFlag)
        {
            this.m_initFlag = false;
            this.m_eventStream = {};
            this.m_callbacks = new cm.data.Dictionary();
        }
        
        if (this.hasEventListener(_listener, _eventType, _callback)) return;
        
		this._addCallbackFromArray(_listener, _eventType, _callback);
		this._addCallbackFromStream(_listener, _eventType, _callback, _priority);
        delete this.m_hasData;
        delete this.m_hasIndex;
		this.m_listenerCount++;
	},
    //コールバック管理配列にコールバックを追加
	_addCallbackFromArray:function(listener, eventType, callback)
	{
		var _data = this.m_hasData;
		
		if (_data === undefined)
		{
			_data = {};
			_data[_eventType] = [callback];
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
	_addCallbackFromStream:function(listener, eventType, callback, priority)
	{
		var _this = this.m_self;
		var _eventStream = this.m_eventStream[eventType];
		var _stream = {
			priority    :priority === undefined ? 0: priority,
            callback    :callback,
			bindCallback:function()
				{
					var _event = new cm.event.Event(_this, eventType);
					Array.prototype.unshift.call(arguments, _event);
					callback.apply(listener, arguments);
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
                if (_eventStream[i].priority < _data.priority)
                {
                    _eventStream.splice(i, 0, _stream);
                	return;
                }
			}
			_eventStream.push(_stream);
		}
	},	
	/**
	 * @param {Object} listener
     * @param {Object} eventType
     * @param {Object} callbak
	 */
	removeEventListener:function(listener, eventType, callbak)
	{
		if (!this.hasEventListener(listener, eventType, callbak)) return;
		
        this._removeCallbackFromStream(eventType);
        this._removeCallbackFromArray(eventType);
        delete this.m_hasData;
        delete this.m_hasIndex;
        this.m_listenerCount--;
	},
    //イベントフロー制御配列からコールバックを削除
	_removeCallbackFromStream:function(eventType)
	{
        var _eventStream = this.m_eventStream[eventType];
        var _callback    = this.m_hasData[eventType][this.m_hasIndex];
        
        for (var i = 0, _len = _eventStream.length; i  < _len; i ++)
        {
            if (_eventStream[i].callback === callback)
            {
                _eventStream.splice(i, 1);
                if (_eventStream.length == 0)
                	delete this.m_eventStream[eventType];
                return;
            }
        }
	},
    //コールバック管理配列からコールバックを削除
	_removeCallbackFromArray:function(eventType)
	{
		var _index = this.m_hasIndex;
		var _data = this.m_hasData;
        var _callbacks = _data[eventType];
        
        _callbacks.splice(index, 1);
		if (_callbacks.length == 0)
		{
            delete _data[eventType];
            for (var p in _data) return;
            this.m_callbacks.del(listener);
		}
	},
	getListenerCount:function()
	{
	    return this.m_listenerCount;
	}
});