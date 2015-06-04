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

                if(td.target.x === source.x && td.target.y === source.y){
                    continue;
                }

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
        doKnockBack: function(target, originX, originY, knockBackDistance, cascade){
            var game = target.game;
            cascade = cascade === void 0 ? true : cascade;
            // game.knockBackLayer2.push({
            //     start: {x: originX, y: originY},
            //     end: {x: target.x, y: target.y},
            // });
            var lineDistance = knockBackDistance + 1;

            var canMoveToCheck = function(tile, x, y){
                // skip target tile
                if(x === target.x && y === target.y){
                    return false;
                }
                return !game.entityCanMoveTo(target, tile.x, tile.y);
            };

            var list = game.map.getLineThrough(originX, originY, target.x, target.y, canMoveToCheck, false, true, lineDistance);

            var last = list[list.length - 1];
            game.knockBackLayer.push({
                start: {x: target.x, y: target.y},
                end: {x: last.x, y: last.y},
                distance: knockBackDistance,
            });

            // remove first coord, it is the current position
            list.shift();

            if(list.length){

                var max = 10;
                var i = 0;
                while(i < max && list.length){
                    i++;
                    var next = list[0];
                    // if(next.x === target.x && next.y === target.y){
                    //     console.log("XXXX")
                    // }
                    var ent = game.entityManager.get(next.x, next.y);
                    if(ent && cascade){
                        // game.knockBackLayer2.push({
                        //     start: {x: target.x, y: target.y},
                        //     end: {x: ent.x, y: ent.y},
                        //     distance: list.length,
                        // });
                        var distance = list.length;
                        this.doKnockBack(ent, target.x, target.y, distance, false);
                    }

                    if(target.canMoveTo(next.x, next.y)){
                        var destinationTile = list.shift();



                        target.moveTo(destinationTile.x, destinationTile.y);

                    } else {
                        break;
                    }

                }
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

            if(knockDown && target.knockDown){
                this.doKnockDown(target, knockDown);
            }

            if(aoe_Radius){
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
            }
            if(knockBack){
                this.doKnockBack(target, source.x, source.y, knockBack);
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
