(function(root) {
    'use strict';

    var merge = RL.Util.merge;

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
                range: 1,
                limitToFov: false,
                limitToNonDiagonalAdjacent: true,
                filter: function(target){
                    return _this.canPerformActionOnTarget(action, target, settings);
                }
            };
            var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
            return validTargetsFinder.getValidTargets();
        };
    };

    var PerformableActionTypes = {

        open: makePerformableAction({
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(target){
                this.game.console.logOpen(this, target);
                return true;
            },
            getTargetsForAction: makeAdjacentTargetsFinder('open')
        }),

        close: makePerformableAction({
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(target){
                this.game.console.logClose(this, target);
                return true;
            },
            getTargetsForAction: makeAdjacentTargetsFinder('close')
        }),

        push: makePerformableAction({
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: true,
            getTargetsForAction: makeAdjacentTargetsFinder('push')
        }),

        grab: makePerformableAction({
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
                    range: 1,
                    limitToFov: false,
                    limitToNonDiagonalAdjacent: true,
                    filter: function(target){
                        return _this.canPerformActionOnTarget('grab', target, settings);
                    }
                };
                var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
                var result = validTargetsFinder.getValidTargets();
                return result;
            }
        }),

        melee_attack: makePerformableAction({
            canPerformAction: function(settings){
                if(!this.meleeWeapon){
                    this.game.console.log('you do not have a melee weapon');
                    return false;
                }
                return true;
            },
            canPerformActionOnTarget: true,
            performAction: function(target, settings){
                return {
                    damage: this.meleeWeapon.damage,
                    weapon: this.meleeWeapon
                };
            },
            getTargetsForAction: makeAdjacentTargetsFinder('melee_attack')
        }),

        ranged_attack: makePerformableAction({
            canPerformAction: function(settings){
                if(!this.rangedWeapon){
                    this.game.console.log('you do not have a ranged weapon');
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
                return {
                    damage: this.rangedWeapon.damage,
                    weapon: this.rangedWeapon
                };
            },
            getTargetsForAction: function(settings){
                var _this = this;
                var validTargetsSettings = {
                    range: this.rangedWeapon.range,
                    limitToFov: true,
                    filter: function(target){
                        return _this.canPerformActionOnTarget('ranged_attack', target, settings);
                    }
                };
                var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
                return validTargetsFinder.getValidTargets();
            }
        }),

        horde_push_bonus: makePerformableAction({
            initialize: function(){
                this.hordePushBonus = 0;
            },
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(source, settings){
                settings.hordePushBonus = this.meleeWeapon.damage + this.hordePushBonus;
                return true;
            }
        }),
    };

    PerformableActionTypes.zombie_melee_attack = merge(
        {},
        PerformableActionTypes.melee_attack,
        {
            performAction: function(target, settings){
                var damage = this.meleeWeapon.damage;
                var targetIsFurniture = target instanceof RL.Furniture;
                if(targetIsFurniture && this.hordePushBonus){
                    damage += this.hordePushBonus;
                    this.hordePushBonus = 0;
                }
                return {
                    damage: damage,
                    weapon: this.meleeWeapon
                };
            },
        }
    );

    var ResolvableActionTypes = {

        grab: makeResolvableleAction({
            canResolveAction: true,
            resolveAction: true,
        }),

        open: makeResolvableleAction({
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
        }),

        close: makeResolvableleAction({
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
        }),

        push: makeResolvableleAction({
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
        }),

        melee_attack: makeResolvableleAction({
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
                return true;
            },
        }),

        ranged_attack: makeResolvableleAction({
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
        }),

        horde_push_bonus: makeResolvableleAction({
            initialize: function(){
                this.hordePushBonus = 0;
            },
            canResolveAction: true,
            resolveAction: function(source, settings){
                this.hordePushBonus += settings.hordePushBonus;
                return true;
            }
        })
    };

    root.RL.PerformableAction.Types = PerformableActionTypes;
    root.RL.ResolvableAction.Types = ResolvableActionTypes;

}(this));
