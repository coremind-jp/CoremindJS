/** @name cm.display */
cls.exports(
    "cm.display.abs.Border",
    "cm.display.abs.fill.Gradient",
    "cm.display.abs.fill.ImageData",
    "cm.core.DomInterface",
    "cm.core.CssInterface",
{
    $name:"cm.display.impl.DrawableVmlImpl",
    $extends:"cm.display.impl.DrawableCssImpl",
    $static:
    {
        RECT_TEMPLATE:    "m 0,0 l 1000,0, 1000,1000, 0,1000 x e",
        CIRCLE_TEMPLATE:  "at 0,0,1000,1000, 0,500,0,500 x e",
        CHILD_NUM:0,
        Z_INDEX:
        {
            VML_PARENT:-2147483647,
            DROP_SHADOW :0,
            BACKGROUND  :1,
            OVERFLOW    :2,
            INSET_SHADOW:3,
            BORDER      :4
        },
        updateColorByFillElement:function(fillElement, color)
        {
            fillElement.src = "";
            if (color.a() > 0)
            {
                fillElement.on = true;
                fillElement.color = "#" + color.rgbStr();
                fillElement.opacity = color.aRatio();
            }
            else
                fillElement.on = false;
        },
        updateColorByShapeElement:function(shapeElement, color)
        {
            if (color.a() > 0)
            {
                shapeElement.filled = true;
                shapeElement.fillcolor = "#" + color.rgbStr();
                //shapeElement.opacity = color.aRatio();
            }
            else
                shapeElement.filled = false;
        },
        updateColorByGradient:function(fillElement, gradient)
        {
            var _threshold = 0;
            var _thresholds = gradient.threshold();
            var _colors = gradient.colors();
            var _colorsStr = ex.string.concat("0% #", gradient.beginColor().rgbStr());

            for (var i = 0, len = _colors.length; i < len; i++)
            {
                _threshold += _thresholds[i] * 100 | 0;
                _colorsStr += ex.string.concat(", ", _threshold, "% #", _colors[i].rgbStr());
            }
            fillElement.colors.value = _colorsStr;
            fillElement.opacity = gradient.beginColor().aRatio();
            fillElement.opacity2 = _colors[len - 1].aRatio();
        }
    },
    $define:
    {
        DrawableVmlImpl:function(cmDisplay, forcedAbsolute)
        {
            this.mBoxOffset = 0;
            this.mVmlChildId = this.$class.CHILD_NUM++;
            this._appendCssRule();
            this._createVMLElements();
            this._createVmlPath();
            this._createVmlFillAsBackground();
            this._createVmlStrokeAsBorder();
            this.mContent.appendChild(this.mVmlParent);
        },
        destroy:function() {},

        _appendCssRule:function()
        {
            if (!cm.dom.d.namespaces.vml)
            {
                cm.dom.d.namespaces.add('vml', 'urn:schemas-microsoft-com:vml');
                cm.css.appendRule(cm.dom.d.documentMode < 8 ?
                        "vml\\:*":
                        ex.string.concat(
                            "vml\\:shapeType,",
                            "vml\\:shape,",
                            "vml\\:path,",
                            "vml\\:fill,",
                            "vml\\:imagedata,",
                            "vml\\:stroke"),
                    "behavior: url(#default#VML); display:inline-block;",
                    cm.css.ruleLength());

                cm.css.appendRule(".styleEmulate",
                    ex.string.concat(
                        "position:absolute;",
                        "left:0px;",
                        "top:0px;",
                        "width:100%;",
                        "height:100%"),
                    cm.css.ruleLength());

                var _head = cm.dom.d.getElementsByTagName("head")[0];
                var _emulateIE7 = cm.dom.util.createElement("meta");
                _emulateIE7.setAttribute("http-equiv", "X-UA-Compatible");
                _emulateIE7.setAttribute("content", "IE=EmulateIE7");
                _head.insertBefore(_emulateIE7, _head.firstChild);
            }
        },
        _createVMLElements:function()
        {
            this.mVmlParent = cm.dom.util.createElement("div");
            this.mVmlParent.name = "vmlParent";
            this.mVmlParent.className = "styleEmulate";
            this.mVmlParent.style.zIndex = this.$class.Z_INDEX.VML_PARENT;
        },
        _tryAppendOverflowParent:function()
        {
            if (eq.isUndefined(this.mOverflowParent))
            {
                this.mOverflowParent = cm.dom.util.createElement("div");
                this.mOverflowParent.name = "overflow";
                this.mOverflowParent.className = "styleEmulate";
                this.mOverflowParent.style.overflow = "hidden";
                this.mOverflowParent.style.zIndex = this.$class.Z_INDEX.OVERFLOW;
                this.mVmlParent.appendChild(this.mOverflowParent);
            }
        },
        _createVmlPath:function()
        {
            this.mPath = cm.dom.util.createElement("vml:path");
            this.mPath.v = this.$class.RECT_TEMPLATE;

            var _shapeType = cm.dom.util.createElement("vml:shapeType");
            _shapeType.appendChild(this.mPath);
            _shapeType.id = "vml" + this.mVmlChildId;
            cm.dom.d.appendChild(_shapeType);
        },
        _createVmlFillAsBackground:function()
        {
            var _background = cm.dom.util.createElement("vml:shape");
            _background.className = "styleEmulate";
            _background.style.zIndex = this.$class.Z_INDEX.BACKGROUND;
            _background.type = "#vml" + this.mVmlChildId;
            _background.stroked = false;
            this.mVmlParent.appendChild(_background);

            this.mFill = cm.dom.util.createElement("vml:fill");
            this.mFill.on = false;
            _background.appendChild(this.mFill);

            this.mImageData = cm.dom.util.createElement("vml:imagedata");
            _background.appendChild(this.mImageData);
        },
        _createVmlStrokeAsBorder:function()
        {
            var _border = cm.dom.util.createElement("vml:shape");
            _border.className = "styleEmulate";
            _border.style.zIndex = this.$class.Z_INDEX.BORDER;
            _border.type = "#vml" + this.mVmlChildId;
            _border.filled = false;
            this.mVmlParent.appendChild(_border);

            this.mStroke = cm.dom.util.createElement("vml:stroke");
            this.mStroke.on = false;
            this.mStroke.dashstyle = "solid";
            this.mStroke.joinstyle = "miter";
            _border.appendChild(this.mStroke);
        },
        _createRadialGradientShape:function()
        {
            if (eq.isUndefined(this.mRadialGradientShape))
            {
                var _fill = cm.dom.util.createElement("vml:fill");
                var _stroke = cm.dom.util.createElement("vml:stroke");

                this.mRadialGradientShape = cm.dom.util.createElement("vml:shape");
                this.mRadialGradientShape.className = "styleEmulate";
                this.mRadialGradientShape.appendChild(cm.dom.util.createElement("vml:path"));
                this.mRadialGradientShape.appendChild(_fill);
                this.mRadialGradientShape.appendChild(_stroke);

                this._tryAppendOverflowParent();
                this.mOverflowParent.appendChild(this.mRadialGradientShape);

                _fill.type = "gradienttitle";
                _fill.method = "sigma";
                _fill.focus = 100;
                _fill.focusSize = "0.5 0.5";
                _fill.focusposition = "0.5 0.5";

                _stroke.dashstyle = "solid";
                _stroke.linestyle = "single";
                _stroke.weight = 2;
            }
        },
        _setCssDummyBorder:function(val)
        {
            this.mContentStyle.borderWidth = val + "px";
            this.mContentStyle.borderColor = "transparent";
            this.mContentStyle.borderStyle = "solid";
        },
        _adjustBorderOffsetByStrokeShape:function(val)
        {
            var _container = this.mContent.cmDisplay.container;
            var _weightOffsetAsWidth  = val / (_container.width()  + this.mBoxOffset) * 100;
            var _weightOffsetAsHeight = val / (_container.height() + this.mBoxOffset) * 100;
            var _strokeShapeStyle = this.mStroke.parentNode.style;

            _strokeShapeStyle.margin = val / 2 + "px";
            _strokeShapeStyle.width  = 100 - _weightOffsetAsWidth  + "%";
            _strokeShapeStyle.height = 100 - _weightOffsetAsHeight + "%";
        },
        _adjustBorderOffsetByFillElement:function(val)
        {
            var _container = this.mContent.cmDisplay.container;
            var _weightOffsetAsWidth  = this.mBoxOffset / _container.width()  * 100;
            var _weightOffsetAsHeight = this.mBoxOffset / _container.height() * 100;
            var _vmlParentStyle = this.mVmlParent.style;

            _vmlParentStyle.margin = -val + "px";
            _vmlParentStyle.width  = 100 + _weightOffsetAsWidth  + "%";
            _vmlParentStyle.height = 100 + _weightOffsetAsHeight + "%";
        },
        _applyLinearGradient:function(gradient)
        {
            this.mFill.on = true;
            this.mFill.type = "gradient";
            this.mFill.method = "sigma";
            this.mFill.focus = 0;
            this.mFill.focusposition = "0 0";
            this.mFill.angle = (360 - gradient.linearDegree()) % 360;
            this.$class.updateColorByGradient(this.mFill, gradient);
        },
        _applyRadialGradient:function(gradient)
        {
            this._createRadialGradientShape();
            var
                _fill = this.mRadialGradientShape.getElementsByTagName("fill")[0],
                _path = this.mRadialGradientShape.getElementsByTagName("path")[0],
                _stroke = this.mRadialGradientShape.getElementsByTagName("stroke")[0],
                _colors = gradient.colors(),
                _origin = gradient.radialOrigin();
                _h = _origin.horizontal(), _v = _origin.vertical(),
                _len = _colors.length,
                _endColor = _colors[_len - 1],
                _radialSize = this._calcRadialGradientSize(gradient);

            _path.v = ex.string.concat("at ",
                (_h - _radialSize.width) * 1000|0,  ",", (_v - _radialSize.height) * 1000|0,    ", ",
                (_h + _radialSize.width) * 1000|0, ",", (_v + _radialSize.height) * 1000|0, ", ",
                (_h - _radialSize.x) * 1000|0,",", (_v - _radialSize.y) * 1000|0, ",",
                (_h - _radialSize.x) * 1000|0,  ",", (_v - _radialSize.y) * 1000|0,   " x e");

            this.updateBackgroundColor(_endColor);
            this.$class.updateColorByFillElement(_stroke, _endColor);
            this.$class.updateColorByGradient(_fill, gradient);
        },
        _calcRadialGradientSize:function(gradient)
        {
            var Gradient = cm.display.abs.fill.Gradient;
            var _sqrt = 1.4142135623730951;//Math.sqrt(2)
            var _origin = gradient.radialOrigin();
            var _sw, _sh, _h = _origin.horizontal(), _v = _origin.vertical();
            switch (gradient.radialSize())
            {
                case Gradient.RADIAL_SIZE.FARTHEST_SIDE:
                    _sw = (_h == 0 || _h == 1) ? 1: _h <= .5 ? 1 - _h: _h;
                    _sh = (_v == 0 || _v == 1) ? 1: _v <= .5 ? 1 - _v: _v;
                    if (gradient.radialShape() == Gradient.RADIAL_SHAPE.CIRCLE)
                       _sw = _sh = _sw < _sh ? _sh: _sw;
                    break;
                case Gradient.RADIAL_SIZE.CLOSEST_SIDE:
                    _sw = (_h == 0 || _h == 1) ? 0: _h > .5 ? 1 - _h: _h;
                    _sh = (_v == 0 || _v == 1) ? 0: _v > .5 ? 1 - _v: _v;
                    if (gradient.radialShape() == Gradient.RADIAL_SHAPE.CIRCLE)
                       _sw = _sh = _sw < _sh ? _sh: _sw;
                    break;
                case Gradient.RADIAL_SIZE.FARTHEST_CORNER:
                    _sw = (_h == 0 || _h == 1) ? 1: _h <= .5 ? 1 - _h: _h;
                    _sh = (_v == 0 || _v == 1) ? 1: _v <= .5 ? 1 - _v: _v;
                    if (gradient.radialShape() == Gradient.RADIAL_SHAPE.CIRCLE)
                        _sw = _sh = Math.sqrt(_sw * _sw + _sh * _sh);
                    else
                    {
                        _sw *= _sqrt;
                        _sh *= _sqrt;
                    }
                    break;
                case Gradient.RADIAL_SIZE.CLOSEST_CORNER:
                    _sw = (_h == 0 || _h == 1) ? 0: _h > .5 ? 1 - _h: _h;
                    _sh = (_v == 0 || _v == 1) ? 0: _v > .5 ? 1 - _v: _v;
                    if (gradient.radialShape() == Gradient.RADIAL_SHAPE.CIRCLE)
                        _sw = _sh = Math.sqrt(_sw * _sw + _sh * _sh);
                    else
                    {
                        _sw *= _sqrt;
                        _sh *= _sqrt;
                    }
                    break;
            }
            return {
                width: _sw,
                height:_sh,
                beginX:_sw,
                beginY:_sh * .5
            };
        },
        _clearGradient:function()
        {
            if (!eq.isUndefined(this.mRadialGradientShape)
            ||  !eq.isNull(this.mRadialGradientShape.parentNode))
                this.mOverflowParent.removeChild(this.mRadialGradientShape);
        },
        _createShadowShape:function(shadow)
        {
            _shadowShape = cm.dom.util.createElement("vml:shape");
            _shadowShape.className = "styleEmulate";
            _shadowShape.style.zIndex = -shadow.id();
            _shadowShape.id = "shadow" + shadow.id();
            _shadowShape.path = this.mPath;
            _shadowShape.stroked = false;
            return _shadowShape;
        },
        _removeShadowShape:function(shadow)
        {
            var _shadowShape = document.getElementById("shadow" + shadow.id());
            _shadowShape.parentNode.removeChild(_shadowShape);

            if (shadow.isInset())
            {
                delete this.mInsetShadowShape;
                this.$class.updateColorByShapeElement(this.mFill, this.mContent.cmDisplay.background.color());
            }
        }
    },
    $override:
    {
        //border
        updateBorderWeight:function(val)
        {
            this.mStroke.weight = val + "px";
            this.mBoxOffset = val * 2;
            this._setCssDummyBorder(val);
            this._adjustBorderOffsetByFillElement(val);
            this._adjustBorderOffsetByStrokeShape(val);
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
            this.$class.updateColorByFillElement(this.mStroke, color);
        },
        
        //background
        updateBackgroundColor:function(color)
        {
            if (eq.isUndefined(this.mInsetShadowShape))
            {
                this.enabledBackground();
                this.mFill.type = "solid";
                this.mFill.colors.value = "";
                this.$class.updateColorByFillElement(this.mFill, color);
            }
            else
                this.$class.updateColorByShapeElement(this.mInsetShadowShapeInner, color);
        },
        updateBackgroundGradient:function(gradient)
        {
            if (eq.isUndefined(this.mInsetShadowShape))
            {
                this.enabledBackground();
                gradient.type() == cm.display.abs.fill.Gradient.TYPE.RADIAL ?
                    this._applyRadialGradient(gradient):
                    this._applyLinearGradient(gradient);
            }
        },
        updateBackgroundImage:function(imageData)
        {
            if (eq.isUndefined(this.mInsetShadowShape))
            {
                var
                    _drawable = this,
                    _REPEAT = cm.display.abs.fill.ImageData.REPEAT,
                    _repeat = imageData.repeat(),
                    _container = _drawable.mContent.cmDisplay.container,
                    _cw = _container.width(),
                    _ch = _container.height(),
                    _fillShape = this.mFill.parentNode,
                    _fillShapeStyle = _fillShape.style,
                    _ov = imageData.origin().vertical(),
                    _oh = imageData.origin().horizontal(),
                    _ooh = this.mBoxOffset*.5 / _cw * (-(_oh - .5) / .5),
                    _oov = this.mBoxOffset*.5 / _ch * (-(_ov - .5) / .5);

                this.mFill.on = true;
                this.mFill.src = imageData.source();
                this.mFill.type = "tile";
                this.mFill.origin = ex.string.concat(_oh, ", ", _ov);
                this.mFill.position = ex.string.concat(_oh + _ooh, ", ", _ov + _oov);
                _fillShapeStyle.width = _fillShapeStyle.height = "100%";
                _fillShapeStyle.top = _fillShapeStyle.left = "0px";

                if (_repeat === _REPEAT.XY)
                {
                    if (_fillShape.parentNode !== this.mVmlParent)
                        this.mVmlParent.appendChild(_fillShape);
                }
                else
                {
                    if (eq.isUndefined(this.mImage))
                        this.mImage = cm.dom.util.createElement("img");
                    var _img = this.mImage;
                    _img.onload = function()
                    {
                        _drawable._tryAppendOverflowParent();

                        var
                            _boh = _drawable.mBoxOffset / 2;
                            _ov = imageData.origin().vertical(),
                            _oh = imageData.origin().horizontal(),
                            _overflowStyle = _drawable.mOverflowParent.style;
                            _refreshWidthAndLeft = function(imageWidth)
                            {
                                var _ofW = imageWidth < _cw ? imageWidth: _cw;
                                var _ofWPer = _cw / _ofW * 100;
                                var _ofX = (_cw - _ofW) * _oh;

                                _overflowStyle.width = _ofW + "px";
                                _overflowStyle.left = _ofX + _boh + "px";
                                _fillShapeStyle.width = _ofWPer + "%";
                                _fillShapeStyle.left = -_ofX + "px";
                             },
                            _refreshHeightAndTop = function(imageHeight)
                            {
                                var _ofH = imageHeight < _ch ? imageHeight: _ch;
                                var _ofHPer = _ch / _ofH * 100;
                                var _ofY = (_ch - _ofH) * _ov;

                                _overflowStyle.height = _ofH + "px";
                                _overflowStyle.top = _ofY + _boh + "px";
                                _fillShapeStyle.height = _ofHPer + "%";
                                _fillShapeStyle.top = -_ofY + "px";
                            };

                        _overflowStyle.width = _overflowStyle.height = "100%";
                        _overflowStyle.top = _overflowStyle.left = "0px";

                        if (_repeat === _REPEAT.X)
                            _refreshHeightAndTop(this.height, _overflowStyle);
                        else
                        if (_repeat === _REPEAT.Y)
                            _refreshWidthAndLeft(this.width, _overflowStyle);
                        else//_repeat == REPEATE.NONE
                        {
                            _refreshWidthAndLeft(this.width, _overflowStyle);
                            _refreshHeightAndTop(this.height, _overflowStyle);
                        }
                        _drawable.mOverflowParent.appendChild(_drawable.mFill.parentNode);

                        this.src = this.onload = "";
                    };
                    _img.src = imageData.source();
                }
            }
        },
        updateShape:function(presetShape)
        {
            if (presetShape.isRect())
                this.mPath.v = this.$class.RECT_TEMPLATE;
            else
            if (presetShape.isCircle())
                this.mPath.v = this.$class.CIRCLE_TEMPLATE;
            else
            {
                var
                    _container = this.mContent.cmDisplay.container,
                    _w   = _container.width(),
                    _h   = _container.height(),
                    _cap = Math.min(_w, _h) / 2;
                    _tlw = presetShape.topLeftCornerWidth(),
                    _tlh = presetShape.topLeftCornerHeight(),
                    _trw = presetShape.topRightCornerWidth(),
                    _trh = presetShape.topRightCornerHeight(),
                    _blw = presetShape.bottomLeftCornerWidth(),
                    _blh = presetShape.bottomLeftCornerHeight(),
                    _brw = presetShape.bottomRightCornerWidth(),
                    _brh = presetShape.bottomRightCornerHeight(),
                    _tlx = (_tlw > _cap ? _cap: _tlw) / _w * 1000 | 0,
                    _trx = (_trw > _cap ? _cap: _trw) / _w * 1000 | 0,
                    _blx = (_blw > _cap ? _cap: _blw) / _w * 1000 | 0,
                    _brx = (_brw > _cap ? _cap: _brw) / _w * 1000 | 0,
                    _tly = (_tlh > _cap ? _cap: _tlh) / _h * 1000 | 0,
                    _try = (_trh > _cap ? _cap: _trh) / _h * 1000 | 0,
                    _bly = (_blh > _cap ? _cap: _blh) / _h * 1000 | 0,
                    _bry = (_brh > _cap ? _cap: _brh) / _h * 1000 | 0,
                    _tlxDia = _tlx * 2,
                    _trxDia = _trx * 2,
                    _blxDia = _blx * 2,
                    _brxDia = _brx * 2,
                    _tlyDia = _tly * 2,
                    _tryDia = _try * 2,
                    _blyDia = _bly * 2,
                    _bryDia = _bry * 2;
                    
                this.mPath.v = ex.string.concat(
                    //topLeft
                    "ar 0,0,", _tlxDia, ",", _tlyDia, ", ", _tlx, ",0,0,", _tly,
                    //left
                    " l  0,", 1000 - _bly,
                    //bottomLeft
                    "at 0,", 1000 - _blyDia, ",", _blxDia, ",1000, 0,", 1000 - _bly, ",", _blx, ",", "1000",
                    //bottom
                    " l ", 1000 - _brx, ",1000 ",
                    //bottomRight
                    "at ", 1000 - _brxDia, ",", 1000 - _bryDia, ",1000,1000, ", 1000 - _brx, ",1000,1000,", 1000 - _bry,
                    //right
                    " l 1000," , _try,
                    //topRight
                    "at ", 1000 - _trxDia, ",0,1000,", _tryDia, ", 1000,", _try, ",", 1000 - _trx, ",0",
                    //top
                    " l ", _tlx, ",0 x");
            }
        },
        //filters
        applyShadow:function(shadow)
        {
            var
                _container = this.mContent.cmDisplay.container,
                _backgroundColor = this.mContent.cmDisplay.background.color(),
                _w = _container.width(),
                _h = _container.height(),
                _positionX = shadow.offsetPositionX(),
                _positionY = shadow.offsetPositionY(),
                _size = shadow.offsetSize() * .6,
                _radius = shadow.radius() * .6,
                _totalSize = _size * 2,
                _shadowShape = cm.dom.d.getElementById("shadow" + shadow.id()),
                _shadowShapeStyle;

            if (!_shadowShape) _shadowShape = this._createShadowShape(shadow);
            _shadowShapeStyle = _shadowShape.style;

            if (shadow.isInset())
            {
                this.$class.updateColorByFillElement(this.mFill, shadow.color());
                this.$class.updateColorByShapeElement(_shadowShape, _backgroundColor);
                cm.ieFilter.get(cm.ieFilter.ALPHA, _shadowShape).opacity = _backgroundColor.aRatio() * 100;

                _shadowShapeStyle.top = (_size + _positionY - _radius) + "px";
                _shadowShapeStyle.left = (_size + _positionX - _radius) + "px";
                _shadowShapeStyle.width = (100 - _totalSize / _w * 100) + "%";
                _shadowShapeStyle.height = (100 - _totalSize / _h * 100) + "%";
                cm.ieFilter.get(cm.ieFilter.BLUR, _shadowShape).pixelRadius = _radius;

                this._tryAppendOverflowParent();
                this.mOverflowParent.appendChild(_shadowShape);

                this.mInsetShadowShape = _shadowShape;
            }
            else
            {
                this.$class.updateColorByShapeElement(this.mFill, _backgroundColor);
                this.$class.updateColorByShapeElement(_shadowShape, shadow.color());
                cm.ieFilter.get(cm.ieFilter.ALPHA, _shadowShape).opacity = shadow.color().aRatio() * 100;

                _shadowShapeStyle.top = Math.round(_positionY - _size - _radius) + "px";
                _shadowShapeStyle.left = Math.round(_positionX - _size - _radius) + "px";
                _shadowShapeStyle.width = Math.round(100 + _totalSize / _w * 100) + "%";
                _shadowShapeStyle.height = Math.round(100 + _totalSize / _h * 100) + "%";
                cm.ieFilter.get(cm.ieFilter.BLUR, _shadowShape).pixelRadius = _radius;

                this.mVmlParent.appendChild(_shadowShape);

                delete this.mInsetShadowShape;
            }
        }
    }
});