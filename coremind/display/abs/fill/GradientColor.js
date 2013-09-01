cls.exports(
{
    /** @name cm.util */
    $name:"cm.display.abs.fill.GradientColor",
    $extends:"cm.display.abs.fill.Color",
    $define:
    /** @lends cm.display.abs.fill.Color.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.fill.Color
         * @extends cm.BaseObject
         */
        GradientColor:function(hex, weight) {
            this.mWeight = eq.isUndefined(weight) ? 1: weight;
        },
        destroy:function() {},
        
        weight:function() {
            return this.mWeight;
        },
        weightAbs:function(val) {
            this.mWeight = val < 0 ? 0: val;
            return this;
        },
        weightRel:function(val) {
            this.weightAbs(this.mWeight + val);
            return this;
        }
    },
    $override:
    {
        dumpProp:function() {
            this.log("\nweight:", this.weight());
            this.$super("dumpProp")();
        }
    }
});