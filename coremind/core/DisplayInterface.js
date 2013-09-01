/** @name cm.core */
cls.exports(
//import
    "cm.util.UpdateDispatcher",
    "cm.display.abs.Filters",
    "cm.display.abs.Border",
    "cm.display.abs.Transform",
    "cm.display.abs.Background",
    "cm.display.abs.Container",
    "cm.display.abs.Position",
    "cm.core.CssInterface",
{
    $name:"cm.core.DisplayInterface",
    $static:
    {
        CHILDREN:[],
        attach:function(object)
        {
            this.detach(object);
            object.cmDisplay = new cm.core.DisplayInterface(object);

            var c = this.CHILDREN;
            c[c.length] = object;
            cm.util.UpdateDispatcher.setDrawableUpdater(this.draw);
            return object;
        },
        detach:function(object)
        {
            if (cm.core.DisplayInterface.equal(object.cmDisplay))
            {
                var c = this.CHILDREN;
                c.splice(c.indexOf(object), 1);
                object.cmDisplay.destroy();
                delete object.cmDisplay;
            }
            return object;
        },
        draw:function()
        {
            var c = cm.core.DisplayInterface.CHILDREN;
            for(var i = 0, len = c.length; i < len; i++)
                c[i].cmDisplay.drawable.draw();
        }
    },
    /** @lends cm.core.DisplayInterface.prototype */
    $define:
    {
        /**
         * @constructor
         * @name cm.core.DisplayInterface
         * @extends cm.BaseObject
         * @property {HTMLElement} root ツリーの大本となるオブジェクトです.
         */
        DisplayInterface:function(object)
        {
            this.parent = object;
            this.filters = new cm.display.abs.Filters();
            this.border = new cm.display.abs.Border();
            this.transform = new cm.display.abs.Transform();
            this.background = new cm.display.abs.Background();
            this.container = new cm.display.abs.Container();
            this.position = new cm.display.abs.Position();

            this.mAlpha = 1;
            this.mVisible = true;
        },
        destroy:function() {},
        
        useCss:function(forcedAbsolute) {
            this._initializeDrawableImpl(new cm.cssDrawable(this, forcedAbsolute));
            return this;
        },

        visible:function(val) {
            return this.mVisible;
        },
        setVisible:function(val) {
            this.mVisible = val;
            if (!eq.isUndefined(this.drawable))
                this.drawable.updateVisible(val);
            return this;
        },

        alpha:function() {
            return this.mAlpha;
        },
        alphaAbs:function(val) {
            this.mAlpha = val;
            if (!eq.isUndefined(this.drawable))
                this.drawable.updateAlpha(this.mAlpha);
            return this;
        },
        alphaRel:function(val) {
            this.mAlpha += val;
            if (!eq.isUndefined(this.drawable))
                this.drawable.updateAlpha(this.mAlpha);
            return this;
        },

        editFilters:function() {
            return this.filters;
        },
        editBorder:function() {
            return this.border;
        },
        editTransform:function() {
            return this.transform;
        },
        editBackground:function() {
            return this.background;
        },
        editContainer:function() {
            return this.container;
        },
        editPosition:function() {
            return this.position;
        },


        dumpProp:function()
        {
            this.position.dumpProp();
            this.container.dumpProp();
            this.transform.dumpProp();
            this.background.dumpProp();
            this.border.dumpProp();
        },
        _initializeDrawableImpl:function(drawableImpl)
        {
            if (!eq.isUndefined(this.drawable))
                this.drawable.destroy();
                
            this.drawable = drawableImpl;
            this.drawable.applySorceParameters();
        }
    }
});