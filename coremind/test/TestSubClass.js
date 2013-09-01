cls.exports(
{
    $name:"cm.test.TestSubClass",
    $static:
    {
        testStaticProp:"test",
        evalProp:"$eval:Number(5 + 10 - 11)"//4
    },
    $define:
    {
        TestSubClass:function(argTest0, argTest1, argTest2) {
            var _refCount = _currentRefCount = this.getRefCount();
            // cm.assert("スーパークラスのコンストラクターが呼ばれる前はカウンターは変化していない",
                // function(){return _refCount;}, _currentRefCount);

            //スーパークラスのメソッドコールチェック
            this.$super("")(argTest0, argTest1, argTest2);

            _refCount = this.getRefCount();
            // cm.assert("スーパークラスのコンストラクターが呼ばれた後はカウンターがインクリメントされる",
                // function(){return _refCount;}, _currentRefCount+1);
        },
        destroy:function()
        {
            var _refCount = _currentRefCount = this.getRefCount();
            // cm.assert("スーパークラスのデストラクターが呼ばれる前はカウンターは変化していない",
                // function(){return _refCount;}, _currentRefCount);

            this.$super("destroy")();

            _refCount = this.getRefCount();
            // cm.assert("スーパークラスのデストラクターが呼ばれた後はカウンターがデクリメントされる",
                // function(){return _refCount;}, _currentRefCount-1);
        }
    }
});