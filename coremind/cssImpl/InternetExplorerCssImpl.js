cls.exports(
{
    /** @name cm.cssImpl */
    $name:"cm.cssImpl.InternetExplorerCssImpl",
    $extends:"cm.cssImpl.AbsCssImpl",
    $define:
    /** @lends cm.cssImpl.InternetExplorerCssImpl.prototype */
    {
        InternetExplorerCssImpl:function()
        {
            this.mCss = document.createStyleSheet();
            this.mCss.cssText = "css";
        },
        destroy:function() {}
    },
    $override:
    {
        _createStyleAccessor:function()
        {
            this.mPrefix = "-ms-";
            this.accessor = {
                textShadow     :"mstextShadow",
                boxShadow      :"boxShadow",
                transform      :"msTransform",
                transformOrigin:"msTransformOrigin",
                perspective    :"msPerspective"
            };
        },

        computedStyle:function(element) {
            return element.currentStyle;
        },
        ruleLength:function() {
            return this.mCss.rules.length;
        },
        getRule:function(index){
            return this.mCss.rules[index];
        },
        appendRule:function(selector, value, index) {
            this.log(selector, value, index);
            this.mCss.addRule(selector, value, index);
        },
        removeRule:function(index) {
            this.mCss.removeRule(index);
        },
        modifyRule:function(index, value) {
            this.log(index, this.mCss.rules[index].style.cssText);
            this.mCss.rules[index].style.cssText = value;
        }
    }
});