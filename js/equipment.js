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
         * @param {Entity} entity - The entity the equipment is being added to.
         * @param {String} slot - The slot being equiped to.
         */
        onEquip: false,

        /**
         * Optional callback called when un-equipped.
         * @metod onUnEquip
         * @param {Entity} entity - The entity the equipment is being removed from.
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



    var Defaults = {
        meleeWeapon: {
            itemType: 'weaponMelee',
            defaultSlot: 'weaponMelee',
            equipableToSlots: ['weaponMelee'],
            damage: 0,
            knockBack: 0,
            knockDown: 0,
            aoe_Radius: 0,
            aoe_Damage: 0,
            aoe_KnockBack: 0,
            aoe_KnockDown: 0,
            aoe_KnockBackOrigin: 'target',
        },
        rangedWeapon: {
            itemType: 'weaponRanged',
            ammoType: null,
            ammoUsedPerAttack: 1,
            defaultSlot: 'weaponRanged',
            equipableToSlots: ['weaponRanged'],
            range: 0,
            damage: 0,
            knockBack: 0,
            knockDown: 0,
            aoe_Radius: 0,
            aoe_Damage: 0,
            aoe_KnockBack: 0,
            aoe_KnockDown: 0,
            aoe_KnockBackOrigin: 'target',

            canUseAmmo: function(ammo){
                return (!this.ammoType) || ammo.ammoType === this.ammoType;
            }
        },
        armor: {
            itemType: 'armor',
            defaultSlot: 'armor',
            equipableToSlots: ['armor'],
            consoleColor: 'blue',
            dodgeChance: 0,
        },
        ammo: {
            itemType: 'ammo',
            defaultSlot: 'ammo',
            equipableToSlots: ['ammo'],
            char: '"',
            consoleColor: 'yellow',

            ammoType: null,
            rangeMod: 0,
            damageMod: 0,
            knockBackMod: 0,
            knockDownMod: 0,
            aoe_RadiusMod: 0,
            aoe_DamageMod: 0,
            aoe_KnockBackMod: 0,
            aoe_KnockDownMod: 0,
            aoe_KnockBackOriginMod: null,
        },
    };


    var makeStatsArray = function(stats, newProto){
        var out = [];

        for (var i = 0; i < stats.length; i++) {
            var key = stats[i];
            var val = newProto[key];

            if(val){
                var meta = RL.Stats.stats[key];
                var displayName = meta.displayName;
                val = meta.formatter(val);
                out.push({
                    key: displayName,
                    val: val
                });
           }
        }
        return out;
    };

    var makeMeleeWeapon = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.meleeWeapon, newProto);

        var primaryStats = [
            'itemType',
        ];

        var secondaryStats = [
            'damage',
            'range',
            'knockBack',
            'knockDown',
            'aoe_Radius',
            'aoe_Damage',
            'aoe_KnockBack',
            'aoe_KnockDown',
            'aoe_KnockBackOrigin',
        ];

        newProto.primaryStats = makeStatsArray(primaryStats, newProto);
        newProto.secondaryStats = makeStatsArray(secondaryStats, newProto);

        return newProto;
    };

    var makeRangedWeapon = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.rangedWeapon, newProto);

        var primaryStats = [
            'itemType',
            'ammoType'
        ];
        var secondaryStats = [
            'damage',
            'range',
            'knockBack',
            'knockDown',
            'aoe_Radius',
            'aoe_Damage',
            'aoe_KnockBack',
            'aoe_KnockDown',
            'aoe_KnockBackOrigin',
        ];

        newProto.primaryStats = makeStatsArray(primaryStats, newProto);
        newProto.secondaryStats = makeStatsArray(secondaryStats, newProto);

        return newProto;
    };

    var makeAmmo = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.ammo, newProto);

        var primaryStats = [
            'itemType',
            'ammoType'
        ];

        var secondaryStats = [
            'damage',
            'range',
            'knockBack',
            'knockDown',
            'aoe_Radius',
            'aoe_Damage',
            'aoe_KnockBack',
            'aoe_KnockDown',
            'aoe_KnockBackOrigin',
        ];

        newProto.primaryStats = makeStatsArray(primaryStats, newProto);
        newProto.secondaryStats = makeStatsArray(secondaryStats, newProto);

        return newProto;
    };

    var makeArmor = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.armor, newProto);
        var primaryStats = [
            'itemType',
        ];

        var secondaryStats = [
            'dodgeChance',
        ];

        newProto.primaryStats = makeStatsArray(primaryStats, newProto);
        newProto.secondaryStats = makeStatsArray(secondaryStats, newProto);

        return newProto;
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
            knockBack: 2,
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

        'throw': makeRangedWeapon({
            name: 'Throw',
            ammoType: 'thrown',
            damage: 0,
            range: 8,
        }),

        pistol_9mm: makeRangedWeapon({
            name: 'Pistol 9mm',
            ammoType: '9mm',
            color: '#808080',
            char: 'r',
            damage: 2,
            range: 10,
            knockBack: 2,
            knockDown: 4,
        }),

        pistol_45cal: makeRangedWeapon({
            name: 'Pistol 45cal',
            ammoType: '45cal',
            color: '#808080',
            char: 'r',
            damage: 2,
            range: 12,
            knockBack: 2,
        }),

        shock_cannon: makeRangedWeapon({
            name: 'Shock Cannon',
            ammoType: 'shock_cartridge',
            char: 's',
            damage: 1,
            range: 14,
            knockDown: 3,
            knockBack: 3,
            aoe_Radius: 3,
            aoe_Damage: 1,

            aoe_KnockBack: 3,
            aoe_KnockDown: 2,

        }),

        // ammo
        grenade: makeAmmo({
            name: 'Grenade',
            ammoType: 'thrown',
            color: '#808080',
            char: 'g',
            damageMod: 2,
            splashDamageRadiusMod: 1,
            splashDamageMod: 1,
        }),

        shock_grenade: makeAmmo({
            name: 'Shock Grenade',
            ammoType: 'thrown',
            color: '#808080',
            char: 'g',
            damageMod: 1,
            knockBackMod: 3,
            knockBackRadiusMod: 3,
            knockDownMod: 3,
        }),

        ammo_9mm: makeAmmo({
            name: '9mm',
            ammoType: '9mm',
        }),

        ammo_45cal: makeAmmo({
            name: '45cal',
            ammoType: '45cal',
        }),

        ammo_shock_cannon: makeAmmo({
            name: 'Shock Cartridge',
            ammoType: 'shock_cartridge',
        }),

        ammo_shock_cannon_thumper: makeAmmo({
            name: 'Shock Cartridge [Thumper]',
            ammoType: 'shock_cartridge',


            knockDownMod: 2,
            knockBackMod: 2,

            aoe_RadiusMod: 2,
            aoe_Damage: 1,

            aoe_KnockBackMod: 2,
            aoe_KnockDownMod: 2,
            aoe_KnockBackOrigin: 'source',
        }),

        // armor
        heavy_coat: makeArmor({
            name: 'Heavy Coat',
            dodgeChance: 0.5,
        })
    };

    for(var type in itemTypes){
        var objProto = itemTypes[type];
        RL.Item.addType(type, objProto);
    }

}(this));
