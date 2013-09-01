cls.exports(
    "cm.util.EmmetParser",
{
    /** @name cm.dom */
    $name:"cm.domImpl.util.AbsDomUtil",
    $define:
    /** @lends cm.domImpl.AbsDomImpl.prototype */
    {
        AbsDomUtil:function()
        {
            this.mElementCache = {};
            this.mPathConverter = this.createElement("p");
            this.mEmmetAbbreviations = {bq:"blockquote",acr:"acronym",fig:"figure",figc:"figcaption",ifr:"iframe",emb:"embed",obj:"object",src:"source",cap:"caption",colg:"colgroup",fst:"fieldset",btn:"button",optg:"optgroup",opt:"option",tarea:"textarea",leg:"legend",sect:"section",art:"article",hdr:"header",ftr:"footer",adr:"address",dlg:"dialog",str:"strong",prog:"progress",fset:"fieldset",datag:"datagrid",datal:"datalist",kg:"keygen",out:"output",det:"details",cmd:"command"};
        },
        destroy:function() {},
        
        toAbsolutePath:function(url)
        {
            this.mPathConverter.innerHTML = ex.string.concat('<a href="', url, '" />');
            return this.mPathConverter.firstChild.href;
        },
        createElement:function(tag)
        {
            if (eq.isUndefined(this.mElementCache[tag]))
                this.mElementCache[tag] = cm.dom.d.createElement(tag);
            return this.mElementCache[tag].cloneNode();
        },
        create:function(q)
        {
            var a = cm.dom.d.createElement("div");
            var _root = cm.util.EmmetParser.parse(q);
            for (var i = 0, len = _root.children.length; i < len; i++)
                this._append(_root, _root.children[i], a);
            cm.dom.d.body.appendChild(a);
        },
        _append:function(root, current, parent, multiCurrent, multiTotal)
        {
            var _duplicateNum = current.multi ? current.multi: 1;
            var _total = current.multi ? current.multi: multiTotal ? multiTotal: 0;

            for (var i = 0; i < _duplicateNum; i++)
            {
                var _current = current.multi ? i: multiCurrent ? multiCurrent: 0;
                var _hasTag = current.tag.value != "";

                if (!_hasTag && current.context)
                {
                    parent.appendChild(
                        cm.dom.d.createTextNode(
                            this._replace$(current.context, _current, _total)));
                    continue;
                }
                else
                if (!_hasTag && current.grouping)
                {
                    var _grouping = root.grouping[current.grouping];
                    for (var j = 0; j < _grouping.children.length; j++)
                        this._append(root, _grouping.children[j], parent, _current, _total);
                    continue;
                }

                var _element = this.createElement(
                    _hasTag ?
                        this._replace$(current.tag, _current, _total):
                        this._autoSelectTag(parent.tagName));

                if (parent)
                    parent.appendChild(_element);

                for (var k = 0; k < current.attr.length; k++)
                {
                    var _attrName = this._replace$(current.attr[k].key, _current, _total);
                    var _attrVal  = this._replace$(current.attr[k].val, _current, _total);
                    if (_attrName.toLowerCase() == "class")
                    {
                        var _beforeVal = _element.getAttribute("class");
                        _attrVal  = _beforeVal ? _beforeVal+" "+_attrVal: _attrVal;
                    }
                    _element.setAttribute(_attrName, _attrVal);
                }

                if (current.context)
                    _element.appendChild(
                        cm.dom.d.createTextNode(
                            this._replace$(current.context, _current, _total)));

                if (current.children)
                    for (var j = 0; j < current.children.length; j++)
                        this._append(root, current.children[j], _element, _current, _total);
            }
        },
        _autoSelectTag:function(parentTag)
        {
            switch (parentTag)
            {
                case "EM":    return "span";
                case "TABLE": return "tr";
                case "TR":    return "td";
                case "UL":
                case "OL":
                    return "li";
                default : return "div";
            }
        },
        _replace$:function(valueDef, current, total)
        {
            var _result = this._replaceAbbreviations(valueDef.value);

            for (var i = 0, len = valueDef.replace.length; i < len; i++)
                _result = _result.replace("!dollar"+i,
                    this._calcPaddingNumber(valueDef.replace[i], current, total));

            return _result;
        },
        _replaceAbbreviations:function(val)
        {
            return (val in this.mEmmetAbbreviations) ?
                this.mEmmetAbbreviations[val]: val;
        },
        _calcPaddingNumber:function(replaceDef, current, total)
        {
            var _num = replaceDef.i < 0 ?
                replaceDef.index + (replaceDef.i * current) + (total-1):
                replaceDef.index + (replaceDef.i * current);

            return replaceDef.pad <= _num.toString().length ?
                    _num:
                    ("0000000000"+_num).slice(-replaceDef.pad);
        },

        isHtmlDomElement:function(object) {
            return !eq.isUndefined(object.nodeType)
                &&  object.nodeType == 1;
        },
        pushClassName:function(element, className)
        {
            var _classNameArray = element.className.split(" ");
            if (_classNameArray.indexOf(className) < 0)
            {
                _classNameArray[_classNameArray.length] = "." + className;
                element.className = _classNameArray.join(" ");
            }
        }
    }
});