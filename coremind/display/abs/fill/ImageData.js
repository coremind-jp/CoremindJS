cm.Class.create(
//import
    "cm.math.Vector2D",
    "cm.util.Align",
{
    /** @name cm.util */
    $name:"cm.display.abs.fill.ImageData",
    $static:{
        REPEAT:{
            NONE:0,
            X:1,
            Y:2,
            XY:3
        }
    },
    $define:
    /** @lends cm.display.abs.fill.ImageData.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.fill.ImageData
         * @extends cm.BaseObject
         */
        ImageData:function() {},
        destroy:function() {},
        
        _runtimeInitialize:function()
        {
            this.mSource = "";
            this.mAlign = new cm.util.Align();
            //this.mAlpha = 0;
            //this.mRepeat = cm.display.abs.fill.ImageData.REPEAT.NONE;
            
            this.setSource = this._setSource;
            this.editAlign = this._editAlign;
            //this.setAlpha = this._setAlpha;
            //this.setRepeate = this._setRepeate;
        },
        
        source:function() {
            return this.mSource;
        },
        setSource:function(imageSource)
        {
            this._runtimeInitialize();
            return this.setSource(imageSource);
        },
        _setSource:function(imageSource)
        {
            this.mSource = imageSource;
            return this;
        },
        
        /*
        alpha:function() {
            return this.mAlpha;
        },
        setAlpha:function(val)
        {
            this._runtimeInitialize();
            return this.setAlpha(val);
        },
        _setAlpha:function(val)
        {
            this.mAlpha = val;
            return this;
        },
        repeat:function() {
            return this.mRepeat;
        },
        setRepeat:function(val)
        {
            this._runtimeInitialize();
            return this.setRepeat(val);
        },
        _setRepeat:function(val)
        {
            this.mRepeat = val;
            return this;
        },
        */
        
        align:function() {
            return this.mAlign;
        },
        editAlign:function() {
            this._runtimeInitialize();
            return this.mAlign;
        },
        _editAlign:function() {
            return this.mAlign;
        }
        
    }
});