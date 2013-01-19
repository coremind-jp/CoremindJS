cm.Class.create(
//import
    "cm.display.abs.fill.Color",
    "cm.util.Bitflag",
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.DisplayParameters",
    $extends:"cm.util.Bitflag",
    $define:
    /** @lends cm.display.abs.DisplayParameters.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.DisplayParameters
         * @extends cm.BaseObject
         */
        DisplayParameters:function()
        {
            //set method alias
            this.isChanged = this.isEnabledAnyFlags;
            this.applied = this.reset;
        },
        destroy:function() {},
        
        tween:function(property, to, from)
        {
            property = new String(property);
            if (property.match(/argb$/))
                return this._tweenByARGB(property, to, from);
                
            var _targetObjectIndex = property.match(/[0-9]+/);
            if (!cm.equal.isNull(_targetObjectIndex))
                property = property.replace(_targetObjectIndex, "");
            
            var _hierarchyName = property.split(".");
            var _propertyName = _hierarchyName.pop();
            var _len = _hierarchyName.length;
            var _absObject = _this = this;
            
            for(var i = 0; i < _len; i++)
            {
                _absObject = _absObject[_hierarchyName[i]](_targetObjectIndex);
                _hierarchyName[i] = "edit" + cm.string.capitalize(_hierarchyName[i]);
            }
            from = cm.equal.isUndefined(from) ? _absObject[_propertyName](): from;
            _propertyName = _propertyName + "Abs";
            
            return {
                begin:from,
                end:to - from,
                target:_this,
                setter:function(progress)
                {
                    var _absObject = this.target;
                    for(var i = 0; i < _len; i++)
                        _absObject = _absObject[_hierarchyName[i]](_targetObjectIndex);
                    _absObject[_propertyName](this.begin + this.end * progress);
                }
            }
        },
        _tweenByARGB:function(property, to, from)
        {
            var _targetObjectIndex = property.match(/[0-9]+/);
            if (!cm.equal.isNull(_targetObjectIndex))
            {
                _targetObjectIndex = parseInt(_targetObjectIndex[0]);
                property = property.replace(_targetObjectIndex, "");
            }
            else
                _targetObjectIndex = "";
                
            var _hierarchyName = property.split(".");
            var _propertyName = _hierarchyName.pop();
            var _len = _hierarchyName.length;
            var _hierarchy = _hierarchyName.join(".") + _targetObjectIndex;
            var _absObject = _this = this;
            
            for(var i = 0; i < _len; i++)
                _absObject = _absObject[_hierarchyName[i]](_targetObjectIndex);
            
            var _to = new cm.display.abs.fill.Color(to);
            var _from = cm.equal.isUndefined(from) ?
                _absObject: new cm.display.abs.fill.Color(from);
            var _argbTweenParameters = [
                this.tween(_hierarchy + ".a", _to.a(), _from.a()),
                this.tween(_hierarchy + ".r", _to.r(), _from.r()),
                this.tween(_hierarchy + ".g", _to.g(), _from.g()),
                this.tween(_hierarchy + ".b", _to.b(), _from.b())
            ];
            return {
                setter:function(progress) {
                    for(var i = 0, len = _argbTweenParameters.length; i < len; i++)
                        _argbTweenParameters[i].setter(progress);
                }
            };
        },
        
        
        /**
         * パラメータ取得ラッパー
         * @param {String} propName プロパティー名
         * @return {Number} 設定値
         */
        _getWrapper:function(propName)
        {
            return this.mParams[cm.display.abs[this.className].PROP_INDEX[propName]];
        },
        /**
         * パラメータ絶対値設定ラッパー
         * @param {String} propName プロパティー名
         * @param {Number} 設定値
         * @return {Object} このオブジェクト
         */
        _setWrapperAbs:function(propName, val)
        {
            var _params = this.mParams;
            var _idxObject = cm.display.abs[this.className].PROP_INDEX;
            if (_params[_idxObject[propName]] != val)
            {
                this.enabledFlag(Math.pow(2, _idxObject[propName]));
                _params[_idxObject[propName]] = val;
            }
            return this;
        },
        /**
         * パラメータ相対値設定ラッパー
         * @param {String} propName プロパティー名
         * @param {Number} 設定値
         * @return {Object} このオブジェクト
         */
        _setWrapperRel:function(propName, val)
        {
            var _params = this.mParams;
            var _idxObject = cm.display.abs[this.className].PROP_INDEX;
            if (val != 0)
            {
                this.enabledFlag(Math.pow(2, _idxObject[propName]));
                _params[_idxObject[propName]] += val;
            }
            return this;
        }
    }
});