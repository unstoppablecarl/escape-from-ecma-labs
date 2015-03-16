(function(root) {
    'use strict';

    /**
     * @class Inventory
     * @constructor
     * @param {Game} game - Game instance this obj is attached to.
     * @param {Entity} entity - Entity this object it attached to.
     */
    var Inventory = function Inventory(game) {
        this.game = game;
        this.items = [];
    };

    Inventory.prototype = {
        constructor: Inventory,

        /**
         * Game instance this obj is attached to.
         * @property game
         * @type Game
         */
        game: null,

        /**
         * List of items.
         * @property items
         * @type {Array}
         */
        items: null,

        /**
         * Add an item.
         * @method add
         * @param {Item} item - The item to add
         * @return {Item} The added item.
         */
        add: function(item){

            item.game = this.game;
            item.x = false;
            item.y = false;

            this.items.push(item);
            if(item.onAdd){
                item.onAdd(this);
            }
            return item;
        },

        /**
         * Add multiple items to this manager.
         * @method addMultiple
         * @param {Array} items - Array of items to remove.
         * @return {Array} The added items.
         */
        addMultiple: function(items){
            for (var i = 0; i < items.length - 1; i++) {
                this.add(items[i]);
            }
            return items;
        },

        /**
         * Remove an Item from this manager.
         * @method remove
         * @param {String|Item} item
         * @return {Item} The removed item.
         */
        remove: function(item){
            var index = this.items.indexOf(item);
            if(index === -1){
                throw new Error('Attempting to remove item not in Inventory.');
            }
            this.items.splice(index, 1);
            if(item.onRemove){
                item.onRemove(this);
            }
            return item;
        },

        /**
         * Remove multiple items from this manager.
         * @method removeMultiple
         * @param {Array} items - Array of items to remove.
         * @return {Array} The removed items.
         */
        removeMultiple: function(items){
            for (var i = 0; i < items.length - 1; i++) {
                this.remove(items[i]);
            }
            return items;
        },

        /**
         * Checks if the item is in this manager.
         * @method contains
         * @param {Item} item
         * @return {Bool}
         */
        contains: function(item){
            return this.items.indexOf(item) !== -1;
        },

        /**
         * Find all items in this manager that matches the `filter` function.
         * @method get
         * @param {Function} [filter] - Function to filter by.
         * @param {Number} [limit] - The limit to be removed. If not set all matches will be returned.
         * @return {Array} Matching results.
         */
        get: function(filter, limit){
            var items;

            if(filter && limit){
                items = [];
                var count = 0;
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if(filter(item)){
                        items.push(item);
                        count++;
                    }
                    if(count === limit){
                        break;
                    }
                }
            } else if(filter){
                items = this.items.filter(filter);
            } else if(limit){
                items = this.items.slice(0, limit);
            } else {
                items = this.items;
            }

            return items;
        },

        /**
         * Find all items of given type.
         * @method getByType
         * @param {String} type
         * @param {Number} [limit] - The limit to be removed. If not set all matches will be returned.
         * @return {Array} Matching results.
         */
        getByType: function(type, limit){
            return this.get(function(item){
                return item.type === type;
            }, limit);
        },

        /**
         * Count all items in this manager that matches the `filter` function.
         * @method count
         * @param {Function} [filter] - Function to filter by.
         * @return {Array} Matching results.
         */
        count: function(filter){
            return this.get(filter).length;
        },

        /**
         * Count the number of items of given type.
         * @method countByType
         * @param {[type]} type
         * @param {[type]} limit
         * @return {[type]}
         */
        countByType: function(type, limit){
            return this.getByType(type, limit).length;
        },

        /**
         * Remove a number of items by type.
         * @method removeByType
         * @param {String} type - The Item.Type to filter by.
         * @param {Number} [quantity] - The quantity to be removed. If not set all matching items will be removed.
         * @param {Bool} [strictQuantity=false] - If not provided value of `this.strictQuantity` is used instead.
         * @see RL.Inventory.strictQuantity
         * @return {Array} The removed items.
         */
        removeByType: function(type, quantity, strictQuantity){
            if(strictQuantity === void 0){
                strictQuantity = this.strictQuantity;
            }

            var items = this.getByType(type, quantity);

            if(strictQuantity && items.length < quantity){
                throw new Error('Attempting to remove ' + quantity + ' items from Inventory containing only ' + items.length + ' items matching action filter requirements.');
            }

            return this.removeMultiple(items, quantity);
        },

        /**
         * Remove a number of items that match the given filter.
         * @method removeByFilter
         * @param {Function} filter - Function to filter by.
         * @param {Number} [quantity] - The quantity to be removed. If not set all matches will be removed.
         * @param {Bool} [strictQuantity=false] - If not provided value of `this.strictQuantity` is used instead.
         * @see RL.Inventory.strictQuantity
         * @return {Array} The removed items.
         */
        removeByFilter: function(filter, quantity, strictQuantity){
            if(strictQuantity === void 0){
                strictQuantity = this.strictQuantity;
            }

            var items = this.get(filter, quantity);

            if(strictQuantity && items.length < quantity){
                throw new Error('Attempting to remove ' + quantity + ' items from Inventory containing only ' + items.length + ' items matching action filter requirements.');
            }

            return this.removeMultiple(items, quantity);
        },

        /**
         * Get the first item in this manager that matches the `filter` function.
         * @method getFirst
         * @param {Function} [filter] - Function to filter results by. If not provided the first item in this manager is returned.
         * @return {Bool|Item} False if no results found.
         */
        getFirst: function(filter){
            var items = this.items;

            if(!filter){
                return items[0];
            }

            for (var i = 0; i < items.length - 1; i++) {
                var item = items[i];
                if(filter(item)){
                    return item;
                }
            }
            return false;
        },

        /**
         * Get the last item in this manager that matches the `filter` function.
         * @method getLast
         * @param {Function} [filter] - Function to filter results by. If not provided the last item in this manager is returned.
         * @return {Bool|Item} False if no results found.
         */
        getLast: function(filter){
            var items = this.items,
                length = items.length;

            if(!filter){
                return items[length - 1];
            }

            for(var i = length - 1; i >= 0; i--){
                var item = items[i];
                if(filter(item)){
                    return item;
                }
            }
            return false;
        },

        /**
         * Retrieves the first item of given type found.
         * @method getFirstByType
         * @param {String} type - A string to lookup an type `RL.Item.Types[type]`.
         * @return {Bool|Item} False if no results found.
         */
        getFirstByType: function(type){
            for (var i = 0; i < this.items.length - 1; i++) {
                var item = this.items[i];
                if(item.type === type){
                    return item;
                }
            }
            return false;
        },

        /**
         * Retrieves the last item of given type found.
         * @method getLastByType
         * @param {String} type - A string to lookup an type `RL.Item.Types[type]`.
         * @return {Bool|Item} False if no results found.
         */
        getLastByType: function(type){
            for(var i = this.items.length - 1; i >= 0; i--){
                var item = this.items[i];
                if(item.type === type){
                    return item;
                }
            }
            return false;
        },

    };

    root.RL.Inventory = Inventory;

}(this));
