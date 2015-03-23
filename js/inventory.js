(function(root) {
    'use strict';

    var extendedInventory = {

        /**
         * Cache of view objects by item type.
         * @type {Object}
         */
        viewObjectsByType: null,

        /**
         * Array of view objects to be displayed.
         * @type {Array}
         */
        viewObjects: null,

        /**
         *
         * @method init
         * @param {Game} game
         */
        init: function(game) {
            this.viewObjects = [];
            this.viewObjectsByType = {};
        },

        /**
         * Sort view Objects by name
         * @method sortViewObjects
         * @return {Number}
         */
        sortViewObjects: function() {
            this.viewObjects.sort(function(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });
        },

        /**
         * Gets a view object from the cache. Creates and addes it, if not found in cache.
         * @method getViewObject
         * @param {Item} item
         * @return {Object}
         */
        getViewObject: function(item){
            var type = item.type;
            if (!this.viewObjectsByType[type]) {
                var newViewObject = {
                    name: item.name,
                    statDesc: item.statDesc,
                    type: type,
                    itemType: item.itemType,
                    equipableToSlots: item.equipableToSlots,
                    quantity: 0,
                    consoleColor: item.consoleColor
                };
                this.viewObjectsByType[type] = newViewObject;
            }
            return this.viewObjectsByType[type];
        },

        /**
         * Optional callback called when an item is added.
         * @metod onAdd
         * @param {Item} item - The item being added.
         */
        onAdd: function(item) {
            var type = item.type;

            var viewObject = this.getViewObject(item);

            // if not already in the list, add it and sort
            if(this.viewObjects.indexOf(viewObject) === -1){
                this.viewObjects.push(viewObject);
                this.sortViewObjects();
            }

            // var ammo = this.game.player.equipment.ammo;
            // if(ammo && type === ammo.type){
            //     this.game.player.updateAmmoCount();
            // }

            this.viewObjectsByType[type].quantity++;
        },

        /**
         * Optional callback called when an item is removed.
         * @metod onRemove
         * @param {Item} item - The item being removed.
         */
        onRemove: function(item) {
            var viewObject = this.getViewObject(item);
            viewObject.quantity--;

            // remove from list if quantity 0
            if (!viewObject.quantity) {
                var index = this.viewObjects.indexOf(viewObject);
                if (index !== -1) {
                    this.viewObjects.splice(index, 1);
                }
            }

            // var ammo = this.game.player.equipment.ammo;
            // if(ammo && item.type === ammo.type){
            //     this.game.player.updateAmmoCount();
            // }
        },
    };

    RL.Util.merge(RL.Inventory.prototype, extendedInventory);

}(this));
