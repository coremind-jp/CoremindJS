cls.require("cm.event.EventDispatcher", function(){
describe('EventDispatcher', function()
{
    var instance;
    var type = {
        a:"TEST_EVENT_A",
        b:"TEST_EVENT_B",
        c:"TEST_EVENT_C"
    };
    var listener = {
        order:[],
        a:function(){
            this.order.push("a");
        },
        b:function(){
            this.order.push("b");
        },
        c:function(){
            this.order.push("c");
        }
    };

    beforeEach(function(){
        ed = new cm.event.EventDispatcher();
        spyOn(listener, "a");
        spyOn(listener, "b");
        spyOn(listener, "c");
    });

    describe('getListenerCountメソッド', function() {
        it("初期値は0", function(){
            expect(ed.getListenerCount()).toBe(0);
        });

        it("リスナー登録時にインクリメントされる", function() {
            ed.addEventListener(type.a, listener.a);
            expect(ed.getListenerCount()).toBe(1);
        });

        it("リスナー削除時にデクリメントされる", function() {
            ed.addEventListener(type.a, listener.a);
            ed.removeEventListener(type.a, listener.a);
            expect(ed.getListenerCount()).toBe(0);
        });
    });

    describe('hasEventListenerメソッド', function() {
        it("リスナーが存在する場合trueを返す", function(){
            ed.addEventListener(type.a, listener.a);
            expect(ed.hasEventListener(type.a, listener.a)).toBe(true);
        });

        it("リスナーが存在しない場合falseを返す", function(){
            expect(ed.hasEventListener(type.a, listener.a)).toBe(false);
        });

        it("関数のみで問い合わせることができる", function(){
            ed.addEventListener(type.a, listener.a);
            expect(ed.hasEventListener(null, listener.a)).toBe(true);
        });

        it("イベントタイプのみで問い合わせることができる", function(){
            ed.addEventListener(type.a, listener.a);
            expect(ed.hasEventListener(type.a)).toBe(true);
        });
    });

    describe('addEventListenerメソッド', function() {
        it("関数とイベントタイプを指定することでリスナーを登録できる", function(){
            ed.addEventListener(type.a, listener.a);

            expect(ed.getListenerCount()).toBe(1);
            expect(ed.hasEventListener(type.a, listener.a)).toBe(true);
            expect(ed.hasEventListener(null, listener.a)).toBe(true);
            expect(ed.hasEventListener(type.a)).toBe(true);
        });

        it("一つのイベントタイプに複数の関数をリスナーとして登録できる", function(){
            ed.addEventListener(type.a, listener.a);
            ed.addEventListener(type.a, listener.b);

            expect(ed.getListenerCount()).toBe(2);
            expect(ed.hasEventListener(type.a, listener.a)).toBe(true);
            expect(ed.hasEventListener(type.a, listener.b)).toBe(true);
            expect(ed.hasEventListener(null, listener.a)).toBe(true);
            expect(ed.hasEventListener(null, listener.b)).toBe(true);
            expect(ed.hasEventListener(type.a)).toBe(true);
        });

        it("異なるイベントタイプであれば同一関数でもリスナーとして登録できる", function(){
            ed.addEventListener(type.a, listener.a);
            ed.addEventListener(type.b, listener.a);

            expect(ed.getListenerCount()).toBe(2);
            expect(ed.hasEventListener(type.a, listener.a)).toBe(true);
            expect(ed.hasEventListener(type.b, listener.a)).toBe(true);
            expect(ed.hasEventListener(null, listener.a)).toBe(true);
            expect(ed.hasEventListener(type.a)).toBe(true);
            expect(ed.hasEventListener(type.b)).toBe(true);
        });

        it("イベントタイプ, 関数が同一の場合新規リスナーとして扱わない", function(){
            ed.addEventListener(type.a, listener.a);
            ed.addEventListener(type.a, listener.a);
            expect(ed.getListenerCount()).toBe(1);
        });

        it("プライオリティーを指定できる", function(){
            ed.addEventListener(type.a, listener.a, 10);
            ed.addEventListener(type.a, listener.b, 5);
            ed.addEventListener(type.a, listener.c, 100);

            var _listeners = ed.mListeners;
            var _stream = ed.mEntity[type.a].stream;
            expect(_listeners[_stream[0]]).toBe(listener.c);
            expect(_listeners[_stream[1]]).toBe(listener.a);
            expect(_listeners[_stream[2]]).toBe(listener.b);
            expect(ed.getListenerCount()).toBe(3);
        });
    });

    describe('removeEventListenerメソッド', function() {
        it("関数とイベントタイプを指定することで特定のリスナーを削除できる", function(){
            ed.addEventListener(type.a, listener.a);
            ed.removeEventListener(type.a, listener.a);

            expect(ed.getListenerCount()).toBe(0);
            expect(ed.hasEventListener(type.a, listener.a)).toBe(false);
            expect(ed.hasEventListener(null, listener.a)).toBe(false);
            expect(ed.hasEventListener(type.a)).toBe(false);
        });

        it("リスナーが存在しない場合何も起きない", function(){
            ed.removeEventListener(type.a, listener.a);

            expect(ed.getListenerCount()).toBe(0);
            expect(ed.hasEventListener(type.a, listener.a)).toBe(false);
            expect(ed.hasEventListener(null, listener.a)).toBe(false);
            expect(ed.hasEventListener(type.a)).toBe(false);
        });

        it("関数のみ指定した場合、その関数を利用している全てのリスナーを削除できる", function(){
            ed.addEventListener(type.a, listener.a);
            ed.addEventListener(type.b, listener.a);
            ed.addEventListener(type.c, listener.a);
            ed.removeEventListener(null, listener.a);

            expect(ed.getListenerCount()).toBe(0);
            expect(ed.hasEventListener(type.a, listener.a)).toBe(false);
            expect(ed.hasEventListener(type.b, listener.a)).toBe(false);
            expect(ed.hasEventListener(type.c, listener.a)).toBe(false);
            expect(ed.hasEventListener(type.a)).toBe(false);
            expect(ed.hasEventListener(type.b)).toBe(false);
            expect(ed.hasEventListener(type.c)).toBe(false);
            expect(ed.hasEventListener(null, listener.a)).toBe(false);
        });

        it("イベントタイプのみ指定した場合、そのイベントタイプに対して登録した全てのリスナーを削除できる", function(){
            ed.addEventListener(type.a, listener.a);
            ed.addEventListener(type.a, listener.b);
            ed.addEventListener(type.a, listener.c);
            ed.removeEventListener(type.a);

            expect(ed.getListenerCount()).toBe(0);
            expect(ed.hasEventListener(type.a, listener.a)).toBe(false);
            expect(ed.hasEventListener(type.a, listener.b)).toBe(false);
            expect(ed.hasEventListener(type.a, listener.c)).toBe(false);
            expect(ed.hasEventListener(null, listener.a)).toBe(false);
            expect(ed.hasEventListener(null, listener.b)).toBe(false);
            expect(ed.hasEventListener(null, listener.c)).toBe(false);
            expect(ed.hasEventListener(type.a)).toBe(false);
        });
    });

    describe('dispatchEventメソッド', function() {
        it("イベントタイプを指定する事で着火できる", function(){
            ed.addEventListener(type.a, listener.a);
            ed.dispatchEvent(type.a);

            expect(listener.a).toHaveBeenCalled();
        });

        it("リスナーが存在しない場合何もしない", function(){
            ed.dispatchEvent(type.a);
            expect(listener.a).not.toHaveBeenCalled();
        });

        it("リスナーにプライオリティーが指定されていない場合、登録順に呼び出される", function(){
            ed.addEventListener(type.a, listener.a);
            ed.addEventListener(type.a, listener.b);
            ed.addEventListener(type.a, listener.c);
            ed.dispatchEvent(type.a);

            var _listeners = ed.mListeners;
            var _stream = ed.mEntity[type.a].stream;
            expect(_listeners[_stream[0]]).toBe(listener.a);
            expect(_listeners[_stream[1]]).toBe(listener.b);
            expect(_listeners[_stream[2]]).toBe(listener.c);
            expect(ed.getListenerCount()).toBe(3);
        });

        it("リスナーにプライオリティーが指定されている場合、プライオリティーに従って呼び出される", function(){
            ed.addEventListener(type.a, listener.a, 10);
            ed.addEventListener(type.a, listener.b, 5);
            ed.addEventListener(type.a, listener.c, 100);
            ed.dispatchEvent(type.a);

            var _listeners = ed.mListeners;
            var _stream = ed.mEntity[type.a].stream;
            expect(_listeners[_stream[0]]).toBe(listener.c);
            expect(_listeners[_stream[1]]).toBe(listener.a);
            expect(_listeners[_stream[2]]).toBe(listener.b);
            expect(ed.getListenerCount()).toBe(3);
        });


        it("リスナーとして登録された関数の第一引数にはcm.event.Eventオブジェクトが渡される", function(){
            ed.addEventListener(type.a, listener.a);
            ed.dispatchEvent(type.a);

            expect(listener.a.mostRecentCall.args[0]).toEqual(new cm.event.Event(ed, type.a));
        });

        it("任意の値を付与して着火できる", function(){
            ed.addEventListener(type.a, listener.a);
            ed.dispatchEvent(type.a, "foo", "bar");

            expect(listener.a).toHaveBeenCalledWith(new cm.event.Event(ed, type.a), "foo", "bar");
        });
    });

});
});
