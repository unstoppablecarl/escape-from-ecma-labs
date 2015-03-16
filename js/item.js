(function(root) {
    'use strict';

    var itemId = 0;

    /**
     * Represents an item in the game map.
     * @class Item
     * @constructor
     * @param {Object} game - Game instance this obj is attached to.
     * @param {String} type - Type of tile. When created this object is merged with the value of Item.Types[type].
     * @param {Number} x - The map tile coordinate position of this tile on the x axis.
     * @param {Number} y - The map tile coordinate position of this tile on the y axis.
     */
    var Item = function Item(game, type, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.id = itemId++;
        this.type = type;

        var typeData = Item.Types[type];
        RL.Util.merge(this, typeData);

        this.setResolvableAction('pickup');

        if(this.init){
            this.init(game, type, x, y);
        }
    };

    Item.prototype = {
        constructor: Item,

        /**
         * Game instance this obj is attached to.
         * @property game
         * @type {Game}
         */
        game: null,

        /**
         * Unique Id.
         * @property id
         * @type {Number}
         */
        id: null,

        /**
         * The type of entity this is.
         * When created this object is merged with the value of Item.Types[type].
         * @property type
         * @type {String}
         */
        type: null,

        /**
         * Display name for this item.
         * @property name
         * @type {String}
         */
        name: null,

        /**
         * The tile map coordinate position on the x axis.
         * @property x
         * @type {Number}
         */
        x: null,

        /**
         * The tile map coordinate position on the y axis.
         * @property y
         * @type {Number}
         */
        y: null,

        /**
         * Optional callback called when added to an `ObjectManager` or `MultiObjectManager` or `Inventory`.
         * @metod onAdd
         */
        onAdd: false,

        /**
         * Optional callback called when removed from an `ObjectManager` or `MultiObjectManager` or `Inventory`.
         * @metod onRemove
         */
        onRemove: false,

        /**
         * The character displayed when rendering this tile.
         * @property char
         * @type String
         */
        char: null,

        /**
         * The color of the character displayed when rendering this tile. Not rendered if false.
         * @property color
         * @type String|Boolean
         */
        color: null,

        /**
         * The background color the character displayed when rendering this tile. Not rendered if false.
         * @property bgColor
         * @type String|Boolean
         */
        bgColor: false,
        charStrokeColor: '#000',
        charStrokeWidth: 2,
        consoleColor: RL.Util.COLORS.blue_alt,
    };

    var Defaults = {
        healing: {
            itemType: 'healing',
            consoleColor: 'pink',
            init: function(){
                this.setResolvableAction('use_item', RL.ResolvableAction.Types.use_item_healing);
            },
            use: function(entity){
                entity.heal(this.healAmount);
            }
        },
    };

    RL.Util.merge(Item.prototype, RL.Mixins.TileDraw);
    RL.Util.merge(Item.prototype, RL.Mixins.ResolvableActionInterface);

    var makeHealingItem = function(obj){
        obj.statDesc = '[+' + obj.healAmount + ' HP]';
        return RL.Util.merge(obj, Defaults.healing);
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
    Item.Types = {

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


    root.RL.Item = Item;

}(this));
