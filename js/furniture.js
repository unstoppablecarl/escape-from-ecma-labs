(function(root) {
    'use strict';

    /**
    * Represents an Furniture in the game map.
    * @class Furniture
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Type of tile. When created this object is merged with the value of Furniture.Types[type].
    * @param {Number} x - The map tile coordinate position of this tile on the x axis.
    * @param {Number} y - The map tile coordinate position of this tile on the y axis.
    */
    var Furniture = function Furniture(game, type, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;

        var typeData = Furniture.Types[type];
        RL.Util.merge(this, typeData);

        this.actions = {};

        if(this.init){
            this.init();
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

        pushable: false,

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

        actions: null,

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

        // /**
        //  * Checks if this object is a valid target for given action.
        //  * @method canResolveAction
        //  * @param {String} action
        //  * @param {Object} source
        //  * @param {Object} settings
        //  * @return {Boolean}
        //  */
        // canResolveAction: function(action, source, settings){
        //     if(!this.actions[action]){
        //         return false;
        //     }
        //     return this.actions[action].canResolve.call(this, source, settings);
        // },

        // /**
        //  * Resolves an action
        //  * @method resolveAction
        //  * @param {String} action
        //  * @param {Object} source
        //  * @param {Object} settings
        //  * @return {Boolean}
        //  */
        // resolveAction: function(action, source, settings){
        //     if(this.canResolveAction(action, source, settings)){
        //         return this.actions[action].resolve.call(this, source, settings);
        //     }
        // },
    };

    RL.Util.merge(Furniture.prototype, RL.Mixins.TileDraw);



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
    Furniture.Types = {
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
                RL.Actions.Resolvable.add(this, 'grab');
                RL.Actions.Resolvable.add(this, 'push');
                RL.Actions.Resolvable.add(this, 'melee_attack');
                // RL.Actions.Resolvable.add(this, 'ranged_attack');
            }
        },
        trashcan: {
            name: 'Trashcan',
            hp: 1,
            char: 'U',
            color: RL.Util.COLORS.green,
            consoleColor: RL.Util.COLORS.green_alt,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            passable: false,
            init: function(){
                RL.Actions.Resolvable.add(this, 'grab');
                RL.Actions.Resolvable.add(this, 'push');
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
                RL.Actions.Resolvable.add(this, 'grab');
                RL.Actions.Resolvable.add(this, 'push');
                RL.Actions.Resolvable.add(this, 'melee_attack');
                RL.Actions.Resolvable.add(this, 'ranged_attack');
            }
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
                RL.Actions.Resolvable.add(this, 'melee_attack');
                // RL.Actions.Resolvable.add(this, 'ranged_attack');
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
                RL.Actions.Resolvable.add(this, 'grab');
                RL.Actions.Resolvable.add(this, 'push');
                RL.Actions.Resolvable.add(this, 'melee_attack');
                // RL.Actions.Resolvable.add(this, 'ranged_attack');
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
            mixins: ['door'],
            init: function(){
                RL.Actions.Resolvable.add(this, 'open');
                RL.Actions.Resolvable.add(this, 'close');

                RL.Actions.Resolvable.add(this, 'melee_attack');
                // RL.Actions.Resolvable.add(this, 'ranged_attack');
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
            pushable: false,
            passable: true,
            blocksLos: false,
            init: function(){
                RL.Actions.Resolvable.add(this, 'open');
                RL.Actions.Resolvable.add(this, 'close');
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
            pushable: false,
            passable: true,
            blocksLos: false,
            init: function(){
                RL.Actions.Resolvable.add(this, 'open');
                RL.Actions.Resolvable.add(this, 'close');
            }
        }
    };

    root.RL.Furniture = Furniture;

}(this));
