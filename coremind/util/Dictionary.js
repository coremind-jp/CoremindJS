cls.exports(
{
    /** @name cm.data */
    $name:"cm.util.Dictionary",
    $define:
    /** @lends cm.util.Dictionary.prototype */
    {
        /**
         * DictionaryクラスはObjectの参照をキーとしたリテラルです.
         * @constructor
         * @name cm.util.Dictionary
         * @extends cm.BaseObject
         */
        Dictionary:function() {},
        /**
         * このクラスは大量に生成される可能性がある為初期化時に不用意にオブジェクト生成しない様にメソッド呼び出し直後までメンバーの初期化を行わないように実装している。
         * 各パブリックメソッドが呼ばれた時に初期化を行いその後、初期化を含まないメソッドに差し替えている。
         */
        _runtimeInitialize:function()
        {
            this.m_value = [];
            this.m_key   = [];
            this.m_empty = [];
            
            //override method
            this.get = this._get;
            this.set = this._set;
            this.del = this._del;
        },
        destroy:function() {
            this.m_value = this.m_key = null;
        },
        /**
         * 引数keyに紐付く値を取得します.
         * データが存在しない場合undefinedを返します.
         * @param {Object} key キーとなるオブジェクトまたはプリミティブデータ型
         */
        get:function(key)
        {
            this._runtimeInitialize();
            this.get(key);
        },
        _get:function(key) { return this.m_value[this._getValIndex(key)]; },
        /**
         * 引数keyをキーとして引数valを格納します.
         * @param {Object} key キーとなるオブジェクトまたはプリミティブデータ型
         * @param {Object} val 格納する値
         */
        set:function(key, val)
        {
            this._runtimeInitialize();
            this.set(key, val);
        },
        _set:function(key, val)
        {
            var _valIndex = this._getValIndex(key);
            var _index = _valIndex > -1 ? _valIndex: this._getNewIndex();
            this.m_key[_index]   = key;
            this.m_value[_index] = val;
        },
        forEach:function()
        {
            var _impl = Array.prototype.shift.call(arguments);
            for (var i=0, _len = this.m_key.length; i < _len; i++)
                if (!eq.isUndefined(this.m_key[i]))
                    _impl(this.m_key[i], this.m_value[i], arguments);
        },
        /**
         * 引数keyをキーに格納されている値への参照を破棄します.
         * @param {Object} key キーとなるオブジェクトまたはプリミティブデータ型
         */
        del:function(key)
        {
            this._runtimeInitialize();
            this.del(key);
        },
        _del:function(key)
        {
            var _emptyIndex = this._getValIndex(key);
            if (_emptyIndex > -1)
            {
                this.m_key[_emptyIndex] = this.m_value[_emptyIndex] = undefined;
                this.m_empty.push(_emptyIndex);
            }
        },
        /**#@+ @private */
        /**#@+ @memberOf cm.util.Dictionary# */
        //property
        /**
         * 値を格納する配列
         * @name m_value
         * @type Array
         */
        m_value:null,
        /**
         * キーを格納する配列
         * @name m_key
         * @type Array
         */
        m_key:null,
        /**
         * 再利用するインデックスを格納する配列
         * @name m_empty
         * @type Array
         */
        m_empty:null,
        /**
         * 引数keyと紐付くm_keyのインデックスを取得します.
         * @param {Object} key m_key内に格納されている引数keyの位置
         */
        _getValIndex:function(key)
        {
            for (var i=0, _len = this.m_key.length; i < _len; i++)
                if (this.m_key[i] === key)
                    return i;
            return -1;
        },
        /**#@-*/
        //method
        /**
         * 新たに要素が追加された場合 m_referenceContainer配列内のどのインデックスに追加するのか示す値を返します.
         * @return {Number} 追加先のindex値
         */
        _getNewIndex:function()
        {
            return this.m_empty.length > 0 ? this.m_empty.shift(): this.m_value.length;
        }
        /**#@-*/
    }
});