cm.Class.create(
    "cm.math.Matrix2D",
{
    /** @name cm.display */
    $name:"cm.display.impl.DrawableOldInternetExplorerImpl",
    $extends:"cm.display.impl.DrawableVmlImpl",
    $define:
    /** @lends cm.display.impl.DrawableOldInternetExplorerImpl.prototype */
    {
        mParams:"",
        mVml:null,
        
        DrawableOldInternetExplorerImpl:function(target)
        {
            if (cm.core.UserAgent.vendor !== cm.core.UserAgent.Vendor.MicroSoft)
                cm.log.e("this browser is not InternetExploler");
                
            this.mRotationOffsetX = this.mRotationOffsetY = 0;
            //target.style.filter = 
                //"progid:DXImageTransform.Microsoft.Matrix(FilterType='bilinear', sizingMethod='auto expand')";
            this.mParams = target.filters["matrix"];
        },
        destroy:function() {},
        
        beginDraw:function() {
            this.mRatated = false;
        },
        
        //Position
        updateX:function(val) {
            this.mContentParentStyle.left = val + this.mRotationOffsetX + "px";
        },
        updateY:function(val) {
            this.mContentParentStyle.top = val + this.mRotationOffsetY + "px";
        },
        
        //transform
        updateScaleX:function(val) {
            this.updateRotationZ(this.mTarget.cmDisplay.transform.rotationZ());
        },
        updateScaleY:function(val) {
            this.updateRotationZ(this.mTarget.cmDisplay.transform.rotationZ());
        },
        updateRotationZ:function(val)
        {
            if (this.mRatated)
                return;
                
            val = val < 0 ? 360 - (val % 360): val % 360;
            var _r = Math.PI / 180 * val;
            var _sin = Math.sin(_r);
            var _cos = Math.cos(_r);
            this._updateMatrix(_sin, _cos);
            this._updateRotateOffset(val, _sin, _cos);
            this.mRatated = true;
        },
        _updateMatrix:function(sin, cos)
        {
            var _matrix = cm.math.Matrix2D.multiple(
                cm.math.Matrix2D.createRotate(sin, cos),
                cm.math.Matrix2D.createScale(
                    this.mContent.cmDisplay.transform.scaleX(),
                    this.mContent.cmDisplay.transform.scaleY()));
                    
            this.mParams.M11 = _matrix[0];
            this.mParams.M12 = _matrix[1];
            this.mParams.M21 = _matrix[3];
            this.mParams.M22 = _matrix[4];
        },
        _updateRotateOffset:function(deg, sin, cos)
        {
            var _transform = this.mContent.cmDisplay.transform;
            var _container = this.mContent.cmDisplay.container;
            var _w = _container.width() * _transform.scaleX();
            var _h = _container.height() * _transform.scaleY();
            if (deg < 180)
            {
                if (deg < 90)
                {
                    this.mRotationOffsetX = -_h * sin;
                    this.mRotationOffsetY = 0;
                }
                else
                {
                    this.mRotationOffsetX = _w * cos - _h * sin;
                    this.mRotationOffsetY = _h * cos;
                }
            }
            else
            {
                if (deg < 270)
                {
                    this.mRotationOffsetX = _w * cos;
                    this.mRotationOffsetY = _h * cos + _w * sin;
                }
                else
                {
                    this.mRotationOffsetX = 0;
                    this.mRotationOffsetY = _w * sin;
                }
            }
            var _position = this.mContent.cmDisplay.position;
            this.updateX(_position.x());
            this.updateY(_position.y());
        },
        
        //filters
        applyShadow:function(shadow)
        {
            var _shadowShape = document.getElementById("shadow" + shadow.id());
            _shadowShape = _shadowShape ? _shadowShape: shadow.isInset() ?
                this._createInsetShadowShape(shadow):
                this._createShadowShape(shadow);
            
            //position edit params
            var _position = shadow.offsetPosition();
            var _size = shadow.offsetSize();
            var _radius = shadow.radius();
            
            //size update params
            var _totalSize = _size * 2;
            var _container = this.mContent.cmDisplay.container;
            var _w = _container.width();
            var _h = _container.height();
            
            var _alpha = "DXImageTransform.Microsoft.Alpha";
            var _blur = "DXImageTransform.Microsoft.Blur";
            
            if (shadow.isInset())
            {
                if (_shadowShape.tagName == "shape")
                {
                    this.removeShadow(shadow);
                    _shadowShape = this._createInsetShadowShape(shadow);
                }
                this._tryCreateBottomMaskLayer();
                this.mBottomMaskLayer.appendChild(this.mShape);
                this.mBottomMaskLayer.appendChild(_shadowShape);
                
                var _outer = this.mInsetShadowShapeOuter;
                var _inner = this.mInsetShadowShapeInner;
                _outer.fillcolor = "#" + shadow.color().rgb();
                _outer.filters[_alpha].opacity = shadow.color().aRatio() * 100;
                
                _inner.style.top = (_size + _position.y - _radius) + "px";
                _inner.style.left = (_size + _position.x - _radius) + "px";
                _inner.style.width = (100 - _totalSize / _w * 100) + "%";
                _inner.style.height = (100 - _totalSize / _h * 100) + "%";
                _inner.filters[_blur].pixelRadius = shadow.radius();
            }
            else
            {
                this._tryCreateShadowLayer();
                this.mShadowLayer.appendChild(_shadowShape);
                _shadowShape.fillcolor = "#" + shadow.color().rgb();
                _shadowShape.style.top = (_position.y - _size - _radius) + "px";
                _shadowShape.style.left = (_position.x - _size - _radius) + "px";
                _shadowShape.style.width = (100 + _totalSize / _w * 100) + "%";
                _shadowShape.style.height = (100 + _totalSize / _h * 100) + "%";
                _shadowShape.filters[_alpha].opacity = shadow.color().aRatio() * 100;
                _shadowShape.filters[_blur].pixelRadius = shadow.radius();
            }
        },
        _tryCreateShadowLayer:function()
        {
            if (cm.equal.isUndefined(this.mShadowLayer))
            {
                this._tryCreateBottomLayer();
                this.mShadowLayer = document.createElement("div");
                this.mShadowLayer.name = "cmShadowLayer";
                this.mBottomLayer.appendChild(this.mShadowLayer);
                this.mShadowLayer.style.width = this.mShadowLayer.style.height = "100%";
            }
        },
        removeShadow:function(shadow)
        {
            if (shadow.isInset())
            {
                this.mInsetShadowShapeOuter = this.mInsetShadowShapeInner = null;
                this.mContent.insertBefore(this.mShape, this.mContent.firstChild);
            }
                
            var _shadowShape = document.getElementById("shadow" + shadow.id());
            _shadowShape.parentNode.removeChild(_shadowShape);
        },
        
        endDraw:function(){
            this.mRatated = false;
        }
    }
});