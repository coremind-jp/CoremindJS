cls.exports(
{
    $name:"cm.util.EmmetParser",
    $singleton:true,
    $define:
    {
        EmmetParser:function()
        {
            cm.emmet = this;

            this.defaultCacheValue = false;
            this.mCache = {};
            this.mRegExp = {
                extract:{
                    context:/\{(.+?[^\\])\}/gm,
                    grouping:/\(([^\()]+?[^\\])\)/gm,
                    attribute:/\[(.+?[^\\])\]/gm,
                },
                prefix:{
                    context:/!context(\d+)/igm,
                    grouping:/!grouping(\d+)/igm,
                    attribute:/!attribute(\d+)/igm
                },
                hierarchy:/[>\+^](?=[^>\+]+)/gm,
                element:/([^#\.\*]+)|(#|\.)([^#\.\*]+)/gm,
                multiple:/\*(\d+)$/,
                attribute:/(?:^|[\s"'])([\w\-\.%\$@]+?)(?=[=\s]|$)|=("|')(.+?[^\\])(?=\2)|=(.+?)(?=\s|$)/gm,
                dollerNumbering:/(?:^|[^\\])(\$+)(?:@(\-?\d+|\-))?/gm,
            };
        },
        destroy:function(){},
        parse:function(q, requireURidecode, isCache)
        {
            this.temp = { container:{ context:[], grouping:[], attribute:[] }};

            q = this._extract(q, "context", "}");
            q = this._extract(q, "attribute", "]");
            q = this._extract(q, "grouping", ")");

            var _result = (eq.isBoolean(isCache) ?
                isCache:
                this.defaultCacheValue) ?
                    this.mCache[q] = this._parseHierarchyBlock(q):
                    this._parseHierarchyBlock(q);

            var _grp = _result.grouping = this.temp.container.grouping;
            for (var i = 0, len = _grp.length; i < len; i++)
                _grp[i] = this._parseHierarchyBlock(_grp[i]);

            delete this.temp;
            ex.object.dump(_result, "", 20);
            return _result;
        },
        _extract:function(q, extractType, escapeStr)
        {
            var _container = this.temp.container[extractType];

            do {
                q = q.replace(this.mRegExp.extract[extractType], function()
                {
                    _prefix = "!"+extractType+_container.length;
                    _container.push(arguments[1].replace("\\" + escapeStr, escapeStr));
                    return _prefix;
                });
            } while (this.mRegExp.extract[extractType].test(q));

            return q;
        },
        _parseHierarchyBlock:function(q)
        {
            var _result = { children:[] };
            _result.parent = _result;

            this.temp.hierarchy = {
                prevArg: ["!", -1, q],
                root:_result,
                current:null
            };
            q.replace(this.mRegExp.hierarchy, this.$bind("_hierarchyMatcher"));
            this._hierarchyMatcher("", q.length, q);
            delete this.temp.hierarchy;

            return _result;
        },
        _hierarchyMatcher:function()
        {
            var _parent;
            var _temp = this.temp.hierarchy;
            var _prevArg = _temp.prevArg;
            var q = _prevArg[2];
            var p = _prevArg[0];
            var val = q.substring(_prevArg[1]+1, arguments[1]);

            switch (p)
            {
                case "!": _parent = _temp.root; break;
                case ">": _parent = _temp.current; break;
                case "+": _parent = _temp.current.parent; break;
                case "^":
                    arguments[0] === "^" ?
                        _temp.current = _temp.current.parent.parent:
                        _parent = _temp.current = _temp.current.parent.parent;
                        break;
                default: arguments[1] += 1;
            }
            if (_parent)
                this._updateHierarchy(_parent, val);

            _temp.prevArg = arguments;
        },
        _updateHierarchy:function(parent, val)
        {
            var _children = parent.children ? parent.children: parent.children = [];
            var _parsedObject = this._parseElementBlock(val);

            _children.push(_parsedObject);

            _parsedObject.parent = parent;
            this.temp.hierarchy.current = _parsedObject;
        },
        _parseElementBlock:function(q)
        {
            var _result = { tag:{ value:"", replace:[] }, attr:[] };

            this.temp.element = { result:_result, attrNameCache:null };

            q.replace(this.mRegExp.multiple, this.$bind("_parseMultiple"))
             .replace(this.mRegExp.prefix.grouping, this.$bind("_parseGrouping"))
             .replace(this.mRegExp.prefix.attribute, this.$bind("_parseAttribute"))
             .replace(this.mRegExp.prefix.context, this.$bind("_parseContext"))
             .replace(this.mRegExp.element, this.$bind("_elementMatcher"));

            delete this.temp.element;

            return _result;
        },
        _parseGrouping:function()
        {
            if (arguments[1])
                this.temp.element.result.grouping = arguments[1];
            return "";
        },
        _parseMultiple:function()
        {
            if (arguments[1])
                this.temp.element.result.multi = parseInt(arguments[1]);
            return "";
        },
        _parseAttribute:function()
        {
            if (arguments[1])
            {
                var _extractData = this.temp.container.attribute[arguments[1]];
                _extractData.replace(this.mRegExp.attribute, this.$bind("_attributeMatcher"));
                this._attributeMatcher();
            }
            return "";
        },
        _attributeMatcher:function(s, attrName, _, attrValueP1, attrValueP2)
        {
            var _temp = this.temp.element;

            if (arguments.length == 0 && !eq.isNull(_temp.attrNameCache))
                this._setAttribute();
            else
            if (attrName)
            {
                if (!eq.isNull(_temp.attrNameCache))
                    this._setAttribute();
                _temp.attrNameCache = attrName;
            }
            else
            if (attrValueP1)
                this._setAttribute(attrValueP1.replace(/\\('|")/, "$1"));
            else
            if (attrValueP2)
                this._setAttribute(attrValueP2);
        },
        _parseContext:function()
        {
            if (arguments[1])
                this.temp.element.result.context =
                    this._createValueDef(this.temp.container.context[arguments[1]]);
            return "";
        },
        _elementMatcher:function(s, tag, idOrClass, value)
        {
            if (tag)
                this.temp.element.result.tag = this._createValueDef(tag);
            else
            if (idOrClass && value)
                this._setAttribute(value, idOrClass === "#" ? "id": "class");
        },
        _setAttribute:function(val, name)
        {
            var a = this.temp.element;
            a.result.attr.push({
                    key:this._createValueDef(name ? name: a.attrNameCache),
                    val:this._createValueDef(val && val.length > 0 ? val: "")
                });
            a.attrNameCache = null;
        },
        _createValueDef:function(val)
        {
            var _result = { value:val, replace:[] };

            if (val.length == 0 || val.indexOf("$") == -1)
                return _result;

            var _temp = this.temp.element;
            var _count = 0;
            val.replace(
                this.mRegExp.dollerNumbering,
                function(s, dollar, from)
                {
                    var _from = from ? from == "-" ? -1: parseInt(from): 1;

                    _result.value = _result.value
                        .replace(dollar, "!dollar"+(_count++))
                        .replace("@"+from, "");

                    _result.replace.push(
                        _from < 0 ? {
                            pad:dollar.length,
                            index:-_from,
                            i:-1
                        } : {
                            pad:dollar.length,
                            index:_from,
                            i:1
                        });
                });
            return _result;
        }
    }
});