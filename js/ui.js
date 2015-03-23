// rivets.binders
(function(root) {
    'use strict';

    rivets.binders.color = function(el, color) {
        if (color) {
            el.style.color = color;
        }
    };

    rivets.binders.use_item = {
        bind: function(el) {
            var adapter = rivets.adapters['.'];
            var model = this.model;
            var keypath = this.keypath;

            this.callback = function() {
                var viewItem = adapter.get(model, keypath);
                var player = model.player;
                var item = player.inventory.getFirstByType(viewItem.type);
                player.performAction('use_item', item);
            };

            $(el).on('click', this.callback);
        },
        unbind: function(el) {
            $(el).off('click', this.callback);
        }
    };

    rivets.binders.equip_item = {
        bind: function(el) {
            var adapter = rivets.adapters['.'];
            var model = this.model;
            var keypath = this.keypath;

            var slot = model.slot;

            this.callback = function() {
                var viewItem = adapter.get(model, keypath);
                var player = model.player;
                var item = player.inventory.getFirstByType(viewItem.type);

                if(player.canEquip(item)){
                    player.inventory.remove(item);
                    player.equip(item, slot);
                }
            };

            $(el).on('click', this.callback);
        },
        unbind: function(el) {
            $(el).off('click', this.callback);
        }
    };

}(this));

(function(root) {
    'use strict';

    var elById = document.getElementById.bind(document);

    var makeInventory = function(game, elementId){
        elementId = elementId || 'inventory-container';
        var el = elById(elementId);
        var data = {
            player: game.player,
            inventoryViewData: game.player.inventory.viewObjects,
        };
        rivets.bind(el, data);
    };

    var makeEquipment = function(game, elementId){
        elementId = elementId || 'equipment-container';
        var el = elById(elementId);
        var data = {
            player: game.player,
            slots: game.player.equipment,
            inventoryViewData: game.player.inventory.viewObjects,
        };
        rivets.bind(el, data);
    };

    var makeControls = function(keyBindings, elementId){
        elementId = elementId || 'controls-container';
        var el = elById(elementId);

        var bindings = [];
        for(var action in keyBindings){
            var keys = keyBindings[action];
            bindings.push({
                name: action,
                keys: keys.join(', ')
            });
        }
        var data = {
            keyBindings: bindings
        };
        rivets.bind(el, data);
    };

    var makeStats = function(game, elementId){
        elementId = elementId || 'stats-container';
        var el = elById(elementId);
        var data = game.player;
        rivets.bind(el, data);
    };

    root.RL.Views = {
        inventory: makeInventory,
        equipment: makeEquipment,
        controls: makeControls,
        stats: makeStats,
    };


}(this));
