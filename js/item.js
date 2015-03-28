(function(root) {
    'use strict';

    var extendedItem = {
        init: function(game, settings){
            this.setResolvableAction('pickup');
        },

        consoleColor: RL.Util.COLORS.blue_alt
    };

    RL.Util.merge(RL.Item.prototype, extendedItem);

    var Defaults = {
        healing: {
            itemType: 'healing',
            consoleColor: 'pink',
            usable: true,
            init: function(){
                this.setResolvableAction('pickup');
                this.setResolvableAction('use_item', RL.ResolvableAction.Types.use_item_healing);
            },
            use: function(entity){
                entity.heal(this.healAmount);
            }
        },
    };

    var makeHealingItem = function(newProto){
        newProto = RL.Util.merge({}, Defaults.healing, newProto);

        newProto.statDesc = '[+' + newProto.healAmount + ' HP]';

        return newProto;
    };

    /**
    * Describes different types of tiles. Used by the Item constructor 'type' param.
    *
    *     Item.Types = {
    *         floor: {
    *            name: 'Floor',
    *            char: '.',
    *            color: '#333',
    *            bgColor: '#111',
    *            blocksLos: false
    *         },
    *         // ...
    *     }
    *
    * @class Item.Types
    * @static
    */
    var itemTypes = {

        // healing items
        bandaid: makeHealingItem({
            name: 'Bandaid',
            color: '#fff',
            bgColor: false,
            char: "'",
            healAmount: 1,
        }),
        disinfectant: makeHealingItem({
            name: 'Disinfectant',
            color: '#fff',
            bgColor: false,
            char: ",",
            healAmount: 2,
        }),
        bandage: makeHealingItem({
            name: 'Bandage',
            color: '#fff',
            bgColor: false,
            char: 'o',
            healAmount: 3,
        }),
        icy_hot: makeHealingItem({
            name: 'Icy Hot',
            color: '#fff',
            bgColor: false,
            char: '[',
            healAmount: 4,
        }),
        medical_tape: makeHealingItem({
            name: 'Medical Tape',
            color: '#fff',
            bgColor: false,
            char: '~',
            healAmount: 5,
        }),
        asprin: makeHealingItem({
            name: 'Asprin',
            color: '#fff',
            bgColor: false,
            char: ':',
            healAmount: 6,
        }),
        stitch_kit: makeHealingItem({
            name: 'Stitch Kit',
            color: '#fff',
            bgColor: false,
            char: '\\',
            healAmount: 7,
        }),
        medkit: makeHealingItem({
            name: 'Medkit',
            color: 'red',
            bgColor: '#fff',
            char: '+',
            healAmount: 8,
        }),
        rx_pain_killers: makeHealingItem({
            name: 'Rx Pain Killers',
            color: 'red',
            bgColor: '#fff',
            char: ';',
            healAmount: 9,
        }),
        quik_clot: makeHealingItem({
            name: 'Quik Clot',
            color: 'red',
            bgColor: '#fff',
            char: '!',
            healAmount: 10,
        }),
    };

    for(var type in itemTypes){
        var objProto = itemTypes[type];
        RL.Item.addType(type, objProto);
    }

}(this));
