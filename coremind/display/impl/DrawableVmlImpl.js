/** @name cm.display */
cm.Class.create(
    "cm.display.abs.Border",
    "cm.core.BrowserInterface",
{
    $name:"cm.display.impl.DrawableVmlImpl",
    $extends:"cm.display.impl.DrawableCssImpl",
    $static:
    {
        BACKGROUND_ZINDEX:-1000000,
        RECT_TEMPLATE:    "m 0,0 l 1000,0, 1000,1000, 0,1000, 0,0 e",
        CIRCLE_TEMPLATE:  "at 0,0,1000,1000, 0,500,0,500 e"
    },
    $define:
    /** @lends cm.display.impl.DrawableVmlImpl.prototype */
    {
        DrawableVmlImpl:function(target)
        {
            if (!document.namespaces.vml)
            {
                document.namespaces.add('vml', 'urn:schemas-microsoft-com:vml');
                cm.css.appendRule(
                    "vml\\:*", "behavior: url(#default#VML)",
                    cm.dom.getRuleLength());
            }
            
            this.mShape = document.createElement("vml:shape");
            this.mShape.className = "absoluteFit";
            this.mShape.style.zIndex = cm.display.impl.DrawableVmlImpl.BACKGROUND_ZINDEX;
            this.mContent.appendChild(this.mShape);
            
            this.mPath = document.createElement("vml:path");
            this.mPath.v = cm.display.impl.DrawableVmlImpl.RECT_TEMPLATE;
            this.mShape.appendChild(this.mPath);
            
            this.mStroke = document.createElement("vml:stroke");
            this.mStroke.dashstyle = "solid";
            this.mStroke.joinstyle = "miter";
            this.mShape.appendChild(this.mStroke);
            
            this.mBackgroundFill = this.mFill = document.createElement("vml:fill");
            this.mShape.appendChild(this.mFill);
            this.disabledBorder();
        },
        destroy:function() {},
        _updateColor:function(target, color)
        {
            target.src = "";
            target.color = "#" + color.rgb().toString(16);
            target.opacity = color.aRatio();
        },
        
        //border
        enabledBorder:function() {
            this.mStroke.on = true;
        },
        updateBorderWeight:function(val) {
            this.mStroke.weight = val;
        },
        updateBorderStyle:function(val)
        {
            switch (val)
            {
                case cm.display.abs.Border.DASH:
                    this.mStroke.dashstyle = "shortdash";
                    this.mStroke.linestyle = "single";
                    break;
                case cm.display.abs.Border.DOT:
                    this.mStroke.dashstyle = "shortdot";
                    this.mStroke.linestyle = "single";
                    break;
                case cm.display.abs.Border.DOUBLE:
                    this.mStroke.dashstyle = "solid";
                    this.mStroke.linestyle = "thinthin";
                    break;
                default:
                    this.mStroke.dashstyle = "solid";
                    this.mStroke.linestyle = "single";
                    break;
            }
        },
        updateBorderColor:function(color) {
            this.enabledBorder();
            this._updateColor(this.mStroke, color);
        },
        disabledBorder:function() {
            this.mStroke.on = false;
        },
        
        
        //background
        enabledBackground:function() {
            this.mFill.on = true;
        },
        updateBackgroundColor:function(color)
        {
            this.mFill.type = "tile";
            this.mFill.colors.value = "";
            this._updateColor(this.mFill, color);
            
            if (this.mInsetShadowShapeInner)
            {
                this.mInsetShadowShapeInner.fillcolor = this.mFill.color;
                this.mInsetShadowShapeInner.opacity = this.mFill.opacity;
            }
        },
        updateBackgroundGradient:function(gradient)
        {
            var _beginColor = gradient.beginColor();
            var _colors = gradient.colors();
            var _thresholdArr = gradient.threshold();
            var _len = _colors.length;
            
            this.mFill.type = "gradient";
            this.mFill.color = "#" + _beginColor.rgb().toString(16);
            this.mFill.opacity = _beginColor.aRatio();
            this.mFill.color2 = "#" + _colors[_len - 1].rgb().toString(16);
            this.mFill.opacity2 = _colors[_len - 1].aRatio();
            this.mFill.src = "";
            
            var _param = [];
            var _threshold = 0;
            for (var i = 0; i < _len; i++)
            {
                _threshold += _thresholdArr[i] * 100 | 0;
                _param.push(cm.string.concat(
                    _threshold, "% #", _colors[i].rgb().toString(16)));
            }
            this.mFill.colors.value = _param.join(", ");
        },
        updateBackgroundImage:function(imageData)
        {
            var _v = imageData.align().vertical();
            var _h = imageData.align().horizontal();
            var _pos = cm.string.concat(_h, ", ", _v); 
            
            this.mFill.type = "tile";
            this.mFill.aspect = "atleast";
            this.mFill.src = imageData.source();
            this.mFill.origin = this.mFill.position = _pos;
        },
        disabledBackground:function() {
            this.mFill.on = false;
        },
        
        
        //container
        updateShape:function(presetShape)
        {
            if (presetShape.isRect())
                this.mPath.v = cm.display.impl.DrawableVmlImpl.RECT_TEMPLATE;
            else
            if (presetShape.isCircle())
                this.mPath.v = cm.display.impl.DrawableVmlImpl.CIRCLE_TEMPLATE;
            else
            {
                var
                    _container = this.mContent.cmDisplay.container,
                    _w   = _container.width(),
                    _h   = _container.height(),
                    _cap = Math.min(_w, _h) / 2;
                    _tl  = presetShape.topLeft(),
                    _tr  = presetShape.topRight(),
                    _bl  = presetShape.bottomLeft(),
                    _br  = presetShape.bottomRight(),
                    _tlx = (_tl.x > _cap ? _cap: _tl.x) / _w * 1000 | 0,
                    _trx = (_tr.x > _cap ? _cap: _tr.x) / _w * 1000 | 0,
                    _blx = (_bl.x > _cap ? _cap: _bl.x) / _w * 1000 | 0,
                    _brx = (_br.x > _cap ? _cap: _br.x) / _w * 1000 | 0,
                    _tly = (_tl.y > _cap ? _cap: _tl.y) / _h * 1000 | 0,
                    _try = (_tr.y > _cap ? _cap: _tr.y) / _h * 1000 | 0,
                    _bly = (_bl.y > _cap ? _cap: _bl.y) / _h * 1000 | 0,
                    _bry = (_br.y > _cap ? _cap: _br.y) / _h * 1000 | 0,
                    _tlxDia = _tlx * 2,
                    _trxDia = _trx * 2,
                    _blxDia = _blx * 2,
                    _brxDia = _brx * 2,
                    _tlyDia = _tly * 2,
                    _tryDia = _try * 2,
                    _blyDia = _bly * 2,
                    _bryDia = _bry * 2;
                    
                this.mPath.v = cm.string.concat(
                    "ar 0,0,", _tlxDia, ",", _tlyDia, ", ", _tlx, ",0,0,", _tly,                //topLeft
                    " l  0,", 1000 - _bly,                                                    //left
                    "at 0,", 1000 - _blyDia, ",", _blxDia, ",1000, 0,", 1000 - _bly, ",", _blx, ",", "1000",//bottomLeft
                    " l ", 1000 - _brx, ",1000 ",                                             //bottom
                    "at ", 1000 - _brxDia, ",", 1000 - _bryDia, ",1000,1000, ", 1000 - _brx, ",1000,1000,", 1000 - _bry,//bottomRight
                    " l 1000," , _try,                                                  //right
                    "at ", 1000 - _trxDia, ",0,1000,", _tryDia, ", 1000,", _try, ",", 1000 - _trx, ",0",    //topRight
                    " l ", _tlx, ",0 e");                                               //top
            }
        },
        
        
        _createShadowShape:function(shadow)
        {
            var _shadowShape = document.createElement("vml:shape");
            _shadowShape.id = "shadow" + shadow.id();
            _shadowShape.path = this.mPath;
            _shadowShape.stroked = false;
            _shadowShape.style.position = "absolute";
            _shadowShape.style.filter = cm.string.concat(
                "progid:DXImageTransform.Microsoft.Blur()",
                "progid:DXImageTransform.Microsoft.Alpha()");
            return _shadowShape;
        },
        
        _createInsetShadowShape:function(shadow)
        {
            var _shadowShape = document.createElement("div");
            var _outer = document.createElement("vml:shape");
            var _inner = document.createElement("vml:shape");
            
            _shadowShape.id = "shadow" + shadow.id();
            _shadowShape.className = "absoluteFit";
            _shadowShape.appendChild(_outer);
            _shadowShape.appendChild(_inner);
            
            _outer.path = _inner.path = this.mPath;
            _outer.stroked = _inner.stroked = false;
            _outer.className = _inner.className = "absoluteFit";
            
            _outer.name = "outer";
            _outer.style.filter = "progid:DXImageTransform.Microsoft.Alpha()";
            
            _inner.name = "inner";
            _inner.fillcolor = this.mFill.color;
            _inner.opacity = this.mFill.opacity;
            _inner.style.filter = "progid:DXImageTransform.Microsoft.Blur()";
            
            this.mInsetShadowShapeOuter = _outer;
            this.mInsetShadowShapeInner = _inner;
            
            return _shadowShape;
        }
    }
    
});