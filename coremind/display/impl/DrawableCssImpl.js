cm.Class.create(
    "cm.core.BrowserInterface",
{
    /** @name cm.display */
    $name:"cm.display.impl.DrawableCssImpl",
    $extends:"cm.display.abs.Drawable",
    $define:
    /** @lends cm.display.impl.DrawableCssImpl.prototype */
    {
        mContentParentStyle:null,
        mContentStyle:null,
        
        DrawableCssImpl:function(cmDisplay)
        {
            if (cm.equal.isUndefined(this.mContent.nodeType)
            ||  this.mContent.nodeType != 1)
                cm.log.e("target is not HTMLElement");
                
            this.mContentParentStyle = this.mContentParent.style;
            this.mContentStyle = this.mContent.style;
            
            this._appendCssTemplate();
        },
        destroy:function() {},
        
        _appendCssTemplate:function()
        {
            cm.css.appendRule(".absoluteFit",
                cm.string.concat(
                    "position: absolute;",
                    "left:0px;",
                    "top:0px;",
                    "width:100%;",
                    "height:100%"),
                cm.css.ruleLength());
                
            cm.css.appendRule(".relativeFit",
                cm.string.concat(
                    "position: relative;",
                    "left:0px;",
                    "top:0px;",
                    "width:100%;",
                    "height:100%"),
                cm.css.ruleLength());
        },
        
        applySorceParameters:function()
        {
            cm.css.applyPosition(this.mContent.cmDisplay, this.mContentParentStyle);
            cm.css.applyContainer(this.mContent.cmDisplay, this.mContentParentStyle);
        },
        
        //Position
        updateX:function(val) {
            this.mContentParentStyle.left = val + "px";
        },
        updateY:function(val) {
            this.mContentParentStyle.top = val + "px";
        },
        
        //container
        updateWidth:function(val) {
            this.mContentStyle.width = this.mContentParentStyle.width = val + "px";
        },
        updateHeight:function(val) {
            this.mContentStyle.height = this.mContentParentStyle.height = val + "px";
        },
        updateColor:function(color)
        {
            this.mContentStyle.backgroundColor = 
                color.a() > 0 ?
                    "#" + color.rgb().toString(16):
                    "transparent";
        },
        updateImage:function(imageData) {
            this.mStyle.backgroundImage = cm.string.concat("url(", imageData.source(), ")");
        },
        
        
        _tryCreateBottomLayer:function()
        {
            this._tryCreateParent();
            this._tryCreateLayer("mBottomLayer", "cmBottomLayer");
            this.mContentParent.insertBefore(this.mBottomLayer, this.mContentParent.firstChild);
        },
        _tryCreateBottomMaskLayer:function()
        {
            this._tryCreateParent();
            this._tryCreateLayer("mBottomMaskLayer", "cmBottomMaskLayer");
            this.mBottomMaskLayer.style.overflow = "hidden";
            this.mBottomLayer.appendChild(this.mBottomMaskLayer);
        },
        _tryCreateTopLayer:function()
        {
            this._tryCreateParent();
            this._tryCreateLayer("mTopLayer", "cmTopLayer");
            this.mContentParent.insertBefore(this.mTopLayer, this.mContentParent.lastChild);
        },
        _tryCreateTopMaskLayer:function()
        {
            this._tryCreateParent();
            this._tryCreateLayer("mTopMaskLayer", "cmTopMaskLayer");
            this.mTopMaskLayer.style.overflow = "hidden";
            this.mTopLayer.appendChild(this.mTopMaskLayer);
        },
        _tryCreateLayer:function(propertyName, elementName)
        {
            if (cm.equal.isNull(this[propertyName]))
            {
                var _element = document.createElement("div");
                _element.name = elementName;
                _element.className = "absoluteFit";
                this[propertyName] = _element;
            }
        },
        _tryCreateParent:function()
        {
            if (this.mContent === this.mContentParent)
            {
                this.mContentParent = document.createElement("div");
                this.mContentParent.name = "cmContentParent";
                this.mContentParentStyle = this.mContentParent.style;
                this.mContentParentStyle.position = this.mContentStyle.position;
                
                this.mContentStyle.left = this.mContentStyle.top = "0px";
                this.mContent.parentNode.insertBefore(this.mContentParent, this.mContent);
                this.mContentParent.appendChild(this.mContent);
                
                var p = this.mContent.cmDisplay.position;
                var c = this.mContent.cmDisplay.container;
                this.updateX(p.x());
                this.updateY(p.y());
                this.updateWidth(c.width());
                this.updateHeight(c.height());
            }
        }
        
    }
});