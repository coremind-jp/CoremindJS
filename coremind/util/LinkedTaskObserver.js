cm.Class.create(
{
    $name:"cm.util.LinkedTaskObserver",
    $define:
    {
        LinkedTaskObserver:function() {
        },
        destroy:function() {
            this.mLinkedTask = null;
        },
        set:function(linkedTask) {
            this.mLinkedTask = linkedTask;
        },
        reset:function() {
            this.mLinkedTask = null;
        },
        notify:function() {
            if (this.mLinkedTask) this.mLinkedTask.invokeNextTask();
        },
        reverse:function(val) {
            if (this.mLinkedTask) this.mLinkedTask.enabledReverse(val);
        }
    }
});