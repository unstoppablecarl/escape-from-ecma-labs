(function(root) {
    'use strict';

	var entId = 0;

    /**
    * Represents an entity in the game. Usually a character or enemy.
    * Manages state (position, health, stats, etc)
    * Occupies a single game map tile.
    * @class Entity
    * @constructor
    * @uses TileDraw
    * @param {Game} game - Game instance this obj is attached to.
    * @param {String} type - Type of entity. When created this object is merged with the value of Entity.Types[type].
    */
    var Entity = function Entity(game, settings) {
        this.game = game;

        this.id = entId++;

        if(this.init){
            this.init(game, settings);
        }
    };

    Entity.prototype = {
        constructor: Entity,

        /**
        * Game instance this object is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
         * Unique id for this entity.
         * @type {Number}
         */
        id: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of Entity.Types[type].
        * @property type
        * @type String
        */
        type: null,

        /**
        * Called when the entity is first created. Intended to be assigned by Entity.Types.
        * @method init
        * @param {Game} game - Game instance this obj is attached to.
        * @param {String} type - Type of entity. When created this object is merged with the value of Entity.Types[type].
        */
        init: false,

        /**
        * Name used when referencing or describing this entity.
        * Used in console messages.
        * @property name
        * @type String
        */
        name: null,

        /**
        * The x map tile coord of this entity.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The y map tile coord of this entity.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this entity.
        * @property char
        * @type String
        */
        char: 'x',

        /**
        * The color of the character displayed when rendering this entity. Not rendered if false.
        * @property color
        * @type String|bool
        */
        color: '#fff',

        /**
        * The background color the character displayed when rendering this entity. Not rendered if false.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,

        /**
        * Determines if this entity has been killed and needs to be removed.
        * @property dead
        * @type bool
        */
        dead: false,

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
        * Called after a player action has been resolved. Resolves this entities turn.
        * @method update
        */
        update: function() {

        },

        /**
        * Checks if an entity can move through a map tile.
        * Convenience method for this.game.canMoveThrough()
        * @method canMoveThrough
        * @param {Number} x - The tile map x coord to check if this entity can move to.
        * @param {Number} y - The tile map y coord to check if this entity can move to.
        * @return {Bool}
        */
        canMoveThrough: function(x, y){
            return this.game.entityCanMoveTo(this, x, y);
        },

        /**
        * Checks if an entity can move through and into a map tile and that tile is un-occupied.
        * Convenience method for this.game.entityCanMoveTo()
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
        * Convenience method for this.game.entityMoveTo()
        * this.canMoveTo() and/or this.canMoveThrough() should always be checked before calling this.moveTo()
        * @method moveTo
        * @param {Number} x - The tile map x coord to move to.
        * @param {Number} y - The tile map y coord to move to.
        */
        moveTo: function(x, y) {
            return this.game.entityMoveTo(this, x, y);
        },

        /**
        * Checks if a map tile can be seen through.
        * Convenience method for this.game.entityCanSeeThrough()
        * @method canSeeThrough
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        canSeeThrough: function(x, y){
            return this.game.entityCanSeeThrough(this, x, y);
        },

        /**
        * Handles the behavior of a player or other entity attempting to move into the tile coord this entity is currently occupying.
        * @method bump
        * @param {Player|Entity} entity - The player or entity attempting to move into this entity's tile.
        * @return {Bool} true if bumping this entity completes the action of the bumping entity.
        */
        bump: function(entity){
            return false;
        },
    };

    RL.Util.merge(
        Entity.prototype,
        RL.Mixins.TileDraw,
        RL.Mixins.PerformableActionInterface,
        RL.Mixins.ResolvableActionInterface
    );

    /**
    * Describes different types of entities. Used by the Entity constructor 'type' param.
    *
    *     Entity.Types = {
    *         zombie: {
    *            name: 'Zombie',
    *            char: 'z',
    *            color: 'red',
    *            bgColor: '#222'
    *         },
    *         // ...
    *     }
    *
    * @class Entity.Types
    * @static
    */
    var entityTypes = {
        zombie: {
            name: 'Zombie',
            char: 'z',
            color: 'red',
            bgColor: false,
        },
    };

    RL.Entity = Entity;

    RL.Entity.Types = {};

    RL.Entity.addType = function(type, objProto){
        objProto.type = type;
        var ObjConstructor = RL.Util.compose(Entity, objProto);
        RL.Entity.Types[type] = ObjConstructor;
    };

    RL.Entity.make = function(game, type, settings){
        var Type = RL.Entity.Types[type];
        return new Type(game, settings);
    };

    for(var type in entityTypes){
        var objProto = entityTypes[type];
        RL.Entity.addType(type, objProto);
    }

}(this));
