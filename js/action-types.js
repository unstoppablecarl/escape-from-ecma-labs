(function(root) {
    'use strict';

    var merge = RL.Util.merge;

    var PerformableActionTypes = {};
    var ResolvableActionTypes = {};

    var makePerformableAction = function(obj){
        return merge({}, RL.PerformableAction, obj);
    };

    var makeResolvableleAction = function(obj){
        return merge({}, RL.ResolvableAction, obj);
    };

    var makeAdjacentTargetsFinder = function(action){
        return function(settings){
            var _this = this;
            var validTargetsSettings = {
                x: this.x,
                y: this.y,
                range: 1,
                limitToFov: false,
                limitToNonDiagonalAdjacent: true,
                filter: function(target){
                    return _this.canPerformActionOnTarget(action, target, settings);
                }
            };
            var validTargetsFinder = new RL.ValidTargetsFinder(this.game, validTargetsSettings);
            var result = validTargetsFinder.getValidTargets();
            return result;
        };
    };

    var makeActionTypePair = function (settings){
        var action = settings.action;
        var performable = settings.performable;
        var resolvable = settings.resolvable;

        PerformableActionTypes[action] = makePerformableAction(performable);
        ResolvableActionTypes[action] = makeResolvableleAction(resolvable);
    };

    makeActionTypePair({
        action: 'open',

        performable: {
            performAction: function(target){
                this.game.console.logOpen(this, target);
                return true;
            },
            getTargetsForAction: makeAdjacentTargetsFinder('open')
        },

        resolvable: {
            canResolveAction: function(source, settings){
                return !this.open;
            },
            resolveAction: function(source, settings){
                this.passable = true;
                this.blocksLos = false;
                this.open = true;
                this.char = "'";
                return true;
            },
        }
    });

    makeActionTypePair({
        action: 'close',

        performable: {
            performAction: function(target){
                this.game.console.logClose(this, target);
                return true;
            },
            getTargetsForAction: makeAdjacentTargetsFinder('close')
        },

        resolvable: {
            canResolveAction: function(source, settings){
                if(!this.open){
                    return false;
                }
                // prevent closing door on entity
                var entity = this.game.entityManager.get(this.x, this.y);
                if(entity){
                    console.log('prevent closing door on entity');
                    return false;
                }
                return true;

            },
            resolveAction: function(source, settings){
                this.passable = false;
                this.blocksLos = true;
                this.open = false;
                this.char = "+";
                return true;
            },
        }
    });

    makeActionTypePair({
        action: 'push',

        performable: {
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(target){

                // if grabbing an object already
                // and pushing another object
                // let go of the grabbed object
                if(this.grabTarget && this.grabTarget !== target){
                    this.game.console.logGrabLetGo(this, this.grabTarget);
                    this.grabTarget = false;
                }
                return true;
            },
            getTargetsForAction: makeAdjacentTargetsFinder('push')
        },

        resolvable: {
            canResolveAction: function(source, settings){
                var pusherX = source.x,
                    pusherY = source.y,
                    directionX = this.x - pusherX,
                    directionY = this.y - pusherY,
                    targetX = this.x + directionX,
                    targetY = this.y + directionY;

                return this.canMoveTo(targetX, targetY);
            },
            resolveAction: function(source, settings){
                var prevX = this.x,
                    prevY = this.y,
                    pusherX = source.x,
                    pusherY = source.y,
                    directionX = this.x - pusherX,
                    directionY = this.y - pusherY,
                    targetX = this.x + directionX,
                    targetY = this.y + directionY;

                // push target source into tile
                this.moveTo(targetX, targetY);
                if(source.canMoveTo(prevX, prevY)){
                    // move player into previously occupied tile
                    source.moveTo(prevX, prevY);
                }
                return true;
            }
        }
    });

    makeActionTypePair({
        action: 'grab',

        performable: {
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(target, settings){
                if(this.grabTarget){
                    this.game.console.logGrabLetGo(this, this.grabTarget);
                    this.grabTarget = false;
                    return false;
                }

                this.grabTarget = target;
                this.game.console.logGrab(this, target);
            },
            getTargetsForAction: function(settings){
                if(this.grabTarget){
                    return [{
                        x: this.grabTarget.x,
                        y: this.grabTarget.y,
                        value: this.grabTarget,
                    }];
                }
                var _this = this;
                var validTargetsSettings = {
                    x: this.x,
                    y: this.y,
                    range: 1,
                    limitToFov: false,
                    limitToNonDiagonalAdjacent: true,
                    filter: function(target){
                        return _this.canPerformActionOnTarget('grab', target, settings);
                    }
                };
                var validTargetsFinder = new RL.ValidTargetsFinder(this.game, validTargetsSettings);
                var result = validTargetsFinder.getValidTargets();
                return result;
            }
        },

        resolvable: {
            canResolveAction: true,
            resolveAction: true,
        }
    });


    makeActionTypePair({
        action: 'pickup',

        performable: {
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(target, settings){
                return {};
            },
            getTargetsForAction: makeAdjacentTargetsFinder('pickup')
        },

        resolvable: {
            resolveAction: function(source, settings){
                this.game.itemManager.remove(this);
                source.inventory.add(this);
                this.game.console.logPickUp(source, this);
                return true;
            },
        },
    });


    makeActionTypePair({
        action: 'melee_attack',

        performable: {
            canPerformAction: function(settings){
                if(!this.equipment.weaponMelee){
                    this.game.console.log('you do not have a melee weapon');
                    return false;
                }
                return true;
            },
            performAction: function(target, settings){
                var weaponMelee = this.equipment.weaponMelee;
                return {
                    damage: weaponMelee.damage,
                    weapon: weaponMelee,
                    knockBack: weaponMelee.knockBack
                };
            },
            getTargetsForAction: makeAdjacentTargetsFinder('melee_attack')
        },

        resolvable: {
            canResolveAction: true,
            resolveAction: function(source, settings){
                var result = settings.result;

                this.takeDamage(result.damage);

                var weapon = {
                    name: result.weapon.name,
                    damage: result.damage,
                    knockBack: result.knockBack
                };
                this.game.console.logAttack(source, weapon, this);

                var smash = {
                    source: source,
                    target: this,
                    type: 'melee_attack',
                    targetX: this.x,
                    targetY: this.y,
                    sourceX: source.x,
                    sourceY: source.y
                };
                this.game.smashLayer.set(source.x, source.y, smash);

                if(this.bleeds){
                    var splatter = result.damage / 10;
                    if(this.dead){
                        splatter *= 1.5;
                    }
                    this.game.splatter(this.x, this.y, splatter);
                }
                var target = this;
                if(weapon.knockBack){
                    console.log('weapon.knockBack', weapon.knockBack);
                    target.knockBack(source.x, source.y, weapon.knockBack);
                }
                return true;
            },
        }
    });
    // alternate melee_attack implementation
    PerformableActionTypes.melee_attack_zombie = merge(
        {},
        PerformableActionTypes.melee_attack,
        {
            performAction: function(target, settings){
                var damage = this.equipment.weaponMelee.damage;
                var targetIsFurniture = target instanceof RL.Furniture;
                if(targetIsFurniture && this.hordePushBonus){
                    damage += this.hordePushBonus;
                    this.hordePushBonus = 0;
                }
                if(this.attackSoundChance){
                    var outOfFov = !this.game.player.fov.get(this.x, this.y);
                    if(outOfFov){
                        if(Math.random() < this.attackSoundChance){
                            this.game.soundLayer.set(this.x, this.y, 'melee');
                        }
                    }
                }
                return {
                    damage: damage,
                    weapon: this.equipment.weaponMelee
                };
            },
        }
    );


    makeActionTypePair({
        action: 'ranged_attack',

        performable: {
            getTargetsForAction: function(settings){
                var _this = this;
                var weaponRanged = this.equipment.weaponRanged;
                var ammo = this.equipment.ammo;
                var range = weaponRanged.range;

                if(ammo){
                    range += ammo.rangeMod;
                }
                var validTargetsSettings = {
                    x: this.x,
                    y: this.y,
                    limitToFov: this.fov,
                    range: range,
                    filter: function(target){
                        return _this.canPerformActionOnTarget('ranged_attack', target, settings);
                    }
                };
                var validTargetsFinder = new RL.ValidTargetsFinder(this.game, validTargetsSettings);
                return validTargetsFinder.getValidTargets();
            },
            canPerformAction: function(settings){
                var weapon = this.equipment.weaponRanged;
                var ammo = this.equipment.ammo;

                if(!weapon){
                    this.game.console.log('You do not have a ranged weapon');
                    return false;
                }

                if(weapon.ammoType && !ammo){
                    this.game.console.log('You do not have ammo equipped for your ranged weapon');
                    return false;
                }

                if(weapon.ammoUsedPerAttack && ammo.ammoQuantity < weapon.ammoUsedPerAttack){
                    this.game.console.log('You do not have enough ammo to fire your ranged weapon (ammo used per attack: ' + weapon.ammoUsedPerAttack + ' )');
                    return false;
                }

                return true;
            },
            canPerformActionOnTarget: function(target, settings){
                if(!this.fov.get(target.x, target.y)){
                    return false;
                }
                // range has already been checked by validTargets
                return true;
            },
            performAction: function(target, settings){
                var weaponRanged = this.equipment.weaponRanged;
                var ammo = this.equipment.ammo;
                var damage = weaponRanged.damage;
                var range = weaponRanged.range;
                var splashRange = weaponRanged.splashRange;
                var splashDamage = weaponRanged.splashDamage;
                var knockBack = weaponRanged.knockBack;

                if(ammo){
                    damage += ammo.damageMod;
                    range += ammo.rangeMod;
                    splashRange += ammo.splashRangeMod;
                    splashDamage += ammo.splashDamageMod;
                    knockBack += ammo.knockBackMod;
                }

                return {
                    weapon: weaponRanged,
                    ammo: ammo,

                    damage: damage,
                    range: range,
                    splashRange: splashRange,
                    splashDamage: splashDamage,
                    knockBack: knockBack,
                };
            },

            afterPerformActionSuccess: function(target, settings){
                var x = target.x;
                var y = target.y;

                var result = settings.result;

                var splashDamage = result.splashDamage;
                var splashRange = result.splashRange;
                var knockBack = result.knockBack;

                var newSettings = {
                    result: {
                        weapon: {
                            name: 'Explosion',
                            damage: splashDamage
                        },
                        damage: splashDamage
                    }
                };
                var source = this;
                if(splashRange){


                    var validTargetsFinder = new RL.ValidTargetsFinder(this.game, {
                        x: x,
                        y: y,
                        limitToFov: false,
                        range: splashRange,
                        prepareValidTargets: false,
                        includeTiles: true,
                        filter: function(obj){
                            if(obj instanceof RL.Tile) {
                                return obj.type === 'wall';
                            }
                            return obj.canResolveAction && obj.canResolveAction('ranged_attack', source, newSettings);
                        }
                    });
                    var adjacentTargets = validTargetsFinder.getValidTargets();

                    if(adjacentTargets && adjacentTargets.length){
                        for(var i = adjacentTargets.length - 1; i >= 0; i--){
                            var newTarget = adjacentTargets[i];
                            if(newTarget instanceof RL.Tile){
                                if(newTarget.type === 'wall'){
                                    this.game.map.remove(newTarget.x, newTarget.y);
                                    this.game.map.set(newTarget.x, newTarget.y, 'floor');
                                }
                            } else {
                                newTarget.resolveAction('ranged_attack', source, newSettings);
                            }
                        }
                    }
                }

                if(knockBack){
                    target.knockBack(source.x, source.y, knockBack);
                }
            },
            afterPerformAction: function(target, settings){
                var result = settings.result;
                if(result.weapon.ammoType){
                    var ammoUsedPerAttack = result.weapon.ammoUsedPerAttack;
                    if(ammoUsedPerAttack){
                        this.useAmmo(ammoUsedPerAttack);
                    }
                }
            },
        },

        resolvable: {
            canResolveAction: true,
            resolveAction: function(source, settings){
                var result = settings.result;

                this.takeDamage(result.damage);

                var weapon = {
                    name: result.weapon.name,
                    damage: result.damage
                };
                this.game.console.logAttack(source, weapon, this);

                var smash = {
                    source: source,
                    target: this,
                    type: 'ranged_attack',
                    targetX: this.x,
                    targetY: this.y,
                    sourceX: source.x,
                    sourceY: source.y
                };

                this.game.smashLayer.set(source.x, source.y, smash);
                this.game.damageLayer.set(this.x, this.y, 1);

                if(this.bleeds){
                    var splatter = result.damage / 10;
                    if(this.dead){
                        splatter *= 1.5;
                    }
                    this.game.splatter(this.x, this.y, splatter);
                }
                return true;
            },
        }
    });

    makeActionTypePair({
        action: 'horde_push_bonus',

        performable: {
            init: function(){
                this.hordePushBonus = 0;
            },
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(source, settings){
                settings.hordePushBonus = this.equipment.weaponMelee.damage + this.hordePushBonus;
                return true;
            }
        },

        resolvable: {
            init: function(){
                this.hordePushBonus = 0;
            },
            canResolveAction: true,
            resolveAction: function(source, settings){
                this.hordePushBonus += settings.hordePushBonus;
                return true;
            }
        }
    });

    makeActionTypePair({
        action: 'use_item',

        performable: {},

        resolvable: {
            resolveAction: function(source, settings){
                source.inventory.remove(this);
                this.use(source);
                this.game.console.logItemUse(source, this);
                return true;
            },
        }
    });

    // alternate use_item implementation
    ResolvableActionTypes.use_item_healing = makeResolvableleAction({
        canResolveAction: function(source, settings){
            if(source.hp === source.hpMax){
                this.game.console.logCanNotUseHealing(source, this);
                return false;
            }
            return true;
        },
        resolveAction: function(source, settings){
            source.inventory.remove(this);
            this.use(source);
            this.game.console.logItemUseHeal(source, this);
            return true;
        },
    });

    // makeActionTypePair({
    //     action: 'equip_item',

    //     performable: {
    //         init: function(){
    //             this.equipment = {
    //                 armor: null,
    //                 weaponMelee: null,
    //                 weaponRanged: null,
    //                 ammo: null,
    //             };
    //         },
    //         canPerformActionOnTarget: function(target, settings){
    //             settings = settings || {};
    //             var equipment = target;
    //             var slot = settings.slot || equipment.defaultSlot || equipment.equipableToSlots[0];

    //             if (!(slot in this.equipment)) {
    //                 console.log('Equipment "' + equipment.name + '" cannot be equiped to slot "' + slot + '" (slot does not exist)');
    //                 return false;
    //             }

    //             return true;
    //         },
    //         performAction: function(target, settings){
    //             settings = settings || {};
    //             var equipment = target;
    //             var slot = settings.slot || equipment.defaultSlot || equipment.equipableToSlots[0];
    //             var current = this.equipment[slot];
    //             if(current){
    //                 this.performAction('un_equip_item', current, {slot: slot});
    //             }

    //             if (slot === 'weaponRanged' && this.equipment.ammo) {
    //                 this.performAction('un_equip_item', this.equipment.ammo, {slot: 'ammo'});
    //             }

    //             if (slot === 'ammo') {
    //                 // combind ammo into 1 object with ammoQuantity
    //                 var ammoOfSameType = this.inventory.getByType(equipment.type);
    //                 this.inventory.removeMultiple(ammoOfSameType);
    //                 equipment.ammoQuantity = 1 + ammoOfSameType.length;
    //                 return true;
    //             }

    //             if(equipment.onEquip){
    //                 equipment.onEquip(this, slot);
    //             }

    //             this.equipment[slot] = equipment;

    //             return true;
    //         }
    //     },

    //     resolvable: {
    //         canResolveAction: function(source, settings){
    //             var slot = settings.slot || this.defaultSlot || this.equipableToSlots[0];
    //             if (!this.canEquipToSlot(slot)) {
    //                 this.game.console.log('Equipment "' + this.name + '" cannot be equiped to slot "' + slot + '" (cannot equip to slot)');
    //                 return false;
    //             }
    //             return true;
    //         }
    //     }
    // });

    // makeActionTypePair({
    //     action: 'un_equip_item',

    //     performable: {

    //         canPerformActionOnTarget: function(target, settings){
    //             var equipment = target;

    //             for (var slotKey in this.equipment) {
    //                 var equipped = this.equipment[slotKey];
    //                 if (equipment === equipped) {
    //                     return true;
    //                 }
    //             }

    //             settings = settings || {};
    //             var slot = settings.slot || equipment.defaultSlot || equipment.equipableToSlots[0];

    //             if (!(slot in this.equipment)) {
    //                 console.log('Equipment "' + equipment.name + '" cannot be equiped to slot "' + slot + '" (slot does not exist)');
    //                 return false;
    //             }

    //             return true;
    //         },
    //         performAction: function(target, settings){
    //             settings = settings || {};
    //             var equipment = target;
    //             var slot = settings.slot || equipment.defaultSlot || equipment.equipableToSlots[0];
    //             this.performAction('un_equip', this.equipment[slot], {slot: slot});

    //             this.equipment[slot] = void 0;

    //             if (slot === 'weaponRanged' && this.equipment.ammo) {
    //                 this.performAction('un_equip', this.equipment.ammo, {slot: 'ammo'});
    //             }

    //             if (slot === 'ammo') {
    //                 // break ammo into separate objects
    //                 var quantity = equipment.ammoQuantity;
    //                 if (quantity) {
    //                     this.inventory.addByType(equipment.type, quantity);
    //                 }
    //             } else {
    //                 this.inventory.add(equipment);
    //             }

    //             return true;
    //         }
    //     },

    //     resolvable: {
    //         canResolveAction: function(source, settings){
    //             var slot = settings.slot || this.defaultSlot || this.equipableToSlots[0];
    //             if (!this.canEquipToSlot(slot)) {
    //                 console.log('Equipment "' + this.name + '" cannot be equiped to slot "' + slot + '" (cannot equip to slot)');
    //                 return false;
    //             }
    //             return true;
    //         }
    //     }
    // });




    root.RL.PerformableAction.Types = PerformableActionTypes;
    root.RL.ResolvableAction.Types = ResolvableActionTypes;

}(this));
