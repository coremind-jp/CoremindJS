cm.Class.create(
{
    $name:"cm.util.UpdateDispatcher",
    $singleton:true,
    $define:
    {
        UpdateDispatcher:function()
        {
            this.intervalId = null;
            this._enabledUpdaters = [];
            this._disabledUpdaters = [];
            this.start();
        },
        destroy:function(){
            this.stop();
            this._enabledUpdaters = this._disabledUpdaters = null;
        },
        start:function()
        {
            this.stop();
            this.latestDateNow = Date.now();
            this.elapsed = 0;
            this.delta = 0;
            var _this = this;
            this.intervalId = setInterval(function dispatch() {
                _this.dispatch();
            }, 1000 / 60);
        },
        stop:function()
        {
            if (!cm.equal.isNull(this.intervalId))
            {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
        addUpdater:function(updater)
        {
            if (this._enabledUpdaters.indexOf(updater) < 0)
                this._enabledUpdaters.push(updater);
            else
            {
                var _index = this._disabledUpdaters.indexOf(updater);
                if (_index >= 0) this._disabledUpdaters.splice(_index, 1);
            }
        },
        removeUpdater:function(updater)
        {
            var _index = this._disabledUpdaters.indexOf(updater);
            if (_index < 0) this._disabledUpdaters.push(updater);
        },
        dispatch:function()
        {
            this._refreshEnabledUpdaters();
            
            var _enabledUpdaters = this._enabledUpdaters;
            var _dateNow = Date.now();
            
            this.elapsed = _dateNow - this.latestDateNow;
            this.delta += this.elapsed;
            this.latestDateNow = _dateNow;
            
            for(var i = 0, _len = _enabledUpdaters.length; i < _len; i++)
            {
                if (!_enabledUpdaters[i]._update(this.delta, this.elapsed))
                {
                    _enabledUpdaters.splice(i, 1);
                    --i;
                    --_len;
                }
            }
        },
        _refreshEnabledUpdaters:function()
        {
            while(this._disabledUpdaters.length > 0)
            {
                var _index = this._enabledUpdaters.indexOf(this._disabledUpdaters.shift());
                if (_index >= 0) this._enabledUpdaters.splice(_index, 1);
            }
        }
    }
});