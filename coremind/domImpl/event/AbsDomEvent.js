cls.exports(
    "cm.event.Event",
{
    /** @name cm.dom */
    $name:"cm.domImpl.event.AbsDomEvent",
    $define:
    /** @lends cm.domImpl.AbsDomImpl.prototype */
    {
        AbsDomEvent:function()
        {
            this._overrideEventDefine();
            this._createFookMethodAliace();
        },
        destroy:function() {},
        
        _overrideEventDefine:function()
        {
            var e = cm.event.Event;
            //FRAME, Object
            e.CONTEXT_MENU = "contextmenu";
            e.ABORT = "abort";
            e.LOAD = "load";
            e.UNLOAD = "unload";
            e.ERROR = "error";
            e.RESIZE = "resize";
            e.SCROLL = "scroll";
            e.BEFORE_UNLOAD = "beforeunload";
            e.CLOSE = "close";
            //FORM
            e.SELECT = "select";
            e.CHANGE = "change";
            e.SUBMIT = "submit";
            e.RESET = "reset";
            e.FOCUS = "focus";
            e.BLUR = "blur";
            //CLIPBOARD
            e.COPY = "copy";
            e.CUT = "cut";
            e.PASTE = "paste";
            //KEYBOARD
            e.KEY_DOWN = "keydown";
            e.KEY_PRESS = "keypress";
            e.KEY_UP = "keyup";
            //MOUSE
            e.DRUG_DROP = "drugdrop";
            e.CLICK = "click";
            e.DOUBLE_CLICK = "dblclick";
            e.MOUSE_DOWN = "mousedown";
            e.MOUSE_MOVE = "mousemove";
            e.MOUSE_OUT = "mouseout";
            e.MOUSE_OVER = "mouseover";
            e.MOUSE_WHEEL = "mousewheel";
            e.MOUSE_UP = "mouseup";
            //AJAX
            e.LOAD_START = "loadstart";
            e.LOAD_END = "loadend";
            e.PROGRESS = "progress";
            e.TIMEOUT = "timeout";
        },
        _createFookMethodAliace:function()
        {
            var e = cm.event.Event;
            this.mFookMethodAliace = new Object();
            this.mFookMethodAliace[e.MOUSE_WHEEL] = this._mousewheel;
            this.mFookMethodAliace[e.MOUSE_UP] =
            this.mFookMethodAliace[e.MOUSE_DOWN] =
            this.mFookMethodAliace[e.CLICK] =
            this.mFookMethodAliace[e.DOUBLE_CLICK] = this._mouse;
        },

        addEventListener:function(eventType, listener, callback, useCapture)
        {
            var _attachCustomPropertyToEventObject = this.$bind("_attachCustomPropertyToEventObject");
            var _reconfigureCallback = function(e)
            {
                _attachCustomPropertyToEventObject(eventType, e, arguments.callee, useCapture);
                return callback(e);
            };
            listener.addEventListener(eventType, _reconfigureCallback, useCapture);
            return _reconfigureCallback;
        },
        _attachCustomPropertyToEventObject:function(eventType, eventObject, callee, useCapture)
        {
            eventObject.callee = callee;
            eventObject.useCapture = useCapture;

            var _removeEventListener = this.$bind("removeEventListener");
            eventObject.removeEventListener = function() {
                _removeEventListenerthis(this.type, this.target, this.callee, this.useCapture);
            };
            
            var _fookMethod = this.mFookMethodAliace[eventType];
            if (_fookMethod) _fookMethod.call(this, eventObject);
        },
        
        _mousewheel:function(eventObject)
        {
            eventObject.isWheelDown = this._isWheelDown;
            eventObject.isWheelUp = this._isWheelUp;
        },
        _isWheelDown:function() { return this.wheelDelta < 0; },
        _isWheelUp:function() { return this.wheelDelta > 0; },
        _mouse:function(eventObject)
        {
            eventObject.isLeftButton = this._isLeftButton;
            eventObject.isCenterButton = this._isCenterButton;
            eventObject.isRightButton = this._isRightButton;
        },
        _isLeftButton:function() { return this.button == 0; },
        _isCenterButton:function() { return this.button == 1; },
        _isRightButton:function() { return this.button == 2; },
        
        removeEventListener:function(eventType, listener, callback, useCapture) {
            listener.removeEventListener(eventType, callback, useCapture);
        }
    }
});