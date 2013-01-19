cm.Class.create(
    "cm.core.BrowserInterface",
{
    /** @name cm.domImpl */
    $name:"cm.webComponent.ElementAnalyzer",
    $singleton:true,
    $static:{
        propertys:{
            domByHtml:{
                htmlElementObject:[
                    "accessKey",
                    "className",
                    "clientHeight",
                    "clientWidth",
                    "dir",
                    "id",
                    "innerHTML",
                    "lang",
                    "offsetHeight",
                    "offsetLeft",
                    "offsetParent",
                    "offsetTop",
                    "offsetWidth",
                    "scrollHeight",
                    "scrollLeft",
                    "scrollTop",
                    "scrollWidth",
                    "style",
                    "tabIndex",
                    "title"
                ],
                documentObject:[
                    "anchors",
                    "applets",
                    "body",
                    "cookie",
                    "documentMode",
                    "domain",
                    "forms",
                    "images",
                    "lastModified",
                    "links",
                    "readyState",
                    "referrer",
                    "title",
                    "URL"
                ]
            }
        }
        
    },
    $define:
    /** @lends cm.domImpl.ElementAnalyzer.prototype */
    {
        ElementAnalyzer:function()
        {
            this.mRoot = cm.dom.d.createElement("table");
            cm.dom.d.body.appendChild(this.mRoot);
        },
        destroy:function() {},
        
        dumpAsHtmlElementObject:function(element)
        {
            var _props = this.$class.propertys.domByHtml.htmlElementObject;
            for (var i = 0, len = _props.length; i < len; i++)
            {
                var _valueTd = cm.dom.d.getElementById(_props[i]);
                this.log(_props[i], element[_props[i]]);
                if (cm.equal.isNull(_valueTd))
                {
                    var _tr = cm.dom.d.createElement("tr");
                    var _titleTd = cm.dom.d.createElement("td");
                    _valueTd = _titleTd.cloneNode();
                    _titleTd.innerHTML = _valueTd.id = _props[i];
                    _tr.appendChild(_titleTd);
                    _tr.appendChild(_valueTd);
                    this.mRoot.appendChild(_tr);
                }
                _valueTd.innerHTML = element[_props[i]];
            }
        },
        dumpHtmlElementPropertys:function()
        {
            
            var _selector = this._getSelectElement("window");
            for (var p in cm.dom.d)
            {
                var _newOption = cm.dom.d.createElement("option");
                _newOption.text ?
                    _newOption.text = p:
                    _newOption.innerText = p;
                _selector.appendChild(_newOption);
                _selector.id = "windowID";
            }
        },
        dumpDocument:function()
        {
            var _selector = this._getSelectElement("document");
            for (var p in cm.dom.w)
            {
                var _newOption = cm.dom.d.createElement("option");
                _newOption.text ?
                    _newOption.text = p:
                    _newOption.innerText = p;
                _selector.appendChild(_newOption);
                _selector.id = "documentID";
            }
        },
        dumpStyle:function(element)
        {
            var _selector = this._getSelectElement("style");
            for (var p in element.style)
            {
                var _newOption = cm.dom.d.createElement("option");
                _newOption.text ?
                    _newOption.text = p:
                    _newOption.innerText = p;
                _selector.appendChild(_newOption);
                _selector.id = "styleID";
            }
        },
        _getSelectElement:function(name)
        {
            var body = cm.dom.d.getElementsByTagName("body")[0];
            if (!body.form || !body.form[name])
            {
                var form = cm.dom.d.createElement("form");
                var selector = cm.dom.d.createElement("select");
                var newOption = cm.dom.d.createElement("option");
                newOption.text ? newOption.text = name: newOption.innerText = name;
                selector.appendChild(newOption);
                selector.name = "selector";
                selector.size = 30;
                selector.style.float = "left";
                form.appendChild(selector);
                form.name = name;
                body.appendChild(form);
                return selector;
            }
            else
                return body.form[name];
        }
    }
});