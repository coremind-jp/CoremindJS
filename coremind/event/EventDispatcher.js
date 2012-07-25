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
		this.m_bindCallbacks.destroy();
		this.m_self = this.m_events = this.m_bindCallbacks = null;
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
		
		var _listener  = Array.prototype.shift.apply(arguments);//0
		var _eventType = Array.prototype.shift.apply(arguments);//1
		var _callback  = Array.prototype.shift.apply(arguments);//2
		
		//initialize
        if (this.m_initFlag)
        {
            this.m_initFlag = false;
            this.m_events = {};
            this.m_bindCallbacks = new cm.data.Dictionary();
        }
        
        if (this.hasEventListener(_listener, _eventType, _callback))
        {
            cm.trace("aleady is listener function.");
            return;
        }
        
		//searchingDataStructure setup
		var _data = this.m_bindCallbacks.get(_listener);
		if (_data === undefined)
		{
			_data = {};
			_data[_eventType] = [_callback];
			this.m_bindCallbacks.set(_listener, _data);
		}
		else
		{
			var _callbacks = _data[_eventType];
			if (_callbacks === undefined)
				_data[_eventType] = [_callback];
			else
			{
				for (var i = 0, _len = _callbacks.length; i < _len; i++)
					if (_callbacks[i] === _callback)
						return;
                _callbacks.push(_callback);
			}
		}
		
		//dispatchStructure setup
		var _this = this.m_self;
		var _priority = Array.prototype.shift.apply(arguments)//3
		var _flowData = {
			priority     : _priority === undefined ? 0: _priority,
            callback     : _callback,
			bindCallback : function()
			{
				var _event = new cm.event.Event(_this, _eventType);
				Array.prototype.unshift.call(arguments, _event);
				_callback.apply(_listener, arguments);
				_event.destroy();
			}
		};
		
		var _sequence = this.m_events[_eventType];
		if (_sequence === undefined)
		{
			this.m_events[_eventType] = [];
			this.m_events[_eventType].push(_flowData);
		}
		else
		{
			for (var i = 0, _len = _sequence.length; i < _len; i++)
                if (_sequence[i].priority < _data.priority)
                    _sequence.splice(i, 0, _flowData);
			
			if (_len == _sequence.length) _sequence.push(_flowData);
		}
		
		this.m_listenerCount++;
	},
	/**
	 * @param {Object} listener
     * @param {Object} eventType
     * @param {Object} callbak
	 */
	removeEventListener:function(listener, eventType, callbak)
	{
        if (this.m_initFlag) return;
        
		if (this.hasEventListener(listener, eventType, callbak))
		{
			var _data = this.m_hasData;
	        var _callbacks = this.m_hasData[eventType];
            var _callback  = _callbacks[this.m_hasIndex];
            var _flowArray = this.m_events[eventType];
            
            //イベントフロー制御配列からコールバックを削除
            for (var i = 0, _len = _flowArray.length; i  < _len; i ++)
            {
                if (_flowArray[i].callback === _callback)
                {
                    _flowArray.splice(i, 1);
                    if (_flowArray.length == 0) delete this.m_events[eventType];
                    break;
                }
            }
            
            //コールバック管理配列からコールバックを削除
            _callbacks.splice(this.m_hasIndex, 1);
			if (_callbacks.length == 0)
			{
                delete _data[eventType];
                
                var deleteListener = true;
                for (var p in _data)
                {
                    deleteListener = false;
                    break;
                }
                
                if (deleteListener) this.m_bindCallbacks.del(listener);
			}
			
            delete this.m_hasData;
            delete this.m_hasIndex;
            this.m_listenerCount--;
		}
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
        this.m_hasData = this.m_bindCallbacks.get(listener);
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
        
	    var _callbacks = this.m_events[Array.prototype.shift.apply(arguments)];
	    if (_callbacks)
	        for ( var i = 0, _len = _callbacks.length; i < _len; i++)
	            _callbacks[i].bindCallback.apply(null, arguments);
	},
	getListenerCount:function()
	{
	    return this.m_listenerCount;
	}
});