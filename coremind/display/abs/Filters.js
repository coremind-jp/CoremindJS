cls.exports(
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.Filters",
    $define:
    /** @lends cm.display.abs.Filters.prototype */
    {
        /**
         * @constructor
         * @name cm.display.abs.Filters
         * @extends cm.BaseObject
         */
        Filters:function() {},
        destroy:function() {
            if (!eq.isUndefined(this.mFilters))
                this.mFilters.length = 0;
            if (!eq.isUndefined(this.mRemoved))
                this.mRemoved.length = 0;
        },
        
        editFilter:function(index)
        {
            if (eq.isUndefined(this.mFilters)) this.mFilters = [];
            return this.mFilters[index];
        },
        indexOf:function(filter)
        {
            if (eq.isUndefined(this.mFilters)) this.mFilters = [];
            return this.mFilters.indexOf(filter);
        },
        
        add:function(filter)
        {
            if (eq.isUndefined(this.mFilters))
                this.mFilters = [];
            
            var _order = 0;
            var _filterClass = cls.get(filter.getClassFullName());
            for(var i = 0, len = this.mFilters.length; i < len; i++)
                if (_filterClass.equal(this.mFilters[i]))
                    _order++;
                    
            filter.order = _order;
            this.mFilters.push(filter);
            return this;
        },
        remove:function(filter)
        {
            var i = this.indexOf(filter);
            if (i < -1) return;
            
            if (eq.isUndefined(this.mRemoved))
                this.mRemoved = [];
            this.mRemoved.push(this.mFilters[i]);
            this.mFilters.splice(i, 1);
            
            var _filterClass = cls.get(filter.getClassFullName());
            for(i = 0, len = this.mFilters.length; i < len; i++)
                if (_filterClass.equal(this.mFilters[i])
                && this.mFilters[i].order > filter.order)
                   this.mFilters[i].order--;
                   
            return this;
        },
        
        //internal
        _get:function() {
            return this.mFilters;
        },
        _removedFilters:function() {
            return this.mRemoved;
        },
        
        /**
         * 文字列表現を取得します.
         */
        dumpProp:function()
        {
            for(i = 0, len = this.mFilters.length; i < len; i++)
                this.mFilters[i].dumpProp();
        }        

    }
});