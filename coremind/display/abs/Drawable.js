/** @name cm.display.abs */
cm.Class.create(
{
    $name:"cm.display.abs.Drawable",
    $define:
    /** @lends cm.display.abs.Drawable.prototype */
    {
        Drawable:function(cmDisplay)
        {
            this.mTopLayer = null;
            this.mTopMaskLayer = null;
            this.mBottomLayer = null;
            this.mBottomMaskLayer = null;
            this.mContentParent = this.mContent = cmDisplay.parent;
        },
        destroy:function() {},
        
        applySorceParameters:function() {},
        
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
        updateOriginX:function(val) {},
        updateOriginY:function(val) {},
        
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
            this._beginDraw();
            this._tryUpdateBackground(_display.background);
            this._tryUpdateBorder(_display.border);
            this._tryUpdatePosition(_display.position);
            this._tryUpdateTransform(_display.transform);
            this._tryUpdateContainer(_display.container);
            this._tryRemoveFilters(_display.filters._removedFilters());
            this._tryApplyFilters(_display.filters._get());
            this._endDraw();
        },
        
        _beginDraw:function(){},
        _tryUpdateBackground:function(background)
        {
            if (!cm.equal.isUndefined(background) && background.isChanged())
            {
                background.isEnabled(2) ?
                    this.updateBackgroundColor(background.color()):
                    background.isEnabled(4) ?
                    this.updateBackgroundGradient(background.gradient()):
                    this.updateBackgroundImage(background.image());//8
                background.applied();
            }
        },
        _tryUpdateBorder:function(border)
        {
            if (!cm.equal.isUndefined(border) && border.isChanged())
            {
                if (border.isEnabled(2)) this.updateBorderWeight(border.weight());
                if (border.isEnabled(4)) this.updateBorderStyle(border.style());
                if (border.isEnabled(8)) this.updateBorderColor(border.color());
                border.applied();
            }
        },
        _tryUpdatePosition:function(position)
        {
            if (!cm.equal.isUndefined(position) && position.isChanged())
            {
                if (position.isEnabled(2)) this.updateX(position.x());
                if (position.isEnabled(4)) this.updateY(position.y());
                if (position.isEnabled(8)) this.updateZ(position.z());
                position.applied();
            }
        },
        _tryUpdateTransform:function(transform)
        {
            if (!cm.equal.isUndefined(transform) && transform.isChanged())
            {
                if (transform.isEnabled(2)) this.updateScaleX(transform.scaleX());
                if (transform.isEnabled(4)) this.updateScaleY(transform.scaleY());
                if (transform.isEnabled(8)) this.updateScaleZ(transform.scaleZ());
                
                if (transform.isEnabled(16)) this.updateRotationX(transform.rotationX());
                if (transform.isEnabled(32)) this.updateRotationY(transform.rotationY());
                if (transform.isEnabled(64)) this.updateRotationZ(transform.rotationZ());
                
                if (transform.isEnabled(128)) this.updateOriginX(transform.originX());
                if (transform.isEnabled(256)) this.updateOriginY(transform.originY());
                transform.applied();
            }
        },
        _tryUpdateContainer:function(container)
        {
            if (!cm.equal.isUndefined(container) && container.isChanged())
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
            if (!cm.equal.isUndefined(filters))
                for(var i = 0, len = filters.length; i < len; i++)
                    if (filters[i].isChanged())
                        this._applyFilter(filters[i]);
        },
        _applyFilter:function(filter)
        {
            if (cm.display.abs.fill.Shadow.equal(filter)) this.applyShadow(filter);
            filter.applied();
        },
        
        _tryRemoveFilters:function(filters)
        {
            if (!cm.equal.isUndefined(filters))
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