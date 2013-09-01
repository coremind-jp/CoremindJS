cls.exports(
    "cm.math.Vector2D",
    "cm.math.Matrix2D",
    "cm.cssImpl.InternetExplorerFilter",
{
    /** @name cm.display */
    $name:"cm.display.impl.DrawableInternetExplorer7_8Impl",
    $extends:"cm.display.impl.DrawableVmlImpl",
    $define:
    /** @lends cm.display.impl.DrawableOldInternetExplorerImpl.prototype */
    {
        DrawableInternetExplorer7_8Impl:function(cmDisplay, forcedAbsolute) {
        },
        destroy:function() {},
        
        _applyMatrix:function()
        {
            var
                M = cm.math.Matrix2D,
                V = cm.math.Vector2D,
                _transform = this.mContent.cmDisplay.transform,
                _container = this.mContent.cmDisplay.container,
                _deg = _transform.rotationZ(),
                _oh = _transform.origin().horizontal(),
                _ov = _transform.origin().vertical(),
                _sx = _transform.scaleX(),
                _sy = _transform.scaleY(),
                _cw = _container.width() + this.mBoxOffset,
                _ch = _container.height() + this.mBoxOffset,
                _hb = this.mBoxOffset * .5,//vml border size
                _bw = _bh = 0, _matrix;

            this._applyVector(
                  0,   0,
                _cw,   0,
                  0, _ch,
                _cw, _ch,
                _cw * (.5 - _oh), _ch * (.5 - _ov));

            if (_deg == 0)
            {
                _matrix = M.createScale(_sx, _sy);
                _bw = _cw * _sx;
                _bh = _ch * _sy;
            }
            else
            {
                _deg = (_deg < 0) ? 360 - (_deg % 360): _deg % 360;

                var _r = Math.PI / 180 * _deg;
                _matrix = M.multipleMatrix(
                    M.createRotate(Math.sin(_r), Math.cos(_r)),
                    M.createScale(_sx, _sy));

                //calc bounding box
                var lt = M.multipleVector(this.mVectors[0], _matrix);
                var rt = M.multipleVector(this.mVectors[1], _matrix);
                var lb = M.multipleVector(this.mVectors[2], _matrix);
                var rb = M.multipleVector(this.mVectors[3], _matrix);
                _bw = Math.max(lt.x, rt.x, lb.x, rb.x) - Math.min(lt.x, rt.x, lb.x, rb.x);
                _bh = Math.max(lt.y, rt.y, lb.y, rb.y) - Math.min(lt.y, rt.y, lb.y, rb.y);
            }
            if (eq.isUndefined(this.mMatrix))
            {
                this.mMatrix = cm.ieFilter.get(cm.ieFilter.MATRIX, this.mContent);
                this.mMatrix.FilterType = "bilinear";
                this.mMatrix.SizingMethod = "auto expand";
            }
            this.mMatrix.M11 = _matrix[0];
            this.mMatrix.M12 = _matrix[1];
            this.mMatrix.M21 = _matrix[3];
            this.mMatrix.M22 = _matrix[4];

            var _margin = M.multipleVector(this.mVectors[4], _matrix);
            _margin.x += _cw * _oh - _bw * .5;
            _margin.y += _ch * _ov - _bh * .5;
            this.mContentStyle.marginLeft = _margin.x|0 + "px";
            this.mContentStyle.marginTop = _margin.y|0 + "px";
        },
        _applyVector:function(
            x1, y1,
            x2, y2,
            x3, y3,
            x4, y4,
            x5, y5)
        {
            if (eq.isUndefined(this.mVectors))
            {
                var V = cm.math.Vector2D;
                this.mVectors = new Array();
                this.mVectors[0] = new V();
                this.mVectors[1] = new V();
                this.mVectors[2] = new V();
                this.mVectors[3] = new V();
                this.mVectors[4] = new V();
            }
            this.mVectors[0].x = x1;
            this.mVectors[0].y = y1;
            this.mVectors[1].x = x2;
            this.mVectors[1].y = y2;
            this.mVectors[2].x = x3;
            this.mVectors[2].y = y3;
            this.mVectors[3].x = x4;
            this.mVectors[3].y = y4;
            this.mVectors[4].x = x5;
            this.mVectors[4].y = y5;
        }
    },
    $override:
    {
        //toplevel
        updateAlpha:function(val) {
            cm.ieFilter.get(cm.ieFilter.ALPHA, this.mContent).opacity = val * 100;
        },
        //transform
        _tryUpdateTransform:function(transform)
        {
            if (!eq.isUndefined(transform) && transform.isChanged())
            {
                if (transform.isEnabled(2)
                ||  transform.isEnabled(4)
                ||  transform.isEnabled(64)
                ||  transform.isEnabled(256))
                    this._applyMatrix();

                transform.applied();
            }
        }
    }
});