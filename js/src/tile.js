(function(root) {
    'use strict';

    var tileId = 0;

    /**
     * Represents a tile in the game map.
     * @class Tile
     * @constructor
     * @uses TileDraw
     * @param {Object} game - Game instance this obj is attached to.
     * @param {Number} x - The map tile coordinate position of this tile on the x axis.
     * @param {Number} y - The map tile coordinate position of this tile on the y axis.
     * @param {Object} attributes - attributes to merge into object
     */
    var Tile = function Tile(game, x, y, attributes) {
        this.game = game;

        this.x = x;
        this.y = y;

        this.id = tileId++;

        if(attributes){
            this.room_template = attributes.room_template
        }

        if(this.init){
            this.init(game, x, y);
        }
    };


    Tile.prototype = {
        constructor: Tile,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type {Game}
        */
        game: null,

        /**
         * Unique id for this tile.
         * @type {Number}
         */
        id: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of `Tile.Types[type]`. See constructor.
        * @property type
        * @type {String}
        */
        type: null,

        room_template: null,

        /**
        * Optional Callback. Called when the entity is first created. Intended to be assigned by Entity.Types.
        * @method init
        * @param {Game} game - Game instance this obj is attached to.
        * @param {String} type - Type of tile. When created this object is merged with the value of Tile.Types[type].
        * @param {Number} x - The map tile coordinate position of this tile on the x axis.
        * @param {Number} y - The map tile coordinate position of this tile on the y axis.
        */
        init: false,

        /**
        * Display name for this tile.
        * @property name
        * @type {String}
        */
        name: null,

        /**
        * If this tile has been explored by the player.
        * @property explored
        * @type {Bool}
        */
        explored: false,

        /**
        * If entities can move through this tile.
        * @property passable
        * @type {Bool}
        */
        passable: false,

        /**
        * If this tile blocks line of sight.
        * @property blocksLos
        * @type {Bool}
        */
        blocksLos: false,

        /**
        * The tile map tile x coord.
        * @property x
        * @type {Number}
        */
        x: null,

        /**
        * The tile map tile y coord.
        * @property y
        * @type {Number}
        */
        y: null,

        /**
        * The character displayed when rendering this tile.
        * @property char
        * @type {String}
        */
        char: null,

        /**
        * The color of the character displayed when rendering this tile. Not rendered if evaluates to false.
        * @property color
        * @type {String|bool}
        */
        color: null,

        /**
        * The background color the character displayed when rendering this tile. Not rendered if evaluates to false.
        * @property bgColor
        * @type {String|bool}
        */
        bgColor: null,

        /**
         * Optional callback called when added to an `ObjectManager` or `MultiObjectManager`.
         * @metod onAdd
         */
        onAdd: false,

        /**
         * Optional callback called when removed from an `ObjectManager` or `MultiObjectManager`.
         * @metod onRemove
         */
        onRemove: false,

        /**
        * Handles the behavior of a player or other entity attempting to move into this tile. Only used if this.passable = false.
        * @method bump
        * @param {Object} entity - The player or entity attempting to move into this tile.
        */
        bump: function(entity){
            if(!this.passable){
                this.game.console.log('You cannot move through this <strong>' + this.name + '</strong> no matter how hard you try.');
                return false;
            }
            return true;
        },

        /**
        * Handles entity entering a new tile.
        * Called after chaning the entities position
        * @method onEntityEnter
        * @param {Entity} entity - The entity entering the tile
        * @param {Number} x - Map tile coord.
        * @param {Number} y - Map tile coord.
        */
        onEntityEnter: function(entity){
            // add behavior here
        },

    };

    RL.Util.merge(Tile.prototype, RL.Mixins.TileDraw);

    /**
    * Describes different types of tiles. Used by the Tile constructor 'type' param.
    *
    *     Tile.Types = {
    *         floor: {
    *            name: 'Floor',
    *            char: '.',
    *            color: '#333',
    *            bgColor: '#111',
    *            passable: true,
    *            blocksLos: false
    *         },
    *         // ...
    *     }
    *
    * @class Tile.Types
    * @static
    */
    var tileTypes = {
        floor: {
            name: 'Floor',
            char: '.',
            color: '#444',
            bgColor: '#222',
            passable: true,
            blocksLos: false
        },
        wall: {
            name: 'Wall',
            char: '#',
            color: '#777',
            bgColor: '#2e2e2e',
            passable: false,
            blocksLos: true
        },
        light: {
            name: 'Light',
            char: '+',
            color: '#fff',
            bgColor: '#333',
            passable: false,
            blocksLos: false
        },

        // door: {
        //     name: 'Door',
        //     char: '+',
        //     color: 'yellow',
        //     bgColor: '#222',
        //     passable: false,
        //     blocksLos: true,
        //     bump: function(entity){
        //         if(!this.passable){
        //             this.passable = true;
        //             this.blocksLos = false;
        //             this.char = "'";
        //             this.game.console.log('You open the <strong>' + this.name + '</strong>.');
        //             return true;
        //         }
        //         return false;
        //     }
        // }
    };

    RL.Tile = Tile;

    RL.Tile.Types = {};

    RL.Tile.addType = function(type, objProto){
        objProto.type = type;
        var ObjConstructor = RL.Util.compose(Tile, objProto);
        RL.Tile.Types[type] = ObjConstructor;
    };

    RL.Tile.make = function(game, type, x, y, attributes){
        var Type = RL.Tile.Types[type];
        return new Type(game, x, y, attributes);
    };

    for(var type in tileTypes){
        var objProto = tileTypes[type];
        RL.Tile.addType(type, objProto);
    }

}(this));
