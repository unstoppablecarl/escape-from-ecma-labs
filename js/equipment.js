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
            knockBackRadius: 0,
            knockBackRadiusDamage: 0,
            knockDown: 0,
        },
        rangedWeapon: {
            itemType: 'weaponRanged',
            ammoType: null,
            ammoUsedPerAttack: 1,
            defaultSlot: 'weaponRanged',
            equipableToSlots: ['weaponRanged'],
            damage: 0,
            range: 0,
            splashRange: 0,
            splashDamage: 0,
            knockBack: 0,
            knockBackRadius: 0,
            knockBackRadiusDamage: 0,
            knockDown: 0,

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
            damageMod: 0,
            rangeMod: 0,
            splashDamageMod: 0,
            splashRangeMod: 0,
            knockBackMod: 0,
            knockBackRadiusMod: 0,
            knockBackRadiusDamageMod: 0,
            knockDownMod: 0,
        },
    };

    var makeStatsArr = function(stats, modifiers){
        modifiers = modifiers || false;
        var out = [];

        for(var key in stats){
            var val = stats[key];

            if(val){
                if(modifiers && val > 0){
                    val = '+' + val;
                }
                out.push({
                    key: key,
                    val: val
                });
            }
        }

        return out;
    };

    var makeStatsDesc = function(statsArr){
        var statDesc = [];

        for (var i = 0; i < statsArr.length; i++) {
            var stat = statsArr[i];
            var key = stat.key;
            var val = stat.val;
            statDesc.push(key + ': ' + val);
        }

        if(statDesc.length){
            return statDesc.join('<br>');
        }
    };

    var makeMeleeWeapon = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.meleeWeapon, newProto);

        var stats = {
            Damage: newProto.damage,
            'Knock Back': newProto.knockBack,
            'knock Back Radius': newProto.knockBackRadius,
            'knock Back Radius Damage': newProto.knockBackRadiusDamage,
            'Knock Down': newProto.knockDown,
            'Splash Damage': newProto.splashDamage,
            'Splash Range': newProto.splashRange,
        };

        var primaryStats = {
            'Item Type': 'Melee Weapon',
        };

        var secondaryStats = {
            Damage: newProto.damage,
            'Knock Back': newProto.knockBack,
            'knock Back Radius': newProto.knockBackRadius,
            'knock Back Radius Damage': newProto.knockBackRadiusDamage,
            'Knock Down': newProto.knockDown,
            'Splash Damage': newProto.splashDamage,
            'Splash Range': newProto.splashRange,
        };

        var statsArr = makeStatsArr(stats);
        var statsDesc = makeStatsDesc(statsArr);

        newProto.stats = statsArr;
        newProto.statDesc = statsDesc;

        newProto.primaryStats = makeStatsArr(primaryStats);
        newProto.secondaryStats = makeStatsArr(secondaryStats);

        return newProto;
    };

    var makeRangedWeapon = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.rangedWeapon, newProto);

        var stats = {
            'Ammo Type' : newProto.ammoType,
            Damage: newProto.damage,
            Range: newProto.range,
            'Knock Back': newProto.knockBack,
            'knock Back Radius': newProto.knockBackRadius,
            'knock Back Radius Damage': newProto.knockBackRadiusDamage,

            'Knock Down': newProto.knockDown,
            'Splash Damage': newProto.splashDamage,
            'Splash Range': newProto.splashRange,
        };

        var primaryStats = {
            'Item Type': 'Ranged Weapon',
            'Ammo Type' : newProto.ammoType,
        };

        var secondaryStats = {
            Damage: newProto.damage,
            Range: newProto.range,
            'Knock Back': newProto.knockBack,
            'knock Back Radius': newProto.knockBackRadius,
            'knock Back Radius Damage': newProto.knockBackRadiusDamage,
            'Knock Down': newProto.knockDown,
            'Splash Damage': newProto.splashDamage,
            'Splash Range': newProto.splashRange,
        };

        var statsArr = makeStatsArr(stats);
        var statsDesc = makeStatsDesc(statsArr);

        newProto.stats = statsArr;
        newProto.statDesc = statsDesc;

        newProto.primaryStats = makeStatsArr(primaryStats);
        newProto.secondaryStats = makeStatsArr(secondaryStats);

        return newProto;
    };

    var makeAmmo = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.ammo, newProto);

        var stats = {
            'Ammo Type' : newProto.ammoType,
            Damage: newProto.damageMod,
            Range: newProto.rangeMod,
            'Knock Back': newProto.knockBackMod,
            'knock Back Radius': newProto.knockBackRadiusMod,
            'knock Back Radius Damage': newProto.knockBackRadiusDamageMod,
            'Knock Down': newProto.knockDownMod,
            'Splash Damage': newProto.splashDamageMod,
            'Splash Range': newProto.splashRangeMod,
        };

        var primaryStats = {
            'Item Type': 'Ammo',
            'Ammo Type' : newProto.ammoType,
        };

        var secondaryStats = {
            Damage: newProto.damageMod,
            Range: newProto.rangeMod,
            'Knock Back': newProto.knockBackMod,
            'knock Back Radius': newProto.knockBackRadiusMod,
            'knock Back Radius Damage': newProto.knockBackRadiusDamageMod,

            'Knock Down': newProto.knockDownMod,
            'Splash Damage': newProto.splashDamageMod,
            'Splash Range': newProto.splashRangeMod,
        };

        var statsArr = makeStatsArr(stats);
        var statsDesc = makeStatsDesc(statsArr);

        newProto.stats = statsArr;
        newProto.statDesc = statsDesc;

        newProto.primaryStats = makeStatsArr(primaryStats);
        newProto.secondaryStats = makeStatsArr(secondaryStats);

        return newProto;
    };

    var makeArmor = function(newProto){
        newProto = RL.Util.merge({}, equipmentPrototype, Defaults.armor, newProto);
        var dodge = (newProto.dodgeChance * 100) + '%';
        var stats = {
            Dodge: dodge,
        };
        var primaryStats = {
            'Item Type': 'Armor',

        };

        var secondaryStats = {
            Dodge: dodge,
        };

        var statsArr = makeStatsArr(stats, true);
        var statsDesc = makeStatsDesc(statsArr);

        newProto.stats = statsArr;
        newProto.statDesc = statsDesc;

        newProto.primaryStats = makeStatsArr(primaryStats);
        newProto.secondaryStats = makeStatsArr(secondaryStats);

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
            knockBack: 3,
            knockBackRadius: 3,
            knockBackRadiusDamage: 1,
            knockDown: 3,
        }),

        // ammo
        grenade: makeAmmo({
            name: 'Grenade',
            ammoType: 'thrown',
            color: '#808080',
            char: 'g',
            damageMod: 2,
            splashRangeMod: 1,
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
            knockBackMod: 2,
            knockBackRadiusMod: 2,
            knockDownMod: 2,
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
