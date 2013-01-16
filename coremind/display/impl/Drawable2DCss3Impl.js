cm.Class.create(
    "cm.core.BrowserInterface",
{
    /** @name cm.display */
    $name:"cm.display.impl.Drawable2DCss3Impl",
    $extends:"cm.display.AbsDrawable",
    $static:
    {
        TRANSFORM:"$eval:'-' + cm.core.UserAgent.vendorPrefix + '-transform'",
        TRANSFORM_ORIGIN:"$eval:'-' + cm.core.UserAgent.vendorPrefix + '-transform-origin'"
    },
    $define:
    /** @lends cm.display.DrawableCss3Impl.prototype */
    {
        mParams:"",
        
        Drawable2DCss3Impl:function(target)
        {
            if (target.style)
            {
                this.mIndex = cm.browser.BrowserInterface.getCssRuleIndex();
                
                this.mParams = cm.string.concat(
                    cm.display.Drawable2DCss3Impl.TRANSFORM,
                    ":translateX(0px) translateY(0px) scaleX(1) scaleY(1) rotate(0deg); ",
                    cm.display.Drawable2DCss3Impl.TRANSFORM_ORIGIN,
                    ":0% 0%;");
                
                target.style.position = "absolute";
                target.style.top = 0 + "px";
                target.style.left = 0 + "px";
                
                var _className = "drawable_" + this.getRefCount();
                cm.browser.BrowserInterface.appendCssRule(_className, this.mParams, this.mIndex);
                
                target.className = target.className.indexOf("drawable_") ?
                     target.className + " " + _className: _className;
            }
            else
                cm.log.e("target has not property [style]");
        },
        destroy:function() {
            cm.browser.BrowserInterface.removeCssRule(this.mIndex);
            this.mIndex = this.mClassName = this.mParams = null;
        },
        
        
        beginDraw:function(){
        },
        endDraw:function(){
            cm.browser.BrowserInterface.modifyCssRule(this.mIndex, this.mParams);
        },
        
        
        //Position
        updateX:function(val) {
            this.mParams = this.mParams.replace(
                /translateX\([\d|\.]+px\)/,
                cm.string.concat("translateX(", val, "px)"));
        },
        updateY:function(val) {
            this.mParams = this.mParams.replace(
                /translateY\([\d|\.]+px\)/,
                cm.string.concat("translateY(", val, "px)"));
        },
        updateZ:function(val) {},
        
        
        //Scale
        updateScaleX:function(val) {
            this.mParams = this.mParams.replace(
                /scaleX\([\d|\.]+\)/,
                cm.string.concat("scaleX(", val, ")"));
        },
        updateScaleY:function(val) {
            this.mParams = this.mParams.replace(
                /scaleY\([\d|\.]+\)/,
                cm.string.concat("scaleY(", val, ")"));
        },
        updateScaleZ:function(val) {},
        
        
        //Rotation
        updateRotationX:function(val) {},
        updateRotationY:function(val) {},
        updateRotationZ:function(val) {
            this.mParams = this.mParams.replace(
                /rotate\([\d|\.]+deg\)/,
                cm.string.concat("rotate(", val, "deg)"));
        },
        
        
        //origin
        updateOriginX:function(val) {
            this.mParams = this.mParams.replace(/origin:[\d|\.]+%/,
                cm.string.concat("origin:", val, "%"));
        },
        updateOriginY:function(val) {
            this.mParams = this.mParams.replace(/ [\d|\.]+%;/,
                cm.string.concat(" ", val, "%;"));
        }
    }
});