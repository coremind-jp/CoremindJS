/** @name cm.core */
cm.Class.create(
//import
    "cm.display.abs.Filters",
    "cm.display.abs.Border",
    "cm.display.abs.Transform",
    "cm.display.abs.Background",
    "cm.display.abs.Container",
    "cm.display.abs.Position",
    "cm.display.impl.DrawableCss3Impl",
{
    $name:"cm.core.DisplayInterface",
    $static:
    {
        attach:function(object)
        {
            this.detach(object);
            object.cmDisplay = new cm.core.DisplayInterface(object);
        },
        detach:function(object)
        {
            if (!cm.equal.isUndefined(object.cmDisplay)
            &&   cm.core.DisplayInterface.equal(object.cmDisplay))
            {
                object.cmDisplay.destroy();
                delete object.cmDisplay;
            }
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
        },
        destroy:function() {},
        
        useCss:function() {
            this._initializeDrawableImpl(new cm.display.impl.DrawableCss3Impl(this));
        },
        useCss3:function() {
            this._initializeDrawableImpl(new cm.display.impl.DrawableCss3Impl(this));
        },
        
        _initializeDrawableImpl:function(drawableImpl)
        {
            if (!cm.equal.isUndefined(this.drawable))
                this.drawable.destroy();
                
            this.drawable = drawableImpl;
            this.drawable.applySorceParameters();
        }
        
    }
});