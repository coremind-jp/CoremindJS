cls.exports(
    "cm.event.Event",
    "cm.core.UserAgent",
{
    /** @name cm.dom */
    $name:"cm.domImpl.event.InternetExplorerDomEvent",
    $extends:"cm.domImpl.event.AbsDomEvent",
    $define:
    /** @lends cm.domImpl.AbsDomImpl.prototype */
    {
        InternetExplorerDomEvent:function() {
            this.mActivator = document.getElementsByTagName('script')[0];
        },
        destroy:function() {},
        tryActivateElement:function(element)
        {
            if (this.isHtmlDomElement(element) && eq.isNull(element.parentNode))
            {
                element.cmActivate = true;
                this.mActivator.parentNode.insertBefore(element, this.mActivator);
            }
        },
        tryDeactivateElement:function(element)
        {
            if (element.cmActivate)
            {
                element.cmActivate = undefined;
                if (element.parentNode === this.mActivator)
                    this.mActivator.removeChild(element);
            }
        },
        _preventDefault:function() { this.returnValue = false; },
        _stopPropagation:function() { this.cancelBubble = false; }
    },
    $override:
    {
        _overrideEventDefine:function()
        {
            if (cm.core.UserAgent.browserVersion >= 9)
                this.$super("_overrideEventDefine")();
            else
            {
                var e = cm.event.Event;
                //FRAME, Object
                e.CONTEXT_MENU = "oncontextmenu";
                e.ABORT = "onabort";
                e.LOAD = "onload";
                e.UNLOAD = "onunload";
                e.ERROR = "onerror";
                e.RESIZE = "onresize";
                e.SCROLL = "onscroll";
                e.BEFORE_UNLOAD = "onbeforeunload";
                e.CLOSE = "onclose";
                //FORM
                e.SELECT = "onselect";
                e.CHANGE = "onchange";
                e.SUBMIT = "onsubmit";
                e.RESET = "onreset";
                e.FOCUS = "onfocus";
                e.BLUR = "onblur";
                //CLIPBOARD
                e.COPY = "oncopy";
                e.CUT = "oncut";
                e.PASTE = "onpaste";
                //KEYBOARD
                e.KEY_DOWN = "onkeydown";
                e.KEY_PRESS = "onkeypress";
                e.KEY_UP = "onkeyup";
                //MOUSE
                e.DRUG_DROP = "ondrugdrop";
                e.CLICK = "onclick";
                e.DOUBLE_CLICK = "ondblclick";
                e.MOUSE_DOWN = "onmousedown";
                e.MOUSE_MOVE = "onmousemove";
                e.MOUSE_OUT = "onmouseout";
                e.MOUSE_OVER = "onmouseover";
                e.MOUSE_WHEEL = "onmousewheel";
                e.MOUSE_UP = "onmouseup";
                //AJAX
                e.LOAD_START = "onloadstart";
                e.LOAD_END = "onloadend";
                e.PROGRESS = "onprogress";
                e.TIMEOUT = "ontimeout";
            }
        },
        
        addEventListener:function(eventType, listener, callback, useCapture)
        {
            this.tryActivateElement(listener);
            var _attachCustomPropertyToEventObject = this.$bind("_attachCustomPropertyToEventObject");
            var tryDeactivateElement = this.$bind("tryDeactivateElement");
            var _reconfigureCallback = function(e)
            {
                _attachCustomPropertyToEventObject(eventType, e, arguments.callee);
                var _result = callback(e);
                tryDeactivateElement(listener);
                return _result;
            };
            
            cm.core.UserAgent.browserVersion < 8 ?
                listener.attachEvent(eventType, _reconfigureCallback):
                listener.addEventListener(eventType, _reconfigureCallback, useCapture);
                
            return _reconfigureCallback;
        },
        _attachCustomPropertyToEventObject:function(eventType, eventObject, callee)
        {
            this.$super("_attachCustomPropertyToEventObject")(eventType, eventObject, callee);
            eventObject.target = eventObject.srcElement;
            
            if (!eventObject.preventDefault)
                eventObject.preventDefault = this._preventDefault;
            if (!eventObject.stopPropagation)
                eventObject.stopPropagation = this._stopPropagation;
        },
        
        removeEventListener:function(eventType, listener, callback, useCapture)
        {
            cm.core.UserAgent.browserVersion < 8 ?
                listener.detachEvent(eventType, callback):
                listener.removeEventListener(eventType, callback, useCapture);
        }
    }
});