/** @name cm.display */
cm.Class.create(
{
    $name:"cm.display.LayerInterface",
    $singleton:true,
    $define:
    /** @lends cm.display.LayerInterface.prototype */
    {
        /**
         *　レイヤーパラメータの操作インターフェースを提供します.
         * LayerInterfaceは様々なオブジェクト間でツリー構造を構築できるようにします.
         * このクラスはシングルトンクラスです.
         * @constructor
         * @param {Object} rootObject ツリーの大本となるオブジェクトです. 指定しない場合初期化時に自動生成されます.]
         * @name cm.display.LayerInterface
         * @extends cm.BaseObject
         * @property {HTMLElement} root ツリーの大本となるオブジェクトです.
         */
        LayerInterface:function(rootObject)
        {
            this.root = rootObject ? rootObject: document.createElement("div");
            this.root.cm_treeThis = 0;
            
            this.m_referenceContainer = [this.root];
            this.m_recycle = [];
        },
        destroy:function()
        {
            this.remove(this.root);
            delete this.m_referenceContainer;
            delete this.m_recycle;
        },
        /**
         * parentオブジェクトとchildオブジェクトに親子の関連を付加します.
         * @param {Object} parent 親となるオブジェクトです.
         * @param {Object} child 子となるオブジェクトです.
         * @param {Number} at 子インデックスです.
         */
        add:function(parent, child, at)
        {
            var p = parent.cm_treeThis;
            
            //append parent
            if (parent.cm_treeThis === undefined)
            {
                p = this._getNewIndex();
                this.m_referenceContainer[p] = parent;
                parent.cm_treeThis = p;
            }
                
            //append child
            if (child.cm_treeThis === undefined)
            {
                var c = this._getNewIndex();
                this.m_referenceContainer[c] = child;
                child.cm_treeThis = c;
                child.cm_treeParent = p;
                
                parent.cm_treeChildren ?
                    parent.cm_treeChildren.push(c):
                    parent.cm_treeChildren = [c];
            }
            //swap child
            else
            if (p != child.cm_treeParent)
            {
                var _oldParent = child.cm_treeParent;
                child.cm_treeParent = p;
                
                var _children = this.m_referenceContainer[_oldParent].cm_treeChildren;
                for (var i = 0, _len = _children.length; i  < _len; i ++)
                    if (_children[i] == child.cm_treeThis) _children.splice(i, 1);
                    
                var c = child.cm_treeThis;
                parent.cm_treeChildren ?
                    parent.cm_treeChildren.push(c):
                    parent.cm_treeChildren = [c];
            }
            
            if (arguments.length == 3) this.at(child, at);
        },
        /**
         * childが保持する親オブジェクトの子リストに対してchildの位置を変更します.
         * これは子オブジェクトのレイヤーに影響します.zIndexが子リストの範囲外である場合最後尾に設定されます.
         * zIndexに負の値を設定すると子リストの末尾を先頭としてchildの位置を設定します.
         * 親オブジェクトが設定されていないオブジェクトをchildとして指定すると処理されません.
         * @param {Object} child 位置変更の対象となる子オブジェクトです.
         * @param {Number} zIndex 変更したい子インデックスです.
         */
        at:function(element, zIndex)
        {
            var _index = this.getChildIndex(element);
            if (_index < 0) return;
            
            var _invert = false;
            var _children = this.m_referenceContainer[element.cm_treeParent].cm_treeChildren;
            var _len = _children.length;
            var _val = _children.splice(_index, 1);
            
            if (zIndex < 0)
            {
                _invert = true;
                zIndex *= -1;
            }
            
            0 <= zIndex && zIndex < _len ?
                _children.splice(_invert ? _len - zIndex: zIndex, 0, _val):
                _children.push(_val);
        },
        /**
         * childがparentの子であるかを指定します.
         * 検索にはparentの入った表示リスト全体が含まれます.孫、曾孫などがそれぞれtrueを返します.
         * @param {Object} parent　検索対象とする親オブジェクトです.
         * @param {Object} child 検索対象となる子オブジェクトです.
         * @return {Boolean} childがparentの子である場合trueを返します.
         */
        contains:function(parent, child)
        {
            var _callback = function() { return child !== this; }
            return Boolean(
                   child.cm_treeThis !== undefined
                && this.every(_callback, parent));
        },
        /**
         * 指定された関数についてfalseを返すアイテムに達するまで、配列内の各アイテムにテスト関数を実行します.
         * @param {Function} callback　実行関数です.
         * @param {Object} target LayerInterfaceにaddしたオブジェクトです.
         * @return {Boolean}  callbackがfalseを返すアイテムに到達した場合trueを返します.
         **/
        every:function(callback, target)
        {
            if (!callback.apply(target))
                return true;
                
            var _children = target.cm_treeChildren;
            var _ref = this.m_referenceContainer;
            if (_children)
                for (var i = 0, _len = _children.length; i < _len; i++)
                    if (this.every(callback, _ref[_children[i]]))
                        return true;
            return false;
        },
        /**
         * targetとその全子オブジェクトに対してcallback関数を実行します.
         * @param {Function} callback 実行関数です.
         * @param {Object} target LayerInterfaceにaddしたオブジェクトです.
         */
        forEach:function(callback, target)
        {
            callback.apply(target);
            var _children = target.cm_treeChildren;
            var _ref = this.m_referenceContainer;
            if (_children)
                for (var i = 0, _len = _children.length; i < _len; i++)
                    this.forEach(callback, _ref[_children[i]]);
        },
        /**
         * elementが持つ子リストで指定のインデックス位置にある子オブジェクトを返します.
         * @param {Object} element 親オブジェクトです.
         * @param {Number} index 取得する オブジェクトの子インデックスです.
         * @return {Object} インデックス位置にあるオブジェクトを返します.
         */
        getChildAt:function(element, index)
        {
            return element.cm_treeChildren && element.cm_treeChildren[index] ?
                this.m_referenceContainer[element.cm_treeChildren[index]]: null;
        },
        /**
         * elementのインデックス位置を返します.
         * 親が存在しない場合-1を返します.
         * @param {Object} element LayerInterfaceにaddしたオブジェクトです.
         * @return {Number} 特定する子オブジェクトのインデックス位置です.
         * ※引数parentは内部用
         */
        getChildIndex:function(element)
        {
            var parent = arguments[1];
            var p = parent ? parent.cm_treeThis: element.cm_treeParent;
            if (p === undefined) return -1;
            
            var _children = this.m_referenceContainer[p].cm_treeChildren;
            if (!_children) return -1;
            
            var _len = _children.length;
            for(var i = 0; i < _len; i ++)
                if (_children[i] == element.cm_treeThis)
                    return i;
                    
            return -1;
        },
        /**
         * elementが持つ子の数を返します.
         * @param {Object} element この数を取得したいオブジェクトです.
         * @return {Number} elementが持つ子の数を返します.
         */
        numChildren:function(element)
        {
            return element.cm_treeChildren ? element.cm_treeChildren.length: 0;
        },
        /**
         * elemtntに対する親子の関連を取り除きます.
         * deleteReference値はelementが持つデータ構造(孫、曾孫...)を残すかを示す値です.
         * 完全にLayerInterfaceクラスとの関連を取り除きたい場合にtrueにしてください.
         * データ構造を残し一時的にツリーから取り除く場合にfalse(または未設定)にします.
         * @param {Object} element 削除するオブジェクトです.
         * @param {Boolean} deleteReference　関連を取り除くかを示す値です.
         */
        remove:function(element, deleteReference)
        {
            if (element.cm_treeThis === undefined)
                return;
                
            var t = element.cm_treeThis;
            var p = element.cm_treeParent;
            var _children = undefined;
            
            //remove parent
            if (p !== undefined)
                _children = this.m_referenceContainer[p].cm_treeChildren;
                
            if (_children !== undefined)
            {
                for (var i = 0, _len = _children.length; i  < _len; i ++)
                    if (_children[i] == t) _children.splice(i, 1);
            }
            
            //remove children
            _children = this.m_referenceContainer[t].cm_treeChildren;
            if (_children && deleteReference)
            {
                for (var i = 0, _len = _children.length; i  < _len; i ++)
                {
                    var _child = this.m_referenceContainer[_children[i]];
                    
                    this.m_referenceContainer[_children[i]] = null;
                    this.m_recycle.push(_children[i]);
                    delete _child.cm_treeThis;
                    delete _child.cm_treeParent;
                    delete _child.cm_treeChildren;
                }
            }
            
            //remove this
            this.m_referenceContainer[t] = null;
            this.m_recycle.push(t);
            delete element.cm_treeThis;
            delete element.cm_treeParent;
            delete element.cm_treeChildren;
        },
        /**
         * parentで指定したオブジェクトの子リストの指定されたindex位置から子 オブジェクトを削除します.
         * 内部ではremoveメソッドを呼び出しています.
         * @param {Object} parent 親オブジェクトです.
         * @param {Number} index　削除する オブジェクトの子インデックスです.
         * @param {Boolean} deleteReference　関連を取り除くかを示す値です.
         */
        removeAt:function(parent, index, deleteReference)
        {
            this.remove(this.getChildAt(parent, index), deleteReference);
        },
        /**
         * 指定された 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます.
         * child1とchild2が保持する親オブジェクトが異なる場合処理されません.
         * @param {Object} child1 子オブジェクト1です.
         * @param {Object} child2 子オブジェクト2です.
         */
        swapChildren:function(child1, child2)
        {
            var p1 = child1.cm_treeParent;
            var p2 = child2.cm_treeParent;
            
            if (p1 === undefined || p2 === undefined || p1 != p2)
                return;
                
            this.swapChildrenAt(
                this.m_referenceContainer[p1],
                 this.getChildIndex(child1),
                 this.getChildIndex(child2));
        },
        /**
         * 子リスト内の指定されたインデックス位置に該当する 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます.
         * index1、またはindex2が子リストの範囲外であった場合処理はされません.
         * @param {Object} parent　親オブジェクトです.
         * @param {Number} index1 最初の子オブジェクトのインデックス位置です.
         * @param {Number} index2 2 番目の子オブジェクトのインデックス位置です.
         */
        swapChildrenAt:function(parent, index1, index2)
        {
            var p = parent.cm_treeThis;
            if (p === undefined)
                return;
                
            var _children = this.m_referenceContainer[p].cm_treeChildren;
            if (!_children)
                return;
                
            var _len = _children.length;
            if (!(0 <= index1 && index1 < _len)
            ||  !(0 <= index2 && index2 < _len))
                return;
                
            var _temp = _children[index1];
            _children[index1] = _children[index2];
            _children[index2] = _temp;
        },
        /**#@+ @private */
        //property
        m_referenceContainer:null,
        m_recycle:null,
        //method
        //新たに要素が追加された場合 m_referenceContainer配列内のどのインデックスに追加するのか示す値を返す.
        _getNewIndex:function()
        {
            return this.m_recycle.length > 0 ?
                this.m_recycle.shift():
                this.m_referenceContainer.length;
        }
        /**#@-*/
    }
});