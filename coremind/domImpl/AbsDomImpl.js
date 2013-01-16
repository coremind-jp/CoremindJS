cm.Class.create(
    "cm.event.Event",
{
    /** @name cm.dom */
    $name:"cm.domImpl.AbsDomImpl",
    $define:
    /** @lends cm.domImpl.AbsDomImpl.prototype */
    {
        AbsDomImpl:function()
        {
            cm.dom = this;
            this.w = window;
            this.d = document;
            this.mPathConverter = this.d.createElement("p");
            
            this._overrideEventDefine();
            this._createFookMethodAliace();
        },
        destroy:function() {},
        
        /* Eevmt */
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
        },

        addEventListener:function(eventType, listener, callback, useCapture)
        {
            var _reconfigureCallback = function(e)
            {
                cm.dom.$bind("_attachCustomPropertyToEventObject")(eventType, e, arguments.callee, useCapture);
                return callback(e);
            };
            listener.addEventListener(eventType, _reconfigureCallback, useCapture);
            return _reconfigureCallback;
        },
        _attachCustomPropertyToEventObject:function(eventType, eventObject, callee, useCapture)
        {
            eventObject.callee = callee;
            eventObject.useCapture = useCapture;
            eventObject.removeEventListener = this.removeEventListenerFromInner;
            
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
        
        removeEventListenerFromInner:function() {
            cm.dom.removeEventListener(this.type, this.target, this.callee, this.useCapture);
        },
        
        removeEventListener:function(eventType, listener, callback, useCapture) {
            listener.removeEventListener(eventType, callback, useCapture);
        },
        
        /* display */
        getX:function(element) { return element.offsetLeft; },
        getY:function(element) { return element.offsetTop; },
        getWidth:function(element) { return element.clientWidth; },
        getHeight:function(element) { return element.clientHeight; },
        getContentWidth:function(element) { return element.scrollWidth; },
        getContentHeight:function(element) { return element.scrollHeight; },
        /*
         * element modify
         */
        pushClassName:function(element, className)
        {
            var _classNameArray = element.className.split(" ");
            if (_classNameArray.indexOf(className) < 0)
            {
                _classNameArray[_classNameArray.length] = "." + className;
                element.className = _classNameArray.join(" ");
            }
        },
        toAbsolutePath:function(url)
        {
            this.mPathConverter.innerHTML = cm.string.concat('<a href="', url, '" />');
            return this.mPathConverter.firstChild.href;
        },
        createXhr:function() {
            return new XMLHttpRequest();
        }
    }
});