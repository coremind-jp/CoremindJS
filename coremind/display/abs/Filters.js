cm.Class.create(
{
    /** @name cm.display.abs */
    $name:"cm.display.abs.Filters",
    $extends:"cm.display.abs.DisplayParameters",
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
            if (!cm.equal.isUndefined(this.mFilters))
                this.mFilters.length = 0;
            if (!cm.equal.isUndefined(this.mRemoved))
                this.mRemoved.length = 0;
        },
        
        get:function(index)
        {
            if (cm.equal.isUndefined(this.mFilters)) this.mFilters = [];
            return this.mFilters[index];
        },
        indexOf:function(filter)
        {
            if (cm.equal.isUndefined(this.mFilters)) this.mFilters = [];
            return this.mFilters.indexOf(filter);
        },
        
        add:function(filter)
        {
            if (cm.equal.isUndefined(this.mFilters))
                this.mFilters = [];
            
            var _order = 0;
            var _filterClass = cm.Class.get(filter.getClassFullName());
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
            
            if (cm.equal.isUndefined(this.mRemoved))
                this.mRemoved = [];
            this.mRemoved.push(this.mFilters[i]);
            this.mFilters.splice(i, 1)
            
            var _filterClass = cm.Class.get(filter.getClassFullName());
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
        }
        

    }
});