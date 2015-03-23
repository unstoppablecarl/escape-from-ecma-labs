(function(root) {
    'use strict';

    var equipmentPrototype = {

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
         * @param {EquipmentManager} manager - The manager the equipment is being added to.
         * @param {String} slot - The slot being equiped to.
         */
        onEquip: false,

        /**
         * Optional callback called when un-equipped.
         * @metod onUnEquip
         * @param {EquipmentManager} manager - The manager the equipment is being removed from.
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

        use: false,

        init: function(game, type){
            // copy from prototype
            this.equipableToSlots = [].concat(this.equipableToSlots);

            this.setResolvableAction('pickup');
        }
    };

    // Equipment.prototype = RL.Util.merge({}, RL.Item.prototype, equipmentPrototype);

    var Defaults = {
        meleeWeapon: {
            itemType: 'weaponMelee',
            defaultSlot: 'weaponMelee',
            equipableToSlots: ['weaponMelee'],
            damage: 0,
        },
        rangedWeapon: {
            itemType: 'weaponRanged',
            ammoType: null,
            defaultSlot: 'weaponRanged',
            equipableToSlots: ['weaponRanged'],
            damage: 0,
            range: 0,
            splashRange: 0,
            splashDamage: 0,

            canUseAmmo: function(ammo){
                return ammo.ammoType === this.ammoType;
            }
        },
        ammo: {
            itemType: 'ammo',
            defaultSlot: 'ammo',
            equipableToSlots: ['ammo'],

            consoleColor: 'yellow',

            ammoType: null,
            damageMod: 0,
            rangeMod: 0,
            splashDamageMod: 0,
            splashRangeMod: 0,
        },
    };

    var makeMeleeWeapon = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.meleeWeapon, newProto);

        newProto.statDesc = '[Damage: ' + newProto.damage + ']';
        return newProto;
    };

    var makeRangedWeapon = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.rangedWeapon, newProto);

        newProto.statDesc = '[Damage: ' + newProto.damage + ', Range: ' + newProto.range + ']';
        return newProto;
    };

    var makeAmmo = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.ammo, newProto);

        var mods = {};
        if(newProto.damageMod){
            mods.Damage = newProto.damageMod;
        }
        if(newProto.rangeMod){
            mods.Range = newProto.rangeMod;
        }
        if(newProto.splashDamageMod){
            mods['Splash Damage'] = newProto.splashDamageMod;
        }
        if(newProto.splashRangeMod){
            mods['Splash Range'] = newProto.splashRangeMod;
        }

        var statDesc = [];
        for(var key in mods){
            var val = mods[key];
            if(val > 0){
                val = '+' + val;
            }
            statDesc.push(key + ': ' + val);
        }

        if(statDesc.length){
            newProto.statDesc = '[' + statDesc.join(', ') + ']';
        }
        return newProto;

        // var itemConstructor = RL.Util.compose(Equipment, newProto);
        // return itemConstructor;
    };

    var itemTypes = {

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
            name: 'Pistol 9mm',
            ammoType: '9mm',
            color: '#808080',
            char: 'r',
            damage: 2,
            range: 5,

        }),

        grenade: makeRangedWeapon({
            name: 'Grenade',
            color: '#808080',
            char: 'g',
            damage: 2,
            range: 5,
            splashRange: 1,
            splashDamage: 1,
        }),

        'ammo_9mm': makeAmmo({
            name: '9mm',
            ammoType: '9mm',
            color: 'yellow',
            char: '"',
            damageMod: 2,
            rangeMod: 1,
        }),

        'ammo_45cal': makeAmmo({
            name: '45cal',
            ammoType: '45cal',
            color: 'yellow',
            char: '"',
            damageMod: 2,
            rangeMod: 1,
        }),
    };

    for(var type in itemTypes){
        var objProto = itemTypes[type];
        RL.Item.addType(type, objProto);
    }

}(this));
