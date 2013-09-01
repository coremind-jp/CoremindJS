/** @name cm.display.abs */
cls.exports(
{
    $name:"cm.display.abs.Drawable",
    $define:
    /** @lends cm.display.abs.Drawable.prototype */
    {
        Drawable:function(cmDisplay) {},
        destroy:function() {},
        
        applySorceParameters:function() {},
        
        //toplevel
        updateVisible:function(val) {},
        updateAlpha:function(val) {},

        //border
        enabledBorder:function() {},
        updateBorderWeight:function(val) {},
        updateBorderStyle:function(val) {},
        updateBorderColor:function(color) {},
        disabledBorder:function() {},
        
        //background
        enabledBackground:function() {},
        updateBackgroundColor:function(color) {},
        updateBackgroundGradient:function(gradient) {},
        updateBackgroundImage:function(imageData) {},
        disabledBackground:function() {},
        
        //position
        updateX:function(val) {},
        updateY:function(val) {},
        updateZ:function(val) {},
        
        //transform
        updateScaleX:function(val) {},
        updateScaleY:function(val) {},
        updateScaleZ:function(val) {},
        updateRotationX:function(val) {},
        updateRotationY:function(val) {},
        updateRotationZ:function(val) {},
        updateOrigin:function(origin) {},
        updatePerspective:function(origin) {},
        
        //container
        updateWidth:function(val) {},
        updateHeight:function(val) {},
        updateContentWidth:function(val) {},
        updateContentHeight:function(val) {},
        updateShape:function(presetShape) {},
        
        //filter
        applyShadow:function(shadow) {},
        removeShadow:function(shadow) {},
        
        draw:function()
        {
            var _display = this.mContent.cmDisplay;
            if (_display.visible() && _display.alpha() > 0)
            {
                this._beginDraw();
                this._tryUpdateBorder(_display.border);
                this._tryUpdateBackground(_display.background);
                this._tryUpdatePosition(_display.position);
                this._tryUpdateTransform(_display.transform);
                this._tryUpdateContainer(_display.container);
                this._tryRemoveFilters(_display.filters._removedFilters());
                this._tryApplyFilters(_display.filters._get());
                this._endDraw();
            }
        },
        
        _beginDraw:function(){},
        _tryUpdateBackground:function(background)
        {
            if (!eq.isUndefined(background) && background.isChanged())
            {
                if (background.isEnabled(2))
                    this.updateBackgroundColor(background.color());
                else
                if (background.isEnabled(4))
                {
                    background.gradient().updateThreshold();
                    this.updateBackgroundGradient(background.gradient());
                }
                else
                    this.updateBackgroundImage(background.image());//8

                background.applied();
            }
        },
        _tryUpdateBorder:function(border)
        {
            if (!eq.isUndefined(border) && border.isChanged())
            {
                if (border.isEnabled(2)) this.updateBorderWeight(border.weight());
                if (border.isEnabled(4)) this.updateBorderStyle(border.style());
                if (border.isEnabled(8)) this.updateBorderColor(border.color());
                border.applied();
            }
        },
        _tryUpdatePosition:function(position)
        {
            if (!eq.isUndefined(position) && position.isChanged())
            {
                if (position.isEnabled(2)) this.updateX(position.x());
                if (position.isEnabled(4)) this.updateY(position.y());
                if (position.isEnabled(8)) this.updateZ(position.z());
                position.applied();
            }
        },
        _tryUpdateTransform:function(transform)
        {
            if (!eq.isUndefined(transform) && transform.isChanged())
            {
                if (transform.isEnabled(2)) this.updateScaleX(transform.scaleX());
                if (transform.isEnabled(4)) this.updateScaleY(transform.scaleY());
                if (transform.isEnabled(8)) this.updateScaleZ(transform.scaleZ());
                
                if (transform.isEnabled(16)) this.updateRotationX(transform.rotationX());
                if (transform.isEnabled(32)) this.updateRotationY(transform.rotationY());
                if (transform.isEnabled(64)) this.updateRotationZ(transform.rotationZ());
                
                if (transform.isEnabled(128)) this.updatePerspective(transform.updatePerspective());
                if (transform.isEnabled(256)) this.updateOrigin(transform.origin());
                transform.applied();
            }
        },
        _tryUpdateContainer:function(container)
        {
            if (!eq.isUndefined(container) && container.isChanged())
            {
                if (container.isEnabled(2)) this.updateWidth(container.width());
                if (container.isEnabled(4)) this.updateHeight(container.height());
                if (container.isEnabled(8)) this.updateContentWidth(container.contentWidth());
                if (container.isEnabled(16)) this.updateContentHeight(container.contentHeight());
                if (container.isEnabled(32)) this.updateShape(container.shape());
                container.applied();
            }
        },
        _tryApplyFilters:function(filters)
        {
            if (!eq.isUndefined(filters))
            {
                for(var i = 0, len = filters.length; i < len; i++)
                    if (filters[i].isChanged())
                        this._applyFilter(filters[i]);
            }
        },
        _applyFilter:function(filter)
        {
            if (cm.display.abs.filter.Shadow.equal(filter))
            {
                this.applyShadow(filter);
                filter.applied();
            }
        },
        
        _tryRemoveFilters:function(filters)
        {
            if (!eq.isUndefined(filters))
                while(filters.length > 0)
                        this._removeFilter(filters.shift());
        },
        _removeFilter:function(filter)
        {
            if (cm.display.abs.fill.Shadow.equal(filter))
            {
                this.removeShadow(filter);
            } 
        },
        _endDraw:function(){}
    }
    
});