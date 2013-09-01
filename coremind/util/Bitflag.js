cls.exports(
{
    /** @name cm.display */
    $name:"cm.util.Bitflag",
    $define:
    /** @lends cm.util.Bitflag.prototype */
    {
        /**
         * @constructor
         * @name cm.util.Bitflag
         * @extends cm.BaseObject
         */
        Bitflag:function()
        {
            //don't use index 0.
            this.mFlags = 0;
        },
        destroy:function() {},
        reset:function() {
            this.mFlags = 0;
        },
        isEnabledAnyFlags:function() {
            return this.mFlags > 0;
        },
        isEnabled:function(bit) {
            return (this.mFlags & bit) > 0;
        },
        enabledFlag:function(bit) {
            if ((this.mFlags & bit) == 0) this.mFlags |= bit;
        },
        disabledFlag:function(bit) {
            if ((this.mFlags & bit) > 0) this.mFlags ^= bit;
        },
        
        /**
         * 文字列表現を取得します.
         */
        dumpFlag:function() {
            this.log(ex.string.concat("\nflag:", this.mFlags.toString(2)));
        }
    }
});