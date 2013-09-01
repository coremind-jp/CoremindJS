cls.exports(
//import
    "cm.math.Vector2D",
    "cm.display.abs.Align",
{
    /** @name cm.util */
    $name:"cm.display.abs.fill.ImageData",
    $static:
    {
        REPEAT:
        {
            NONE:"no-repeat",
            X:"repeat-x",
            Y:"repeat-y",
            XY:"repeat"
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
            this.mOrigin = new cm.display.abs.Align();
            this.mRepeat = cm.display.abs.fill.ImageData.REPEAT.XY;
            
            this.setSource = this._setSource;
            this.setRepeat = this._setRepeat;
            this.editOrigin = this._editOrigin;
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
        
        origin:function() {
            return this.mOrigin;
        },
        editOrigin:function() {
            this._runtimeInitialize();
            return this.mOrigin;
        },
        _editOrigin:function() {
            return this.mOrigin;
        },

        /**
         * 文字列表現を取得します.
         */
        dumpProp:function()
        {
            this.log(
                "\nsource:", this.mSource,
                "\nrepeat:", this.mRepeat,
                "\nalpha:", this.mAlpha);
            
            eq.isUndefined(this.mOrigin) ?
                this.log("\nalign:", undefined):
                this.mOrigin.dumpProp();
        }
    }
});