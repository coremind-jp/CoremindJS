cls.exports(
{
    $singleton:true,
    $name:"cm.util.sequence.que.QueContainer",
    $define:
    {
        QueContainer:function()
        {
            this.mRecycle = [];
            this.mContainer = [];
        },
        destroy:function() {},
        enqueue:function(queObject)
        {
            var _index = this._getNewIndex();
            queObject._setContainerIndex(_index);
            this.mContainer[_index] = queObject;
        },
        dequeue:function(queObject)
        {
            var _index = queObject._getContainerIndex();
            this.mRecycle[this.mRecycle.length] = _index;
            this.mContainer[_index] = undefined;
        },
        get:function(index) {
            return this.mContainer[index];
        },
        _getNewIndex:function()
        {
            return this.mRecycle.length > 0 ?
                this.mRecycle.shift():
                this.mContainer.length;
        }
    }
});