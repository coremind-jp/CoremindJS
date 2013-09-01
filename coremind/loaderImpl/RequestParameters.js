cls.exports(
    "cm.core.DomInterface",
{
    /** @name compass.loader */
    $name:"cm.loaderImpl.RequestParameters",
    $define:
    /** @lends compass.amazonApi.ApiClient.prototype */
    {
        RequestParameters:function(url, params, isJsonp)
        {
            this.mIsJsonp = Boolean(isJsonp);
            this.mUrl = cm.dom.util.toAbsolutePath(url);
            this.mPropsName = [];
            this.attachParams(params);
        },

        destroy:function() {},
        
        attachParams:function(params)
        {
            this.mPropsName.length = 0;
            for (var p in params)
            {
                this[p] = params[p];
                this.mPropsName.push(p);
            }
            this.mId = this._createId();
        },

        equalParams:function(params)
        {
            var _paramsNum = 0;

            for (var p in params)
            {
                if (this[p] != params[p])
                    return false;
                _paramsNum++;
            }

            return this.mPropsName.length == _paramsNum;
        },

        id:function() { return this.mId; },
        url:function() { return this.mUrl; },
        isJsonp:function() { return this.mIsJsonp; },

        _createId:function() {
            return this.mUrl + this.createGetQuery();
        },

        createGetQuery:function()
        {
            var _result = "";
            
            for (var i = this.mPropsName.length - 1; i >= 0; i--)
                _result += ex.string.concat(
                    _result == "" ? "": "&",
                    this.mPropsName[i], "=", encodeURI(this[this.mPropsName[i]]));

            return _result;
        },
        createPostQuery:function()
        {
            var _result = {};
            
            for (var i = this.mPropsName.length - 1; i >= 0; i--)
                _result[this.mPropsName[i]] = this[this.mPropsName[i]];

            return _result;
        }
    }
});
