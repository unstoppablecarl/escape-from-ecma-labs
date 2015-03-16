var $inventoryContainer = document.getElementById('inventory-container');

var scope = {
    player: game.player,
    inventory: game.player.inventory,
};

rivets.binders.color = function(el, color) {
    if(color){
        el.style.color = color;
    }
};

rivets.binders.use_item = {
    bind: function(el) {
        var adapter = rivets.adapters['.'];
        var model = this.model;
        var keypath = this.keypath;

        this.callback = function() {
            console.log('click');
            var item = adapter.get(model, keypath);
            var player = model.player;
            player.performAction('use_item', item);
        };

        $(el).on('click', this.callback);
    },
    unbind: function(el) {
        $(el).off('click', this.callback);
    }
};

rivets.bind($inventoryContainer, scope);
