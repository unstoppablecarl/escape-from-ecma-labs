(function(root) {
    'use strict';

    var types = {
        INTEGER: 'INTEGER',
        PERCENT: 'PERCENT',
        BOOLEAN: 'BOOLEAN',
        STRING: 'STRING',
    };

    var defaultStatObj = {
        key: null,
        type: types.INTEGER, // integer, percent, string
        displayName: null,
        defaultValue: null,
        description: null,
        validValues: null,
        formatter: function(value){
            if(this.type === types.PERCENT){
                return (value * 100) + '%';
            }
            return value;
        },
    };

    var Stats = {
        stats: {},
        defaultStatObj: defaultStatObj,
        statTypes: types,
        add: function(key, statObj){
            this.stats[key] = RL.Util.merge({}, this.defaultStatObj, statObj);
        }
    };

    var statData = {
        // ITEMS
        itemType: {
            displayName: 'Item Type',
            description: 'The type of Item',
            type: types.STRING,
            validValues: ['weaponRanged', 'weaponMelee', 'armor', 'ammo', 'healing'],
            formattedValues: {
                weaponRanged: 'Ranged Weapon',
                weaponMelee: 'Melee Weapon',
                armor: 'Armor',
                ammo: 'Ammo',
                healing: 'Healing',
            },
            formatter: function(value){
                if(this.formattedValues[value]){
                    value = this.formattedValues[value];
                }
                return value;
            }
        },

        healAmount: {
            displayName: 'Heal Amount',
            description: 'Amount healed when using item',
        },

        // AMMO
        ammoType: {
            displayName: 'Ammo Type',
            description: 'The type of Ammo',
            type: types.STRING,
        },

        // WEAPONS
        range: {
            displayName: 'Range',
            description: 'Range attack may be performed from in tiles from source',
        },
        damage: {
            displayName: 'Damage',
            description: 'Amount of damage inflicted',
        },
        knockBack: {
            displayName: 'knock Back',
            description: 'How far target is knocked back away from attacker',
        },
        knockDown: {
            displayName: 'knock Down',
            description: 'How long the target will be knocked down',
        },
        aoe_Radius: {
            displayName: 'Area of Effect Radius',
            description: 'Distance from target in tiles, that will be affected by attack',
        },
        aoe_Damage: {
            displayName: 'Area of Effect Damage',
            description:  'Amount of damage inflicted on targets within the Area of Effect',
        },
        aoe_KnockBack: {
            displayName: 'Area of Effect Knock Back',
            description: 'How far targets within the Area of Effect are knocked back',
        },
        aoe_KnockDown: {
            displayName: 'Area of Effect Knock Down',
            description: 'How long the targets within the Area of Effect will be knocked down for',
        },
        aoe_KnockBackOrigin: {
            displayName: 'Area of Effect Knock Down',
            description: 'What direction targets in the Area of Effect are knocked back from (target / source of attack)',
            validValues: ['source', 'target'],
            type: types.STRING,
        },

        // WEAPON MODS
        rangeMod: {
            displayName: 'Range',
            description: 'Range attack may be performed from in tiles from source',
        },
        damageMod: {
            displayName: 'Damage',
            description: 'Amount of damage inflicted',
        },
        knockBackMod: {
            displayName: 'knock Back',
            description: 'How far target is knocked back away from attacker',
        },
        knockDownMod: {
            displayName: 'knock Down',
            description: 'How long the target will be knocked down',
        },
        aoe_RadiusMod: {
            displayName: 'Area of Effect Radius',
            description: 'Distance from target in tiles, that will be affected by attack',
        },
        aoe_DamageMod: {
            displayName: 'Area of Effect Damage',
            description:  'Amount of damage inflicted on targets within the Area of Effect',
        },
        aoe_KnockBackMod: {
            displayName: 'Area of Effect Knock Back',
            description: 'How far targets within the Area of Effect are knocked back',
        },
        aoe_KnockDownMod: {
            displayName: 'Area of Effect Knock Down',
            description: 'How long the targets within the Area of Effect will be knocked down for',
        },
        aoe_KnockBackOriginMod: {
            displayName: 'Area of Effect Knock Down',
            description: 'What direction targets in the Area of Effect are knocked back from (target / source of attack)',
        },

        // ARMOR
        dodgeChance: {
            displayName: 'Dodge Chance',
            description: 'Percent chance to avoid attack',
            type: types.PERCENT,

        }
    };

    for(var key in statData){
        var val = statData[key];
        Stats.add(key, val);
    }

    RL.Stats = Stats;

}(this));
