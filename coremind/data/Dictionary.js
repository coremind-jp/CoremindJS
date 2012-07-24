cm.Class.create("cm.data.Dictionary",
{
	Dictionary:function()
	{
		this.unused = true;
	},
	destroy:function()
	{
		this.m_value = this.m_key = this.m_empty = null;
	},
	get:function(key)
	{
	    return this.unused ? undefined: this.m_value[this._getValIndex(key)];
	},
	set:function(key, val)
	{
		if (this.unused)
		{
			this.m_value = [];
			this.m_key   = [];
			this.m_empty = [];
			delete this.unused;
		}
		var _valIndex = this._getValIndex(key);
		var _index = _valIndex > -1 ? _valIndex: this._getNewIndex();
		this.m_key[_index]   = key;
		this.m_value[_index] = val;
	},
	del:function(key)
	{
		var _emptyIndex = this._getValIndex(key);
		if (_emptyIndex > -1)
		{
			this.m_key[_emptyIndex] = this.m_value[_emptyIndex] = undefined;
			this.m_empty.push(_emptyIndex);
		}
	},
	_getValIndex:function(key)
	{
		for (var i=0, _len = this.m_key.length; i < _len; i++)
			if (this.m_key[i] === key)
				return i;
		return -1;
	},
	_getNewIndex:function()
	{
		return this.m_empty,length > 0 ? this.m_empty.shift(): this.m_value.length;
	}
});