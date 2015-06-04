(function(root) {
    'use strict';


    var newProto = {

            takeDamage: function(amount) {
                this.hp -= amount;

                if(this.hp <= 0) {
                    this.dead = true;
                }

                var splatter = amount / 10;
                if(this.dead){
                    splatter *= 1.5;
                }
                this.game.splatter(this.x, this.y, splatter);
            },
            getRandomAdjacentTile: function() {
                var directions = ['up', 'down', 'left', 'right'];
                var adjacent = [];

                for(var i = directions.length - 1; i >= 0; i--) {
                    var dir = directions[i];
                    var offset = RL.Util.getOffsetCoordsFromDirection(dir);
                    var adjTileX = this.x + offset.x;
                    var adjTileY = this.y + offset.y;
                    if(this.canMoveTo(adjTileX, adjTileY)) {
                        adjacent.push({
                            x: adjTileX,
                            y: adjTileY
                        });
                    }
                }

                if(adjacent.length) {
                    return RL.Random.arrayItem(adjacent);
                }
                return false;
            },
            isAdjacent: function(x, y) {
                // non-diagonal
                return(
                    (x === this.x && (y === this.y - 1 || y === this.y + 1)) ||
                    (y === this.y && (x === this.x - 1 || x === this.x + 1))
                );
            },
        getNextPathTile: function(x, y, ignoreExtra) {
                var path = this.getPathToTile(x, y, ignoreExtra);
                path.splice(0, 1);
                if(path[0] && path[0].x !== void 0 && path[0].y !== void 0) {
                    return path[0];
                }
            },
            getPathToTile: function(x, y, ignoreExtra) {
                var _this = this,
                    path = [],
                    computeCallback = function(x, y) {
                        path.push({
                            x: x,
                            y: y
                        });
                    },
                    passableCallback = function(x, y) {
                        // aStar.compute is much slower without this check
                        // this check creates a small chance that the first path tile will not actually be valid
                        if(_this.x === x && _this.y === y) {
                            return true;
                        }
                        var result = _this.canMoveTo(x, y, ignoreExtra);
                        return result;
                    },
                    // prepare path to given coords
                    aStar = new ROT.Path.AStar(x, y, passableCallback, {
                        topology: 4
                    });

                // compute from current tile coords
                aStar.compute(this.x, this.y, computeCallback);
                return path;
            },
            getConsoleName: function() {
                return {
                    name: this.name,
                    behavior: this.behavior,
                    color: this.consoleColor
                };
            },
            canMoveTo: function(x, y, ignoreExtra) {
                if(ignoreExtra) {
                    return this.game.entityCanMoveThrough(this, x, y, true);
                } else {
                    return this.game.entityCanMoveTo(this, x, y);
                }
            },
        knockBack: function(originX, originY, pushDistance){
                pushDistance = pushDistance || 1;
                var game = this.game;
                var target = this;
                // var distanceToTarget = RL.Util.getTileMoveDistance(originX, originY, this.x, this.y) - 1;
                // if(!distanceToTarget){
                //     distanceToTarget = 2;
                // }
                var lineDistance = pushDistance + 1;

                var canMoveToCheck = function(tile, x, y){
                    // skip target tile
                    if(x === target.x && y === target.y){
                        return false;
                    }
                    return !game.entityCanMoveTo(target, tile.x, tile.y);
                };

                var list = this.game.map.getLineThrough(originX, originY, this.x, this.y, canMoveToCheck, false, true, lineDistance);

                // remove first coord, it is the current position
                list.shift();

                if(list.length){
                    var lastCoord = list[list.length - 1];
                    if(!game.entityCanMoveTo(target, lastCoord.x, lastCoord.y)){
                        // remove last coord if target cannot move to it
                        list.pop();
                    }

                    if(list.length){
                        this._knockBackPath = list;
                        var destinationTile = list.pop();
                        this.game.knockBackLayer.push({
                            start: {x: this.x, y: this.y},
                            end: {x: destinationTile.x, y: destinationTile.y},
                            distance: list.length,
                        });

                        var ent = this.game.entityManager.get(destinationTile.x, destinationTile.y);

                        if(ent){
                            ent.knockBack(this.x, this.y);
                        }
                        if(this.canMoveTo(destinationTile.x, destinationTile.y)){
                            // throw new Error('cannot move');
                            this.moveTo(destinationTile.x, destinationTile.y);
                        }


                    }
                }
                // mark knockback tiles startin at target
                // var started = false;
                // for (var i = 0; i < list.length; i++) {
                //     var t = list[i];
                //     if(!started && t.x === target.x && t.y === target.y){
                //         started = true;
                //     }
                //     if(started){
                //         this.game.soundLayer.set(t.x, t.y, 'knockBack');
                //     }
                // }
                //
            },
        conditionDescription: function(){
                var hp = this.hp;
                var max = this.hpMax;
                if(hp < max){
                    var ratio = hp/max;

                    if(ratio > 0.75){
                        return 'injured';
                    }

                    if(ratio > 0.5){
                        return 'wounded';
                    }

                    if(ratio > 0.25){
                        return 'almost dead';
                    }
                }
                return 'unharmed';
            },
            knockDown: function(turns){
                this.behavior = 'knocked down';
                this.knockedDownCount += turns;
            },
        };


    RL.Util.merge(
        RL.Entity.prototype,
        RL.Mixins.Equipment,
        newProto
    );



}(this));
