(function(root) {
    'use strict';

    /**
    * Represents an Furniture in the game map.
    * @class Furniture
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Type of tile. When created this object is merged with the value of Furniture.Types[type].
    */
    var Furniture = function Furniture(game, settings) {
        this.game = game;

        // all furniture must be destroyable!
        this.setResolvableAction('melee_attack');
        this.setResolvableAction('ranged_attack');

        if(this.init){
            this.init(game, settings);
        }
    };

    Furniture.prototype = {
        constructor: Furniture,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of Furniture.Types[type].
        * @property type
        * @type Object
        */
        type: null,

        /**
        * Display name for this Furniture.
        * @property name
        * @type {String}
        */
        name: null,

        /**
        * The tile map coordinate position on the x axis.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The tile map coordinate position on the y axis.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this tile.
        * @property char
        * @type String
        */
        char: null,

        /**
        * The color of the character displayed when rendering this tile. Not rendered if false.
        * @property color
        * @type String|bool
        */
        color: null,

        /**
        * The background color the character displayed when rendering this tile. Not rendered if false.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,

        consoleColor: false,

        /**
        * If entities can move through this tile.
        * @property passable
        * @type {Bool}
        */
        passable: false,

        /**
        * If this tile blocks line of sight.
        * @property passable
        * @type {Bool}
        */
        blocksLos: false,

        hp: 1,

        dead: false,

        /**
         * Optional callback called when added to an `ObjectManager` or `MultiObjectManager`.
         * @metod onAdd
         */
        onAdd: false,

        /**
         * Optional callback called when removed from an `ObjectManager` or `MultiObjectManager`.
         * @metod onRemve
         */
        onRemve: false,

        takeDamage: function(amount){
            this.hp -= amount;
            if (this.hp <= 0) {
                this.dead = true;
            }
        },
        getConsoleName: function(){
            return {
                name: this.name,
                color: this.consoleColor
            };
        },

        /**
        * Checks if this entity can move to the specified map tile
        * @method canMoveTo
        * @param {Number} x - The tile map x coord to check if this entity can move to.
        * @param {Number} y - The tile map y coord to check if this entity can move to.
        * @return {Bool}
        */
        canMoveTo: function(x, y){
            return this.game.entityCanMoveTo(this, x, y);
        },

        /**
        * Changes the position of this entity on the map.
        * this.canMoveTo() should always be checked before calling this.moveTo
        * @method moveTo
        * @param {Number} x - The tile map x coord to move to.
        * @param {Number} y - The tile map y coord to move to.
        */
        moveTo: function(x, y) {
            return this.game.furnitureManager.move(x, y, this);
        },
    };

    RL.Util.merge(
        Furniture.prototype,
        RL.Mixins.TileDraw,
        RL.Mixins.ResolvableActionInterface
    );

    /**
    * Describes different types of tiles. Used by the Furniture constructor 'type' param.
    *
    *     Furniture.Types = {
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
    * @class Furniture.Types
    * @static
    */
    var furnitureTypes = {
        chair: {
            name: 'Chair',
            hp: 4,
            char: 'h',
            color: RL.Util.COLORS.orange,
            consoleColor: RL.Util.COLORS.orange_alt,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){
                this.setResolvableAction('grab');
                this.setResolvableAction('push');

                // this.setResolvableAction('ranged_attack');
            }
        },
        trashcan: {
            name: 'Trashcan',
            hp: 1,
            char: 'u',
            color: RL.Util.COLORS.green,
            consoleColor: RL.Util.COLORS.green_alt,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){
                this.setResolvableAction('grab');
                this.setResolvableAction('push');
            }
        },
        biohazard_trash: {
            name: 'Biohazard Trash',
            hp: 1,
            char: 'u',
            color: RL.Util.COLORS.red,
            consoleColor: RL.Util.COLORS.red_alt,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){
                this.setResolvableAction('grab');
                this.setResolvableAction('push');
            }
        },
        shelves: {
            name: 'Shelves',
            hp: 5,
            char: '▤',
            color: 'tan',
            consoleColor: 'tan',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){
                this.setResolvableAction('grab');
                this.setResolvableAction('push');
            }
        },

        refridgerator: {
            name: 'Refridgerator',
            hp: 5,
            char: 'O',
            color: 'tan',
            consoleColor: 'tan',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){
                this.setResolvableAction('grab');
                this.setResolvableAction('push');
            }
        },
        analyzer: {
            name: 'Analyzer',
            hp: 5,
            char: 'A',
            color: RL.Util.COLORS.blue,
            consoleColor: 'tan',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){
                this.setResolvableAction('grab');
                this.setResolvableAction('push');
            }
        },
        microscope: {
            name: 'Microscope',
            char: 'M',
            color: '#eee',
            consoleColor: '#eee',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
        },
        table: {
            name: 'Table',
            char: 'T',
            color: RL.Util.COLORS.purple,
            consoleColor: RL.Util.COLORS.purple_alt,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){

            }
        },
        desk: {
            name: 'Desk',
            char: 'T',
            color: 'brown',
            consoleColor: 'brown',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            hp: 4,
            passable: false,
            init: function(){

            }
        },
        computer: {
            name: 'Computer',
            char: 'C',
            color: RL.Util.COLORS.blue,
            consoleColor: RL.Util.COLORS.blue,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            hp: 1,
            passable: true,
            init: function(){
                //
            }
        },
        box: {
            name: 'Box',
            hp: 6,
            char: '☒',
            color: RL.Util.COLORS.yellow,
            consoleColor: RL.Util.COLORS.yellow_alt,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){
                this.setResolvableAction('grab');
                this.setResolvableAction('push');

                // this.setResolvableAction('ranged_attack');
            }
        },
        door: {
            name: 'Door',
            hp: 5,
            char: '+',
            color: 'yellow',
            consoleColor: 'yellow',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            blocksLos: true,
            init: function(){
                this.setResolvableAction('open');
                this.setResolvableAction('close');


                // this.setResolvableAction('ranged_attack');
            }
        },
        door_glass: {
            name: 'Glass Door',
            hp: 3,
            char: '+',
            color: 'teal',
            consoleColor: 'teal',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            blocksLos: false,
            init: function(){
                this.setResolvableAction('open');
                this.setResolvableAction('close');
                // this.setResolvableAction('ranged_attack');
            }
        },
        chest: {
            name: 'Chest',
            hp: 5,
            char: '_',
            color: 'yellow',
            consoleColor: 'yellow',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: true,
            blocksLos: false,
            init: function(){
                this.setResolvableAction('open');
                this.setResolvableAction('close');
            }
        },
        crate: {
            name: 'Crate',
            hp: 5,
            char: '-',
            color: 'yellow',
            consoleColor: 'yellow',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: true,
            blocksLos: false,
            init: function(){

                this.setResolvableAction('open');
                this.setResolvableAction('close');
            }
        },

        whiteboard: {
            name: 'Whiteboard',
            char: '-',
            color: '#fff',
            bgColor: '#808080',
            blocksLos: true,
            hp: 1,
            passable: false,
        },
        cabnet: {
            name: 'Cabnet',
            char: '[',
            color: 'tan',
        },
        printer: {
            name: 'Printer',
            char: '⎙',
            color: '#808080',
        },

        // walls
        window: {
            name: 'Window',
            isWall: true,
            char: '/',
            color: 'teal',
            bgColor: RL.Util.COLORS.slate_alt,
            passable: false,
            blocksLos: false,
            hp: 10
        },
        cubicle_wall: {
            name: 'Cubicle Wall',
            isWall: true,

            hp: 5,
            char: '+',
            color: '#808080',
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            blocksLos: true,

            init: function(){

            }
        },

        placeholder: {
            name: 'Placeholder',
            placeholderType: null,
            bg: false,
            color: false,
            char: false,
            passable: true
        },

        sink: {
            name: 'Sink',
            char: 's',
            color: RL.Util.COLORS.blue,
            consoleColor: RL.Util.COLORS.blue,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            hp: 5,
            passable: false,
        },

        fern: {
            name: 'Fern',
            char: '*',
            color: RL.Util.COLORS.green,
            consoleColor: RL.Util.COLORS.green,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            hp: 2,
            blocksLos: false,
            passable: false,
        },

        work_bench: {
            name: 'Work Bench',
            char: 'T',
            color: RL.Util.COLORS.purple,
            consoleColor: RL.Util.COLORS.purple_alt,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,

        },

        lamp: {
            name: 'Lamp',
            char: '*',
            color: '#fff',
            consoleColor: '#fff',
            passable: true,
            light_r: 100,
            light_g: 100,
            light_b: 255,
            hp: 1,
            init: function(){
                this.setResolvableAction('melee_attack');
                this.setResolvableAction('ranged_attack');
            },
            onAdd: function(){
                // remove light from current position
                this.onRemove();
                // add to new position
                this.game.lighting.set(this.x, this.y, this.light_r, this.light_g, this.light_b);
            },
            onRemove: function(){
                console.log('zxccxz', this.x, this.y, this.game.lighting.get(this.x, this.y));
                if(this.game.lighting.get(this.x, this.y)){
                    this.game.lighting.remove(this.x, this.y);
                }
            }
        },
        target: {
            name: 'Target',
            char: '+',
            color: '#ff0000',
            consoleColor: '#ff0000',
            passable: false,
            hp: 1,
            init: function(){
                this.setResolvableAction('melee_attack');
                this.setResolvableAction('ranged_attack');
            },
        }
    };


    RL.Furniture = Furniture;

    RL.Furniture.Types = {};

    RL.Furniture.addType = function(type, objProto){
        objProto.type = type;
        var ObjConstructor = RL.Util.compose(Furniture, objProto);
        RL.Furniture.Types[type] = ObjConstructor;
    };

    RL.Furniture.make = function(game, type, settings){
        var Type = RL.Furniture.Types[type];
        return new Type(game, settings);
    };

    for(var type in furnitureTypes){
        var objProto = furnitureTypes[type];
        RL.Furniture.addType(type, objProto);
    }

}(this));
