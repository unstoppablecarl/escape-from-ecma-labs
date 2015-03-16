(function(root) {
    'use strict';

    /**
    * Represents an equipment item
    * @class Equipment
    * @constructor
    * @uses TileDraw
    * @extends {Item}
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Type of tile. When created this object is merged with the value of Equipment.Types[type].
    * @param {Number} x - The map tile coordinate position of this tile on the x axis.
    * @param {Number} y - The map tile coordinate position of this tile on the y axis.
    */
    var Equipment = function Equipment(game, type, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;

        var typeData = Equipment.Types[type];
        RL.Util.merge(this, typeData);

        // copy from prototype
        this.equipableToSlots = [].concat(this.equipableToSlots);

        this.setResolvableAction('pickup');

        if(this.init){
            this.init(game, type, x, y);
        }
    };

    var equipmentPrototype = {
        constructor: Equipment,

        /**
         * The default slot to equip this item to when none is specified.
         * @type {String}
         */
        defaultSlot: 'left_hand',

        /**
         * Slots this item can be equipped to.
         * Values can only be a strings.
         * @see Equipment.copyEquipableToSlots
         * @type {Array}
         */
        equipableToSlots: [
            'left_hand',
            'right_hand',
        ],

        /**
         * Optional callback called when equipped.
         * @metod onEquip
         * @param {Equipment|False} equipment - The equipment being added.
         * @param {String} slot - The slot being equiped to.
         */
        onEquip: false,

        /**
         * Optional callback called when un-equipped.
         * @metod onUnEquip
         * @param {Equipment|False} equipment - The equipment being removed.
         * @param {String} slot - The slot being unequiped from.
         */
        onUnEquip: false,

        /**
         * Checks if this equipment can be equipped to given slot.
         * @method canEquipToSlot
         * @param {String} slot - The slot to check.
         * @return {Bool}
         */
        canEquipToSlot: function(slot){
            return this.equipableToSlots.indexOf(slot) !== -1;
        },
    };

    Equipment.prototype = RL.Util.merge({}, RL.Item.prototype, equipmentPrototype);

    var Defaults = {
        meleeWeapon: {
            itemType: 'weaponMelee',
            defaultSlot: 'weaponMelee',
            equipableToSlots: ['weaponMelee']
        },
        rangedWeapon: {
            itemType: 'weaponRanged',
            defaultSlot: 'weaponRanged',
            equipableToSlots: ['weaponRanged']
        }
    };

    var makeMeleeWeapon = function(obj){
        obj.statDesc = '[Damage: ' + obj.damage + ']';
        return RL.Util.merge(obj, Defaults.meleeWeapon);
    };

    var makeRangedWeapon = function(obj){
        obj.statDesc = '[Damage: ' + obj.damage + ', Range: ' + obj.range + ']';
        return RL.Util.merge(obj, Defaults.rangedWeapon);
    };

    Equipment.Types = {

        // enemy weapons
        claws: makeMeleeWeapon({
            name: 'Claws',
            color: false,
            bgColor: false,
            char: false,
            damage: 1,
        }),

        // melee weapons
        fists: makeMeleeWeapon({
            name: 'Fists',
            damage: 1,
        }),
        umbrella: makeMeleeWeapon({
            name: 'Umbrella',
            color: '#2c97de',
            bgColor: false,
            char: '☂',
            damage: 2,
        }),
        folding_chair: makeMeleeWeapon({
            name: 'Folding Chair',
            color: '#9c56b8',
            bgColor: false,
            char: '}',
            damage: 3,
        }),
        meat_tenderizer: makeMeleeWeapon({
            name: 'Meat Tenderizer',
            color: '#9c56b8',
            bgColor: false,
            char: '}',
            damage: 4,
        }),
        pointy_stick: makeMeleeWeapon({
            name: 'Pointy Stick',
            color: 'brown',
            bgColor: false,
            char: '/',
            damage: 5,
        }),
        wooden_baseball_bat: makeMeleeWeapon({
            name: 'Wooden Baseball Bat',
            color: 'brown',
            bgColor: false,
            char: '_',
            damage: 6,
        }),
        crowbar: makeMeleeWeapon({
            name: 'Crowbar',
            color: 'red',
            bgColor: false,
            char: '~',
            damage: 7,
        }),
        shovel: makeMeleeWeapon({
            name: 'Shovel',
            color: 'tan',
            bgColor: false,
            char: 'T',
            damage: 8,
        }),
        fire_axe: makeMeleeWeapon({
            name: 'Fire Axe',
            color: 'red',
            bgColor: false,
            char: 'r',
            damage: 9,
        }),
        chainsaw: makeMeleeWeapon({
            name: 'Chainsaw',
            color: 'red',
            bgColor: false,
            char: '*',
            damage: 10,
        }),


        // ranged weapons
        pistol: makeRangedWeapon({
            name: 'Pistol',
            color: '#808080',
            char: 'r',
            damage: 2,
            range: 5,
        }),
    };


    root.RL.Equipment = Equipment;

}(this));
