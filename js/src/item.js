(function(root) {
    'use strict';

    var itemId = 0;

    /**
     * Represents an item in the game map.
     * @class Item
     * @constructor
     * @param {Object} game - Game instance this obj is attached to.
     * @param {String} type - Type of tile. When created this object is merged with the value of Item.Types[type].
     */
    var Item = function Item(game, settings) {
        this.game = game;
        this.id = itemId++;

        if(this.init){
            this.init(game, settings);
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
        * Called when the item is first created. Intended to be assigned by `Item.Types`.
        * @method init
        * @param {Game} game - Game instance this obj is attached to.
        * @param {String} type - Type of item. When created this object is merged with the value of `Item.Types[type]`.
        */
        init: false,

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
        consoleColor: null,
    };

    RL.Util.merge(
        Item.prototype,
        RL.Mixins.TileDraw,
        RL.Mixins.ResolvableActionInterface
    );

    RL.Item = Item;

    RL.Item.Types = {};

    RL.Item.addType = function(type, objProto){
        objProto.type = type;
        var ObjConstructor = RL.Util.compose(Item, objProto);
        RL.Item.Types[type] = ObjConstructor;
    };

    RL.Item.make = function(game, type, settings){
        var Type = RL.Item.Types[type];
        return new Type(game, settings);
    };


}(this));
