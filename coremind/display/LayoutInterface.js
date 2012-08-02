/** @name cm.display */
/**
 * @author ta-ta
 */
cm.Class.create("cm.display.LayoutInterface",
/** @lends cm.display.LayoutInterface.prototype */
{
    /**
     * レイアウトパラメータの操作インターフェースを提供します。
     * LayoutInterfaceは様々なオブジェクトにレイアウトに必要なパラメータを付加します.
     * このクラスはシングルトンクラスです.
     * @constructor
     * @name cm.display.LayoutInterface
     * @extends cm.BaseObject
     */
	LayoutInterface:function()
	{
		this.m_target = null;
	},
	destroy:function()
	{
		delete this.m_target;
	},
	set:function(target)
	{
		if (target.cm_layoutParam === undefined
		||  target.cm_layoutFlag === undefined)
		{
			target.cm_layoutParam = [1, 0, 0, 0, 0, 1.0, 1.0, 0.0, 0.0];
			target.cm_layoutFlag = 0;
		}
		this.m_target = target;
		return this;
	},
	x:function(val, fixed)
	{
		return this._wrapper("x", val, fixed);
	},
	y:function(val, fixed)
	{
		return this._wrapper("y", val, fixed);
	},
	width:function(val, fixed)
	{
		return this._wrapper("width", val, fixed);
	},
	height:function(val, fixed)
	{
		return this._wrapper("height", val, fixed);
	},
	scaleX:function(val, fixed)
	{
		return this._wrapper("scaleX", val, fixed);
	},
	scaleY:function(val, fixed)
	{
		return this._wrapper("scaleY", val, fixed);
	},
	rotationX:function(val, fixed)
	{
		return this._wrapper("rotationX", val, fixed);
	},
	rotationY:function(val, fixed)
	{
		return this._wrapper("rotationY", val, fixed);
	},
	dump:function(target)
	{
		target =
			target !== undefined ?
				target:
				this.m_target !== undefined ?
					this.m_target:
					undefined;
		if (target)
		{
			var _param = target.cm_layoutParam;
			var _idxObject = cm.display.LayoutInterface.prototype.PROP_INDEX;
			cm.trace([
				"x:"          , _param[_idxObject["x"]],
				"\ny:"        , _param[_idxObject["y"]],
				"\nwidth:"    , _param[_idxObject["width"]],
				"\nheight:"   , _param[_idxObject["height"]],
				"\nscaleX:"   , _param[_idxObject["scaleX"]],
				"\nscaleY:"   , _param[_idxObject["scaleY"]],
				"\nrotationX:", _param[_idxObject["rotationX"]],
				"\nrotationY:", _param[_idxObject["rotationY"]],
				"\nflag:"     , target.cm_layoutFlag.toString(2)].join(""));
		}
	},
	_wrapper:function(propName, val, fixed)
	{
		var _param = this.m_target.cm_layoutParam;
		var _idxObject = cm.display.LayoutInterface.prototype.PROP_INDEX;
		if (val !== undefined)
		{
			this.m_target.cm_layoutFlag |= Math.pow(2, _idxObject[propName]) + 1;
			fixed ?
				_param[_idxObject[propName]]  = val:
				_param[_idxObject[propName]] += val;
			return this;
		}
		else
			return _param[_idxObject[propName]];
	}
});
cm.display.LayoutInterface.prototype["PROP_INDEX"] = {
	x        :0,
	y        :1,
	width    :2,
	height   :3,
	scaleX   :4,
	scaleY   :5,
	rotationX:6,
	rotationY:7
};