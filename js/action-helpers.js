(function(root) {
    'use strict';

    var ActionHelpers = {

        getTargetsWithinRadius: function(game, x, y, radius){
            var validTargetsFinder = new RL.ValidTargetsFinder(game, {
                x: x,
                y: y,
                limitToFov: false,
                range: radius,
                prepareValidTargets: false,
            });
            return validTargetsFinder.getValidTargets();
        },
        aoeDamage: function(source, targets, aoe_Damage){
            var newSettings = {
                result: {
                    weapon: {
                        name: 'Explosion',
                        damage: aoe_Damage
                    },
                    damage: aoe_Damage
                }
            };

            targets.forEach(function(target){
                if(target.resolveAction){
                    target.resolveAction('ranged_attack', source, newSettings);
                }
            });
        },
        aoeKnockBack: function(source, target, targets, aoe_Radius, aoe_KnockBack, aoe_KnockBackOrigin){
            aoe_KnockBackOrigin = aoe_KnockBackOrigin || 'target';
            var ox, oy;
            if(aoe_KnockBackOrigin === 'source'){
                ox = source.x;
                oy = source.y;
            } else if(aoe_KnockBackOrigin === 'target'){
                ox = target.x;
                oy = target.y;
            }
            var targetDistances = this.targetsByDistance(ox, oy, targets);

            for (var i = 0; i < targetDistances.length; i++) {
                var td = targetDistances[i];

                this.doKnockBack(td.target, ox, oy, aoe_KnockBack);
                // console.log(td.target.x, td.target.y);
                // td.target.char = i + '';
            }
            // game.knockBackRadius(ox, oy, aoe_KnockBack, aoe_Radius);
        },
        doKnockDown: function(target, knockDownCount){
            if(target.knockDown){
                target.knockDown(knockDownCount);
            }
        },
        doKnockBack: function(target, x, y, knockBackDistance){
            if(target.knockBack){
                target.knockBack(x, y, knockBackDistance);
            }
        },
        resolveEffects: function(source, target, settings){
            var game = source.game;
            var result = settings.result;
            var knockDown = result.knockDown;
            var knockBack = result.knockBack;
            var aoe_Radius = result.aoe_Radius;
            var aoe_Damage = result.aoe_Damage;
            var aoe_KnockBack = result.aoe_KnockBack;
            var aoe_KnockDown = result.aoe_KnockDown;
            var aoe_KnockBackOrigin = result.aoe_KnockBackOrigin;

            var x = target.x;
            var y = target.y;

            if(knockBack){
                this.doKnockBack(target, source.x, source.y, knockBack);
            }

            if(knockDown && target.knockDown){
                this.doKnockDown(target, knockDown);
            }

            if(!aoe_Radius){
                return;
            }

            var targets = this.getTargetsWithinRadius(game, x, y, aoe_Radius);

            if(aoe_Damage){
                this.aoeDamage(source, targets, aoe_Damage);
            }

            if(aoe_KnockBack){
                this.aoeKnockBack(source, target, targets, aoe_Radius, aoe_KnockBack, aoe_KnockBackOrigin);
            }

            if(aoe_KnockDown){
                var doKnockDown = this.doKnockDown;
                targets.forEach(function(target){
                    doKnockDown(target, aoe_KnockDown);
                });
            }
        },

        targetsByDistance: function(x, y, targets){
            var targetDistances = targets.map(function(target){
                var distance = RL.Util.getDistance(x, y, target.x, target.y);

                return {
                    target: target,
                    distance: distance
                };
            });

            targetDistances.sort(function (a, b) {
                if (b.distance > a.distance) {
                    return 1;
                }
                if (b.distance < a.distance) {
                    return -1;
                }
                return 0;
            });

            return targetDistances;
        },
        doSmash: function(source, target, settings, type) {

            var smash = {
                source: source,
                target: target,
                type: type,
                targetX: target.x,
                targetY: target.y,
                sourceX: source.x,
                sourceY: source.y
            };

            target.game.smashLayer.set(source.x, source.y, smash);
            target.game.damageLayer.set(target.x, target.y, 1);
        }
    };


    RL.ActionHelpers = ActionHelpers;

}(this));
