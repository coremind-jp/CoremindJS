cm.Class.create(
{
    $name:"cm.core.TestSubClass",
    $static:
    {
        testStaticProp:"test",
        evalProp:"$eval:Number(5 + 10 - 11)"//4
    },
    $define:
    {
        TestSubClass:function(argTest0, argTest1, argTest2) {
            this.log("TEST[called initialize and super class constructor cancel]");
            this.log("TEST[dump arguments]");
            this.log(argTest0, argTest1, argTest2);
            this.log("TEST[dump RefCount(before)]");
            this.log(this.getRefCount());
            this.log("TEST[invoke super class constructor]");
            this.$super("initialize")(argTest0, argTest1, argTest2);
            this.log("TEST[dump RefCount(after)]");
            this.log(this.getRefCount());
        },
        destroy:function()
        {
            this.log("TEST[called destroy]");
            this.log("TEST[dump RefCount(before)]");
            this.log(this.getRefCount());
            this.log("TEST[invoke super class destroy]");
            this.$super("destroy")();
            this.log("TEST[dump RefCount(after)]");
            this.log(this.getRefCount());
        }
    }
});