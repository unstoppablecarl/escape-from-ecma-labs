(function(root) {
    'use strict';

    root.RL.Entity.Types = {
        zombie: {
            name: 'Zombie',
            char: 'z',
            color: RL.Util.COLORS.red,
            bgColor: false,
            charStrokeColor: '#000',
            charStrokeWidth: 2,

            consoleColor: RL.Util.COLORS.red_alt,

            playerLastSeen: false,

            turnsSinceStumble: 0,
            maxTurnsWithoutStumble: 10,

            hp: 3,
            hpMax: 3,

            hordePushBonus: 0,

            bleeds: true,

            initialize: function() {
                this.meleeWeapon = new RL.Item(this.game, 'claws');
                RL.Actions.Resolvable.add(this, 'ranged_attack');
                RL.Actions.Resolvable.add(this, 'melee_attack');
                RL.Actions.Resolvable.add(this, 'horde_push_bonus');

                RL.Actions.Performable.add(this, 'melee_attack');
                RL.Actions.Performable.add(this, 'horde_push_bonus');
            },

            takeDamage: function(amount) {
                this.hp -= amount;
                if(this.hp <= 0) {
                    this.dead = true;
                }
            },

            update: function() {
                var result = this._update();
                this.hordePushBonus = 0;
                return result;
            },
            /**
             * Called every turn by the entityManger (entity turns are triggered after player actions are complete)
             * @method update
             */
            _update: function() {

                var stumbleChance = this.turnsSinceStumble / this.maxTurnsWithoutStumble;
                if(this.turnsSinceStumble && Math.random() < stumbleChance) {
                    this.turnsSinceStumble = 0;
                    return true;
                }
                this.turnsSinceStumble++;

                this.updatePlayerLastSeen();

                if(this.isAdjacent(this.game.player.x, this.game.player.y)) {
                    return this.performAction('melee_attack', this.game.player);
                }

                var destination;
                if(this.playerLastSeen) {
                    destination = this.getNextPathTile(this.playerLastSeen.x, this.playerLastSeen.y);

                    if(!destination) {
                        // get next path tile ignoring furniture and entities
                        destination = this.getNextPathTile(this.playerLastSeen.x, this.playerLastSeen.y, true);
                        if(destination) {
                            var _this = this;
                            var furniture = this.game.furnitureManager.getFirst(destination.x, destination.y, function(furniture) {
                                return !furniture.passable && _this.canPerformActionOnTarget('melee_attack', furniture);
                            });

                            if(furniture && this.performAction('melee_attack', furniture)) {
                                return true;
                            }

                            var entity = this.game.entityManager.get(destination.x, destination.y);
                            if(entity && this.performAction('horde_push_bonus', entity)) {
                                return true;
                            }
                        }
                    }
                }

                if(!destination) {
                    destination = this.getRandomAdjacentTile();
                }

                if(destination) {
                    this.moveTo(destination.x, destination.y);
                    return true;
                }
            },

            updatePlayerLastSeen: function() {
                if(this.playerVisible()) {
                    this.playerLastSeen = {
                        x: this.game.player.x,
                        y: this.game.player.y
                    };
                }

                // if reached player last seen at tile clear it
                if(this.playerLastSeen &&
                    this.x === this.playerLastSeen.x &&
                    this.y === this.playerLastSeen.y
                ) {
                    this.playerLastSeen = false;
                }
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

                if(adjacent && adjacent.length) {
                    return adjacent[Math.floor(Math.random() * adjacent.length)];
                }
                return false;
            },

            isAdjacent: function(x, y) {
                return(
                    (x === this.x && (y === this.y - 1 || y === this.y + 1)) ||
                    (y === this.y && (x === this.x - 1 || x === this.x + 1))
                );
            },

            playerVisible: function() {
                return this.game.player.fov.get(this.x, this.y);
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
                        if(_this.x === x && _this.y === y) {
                            return true;
                        }
                        return _this.canMoveTo(x, y, ignoreExtra);
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
        },
    };

    /*
        zombie types

            marketing
            developer
            project manager
            middle manager
            designer
            IT
            DBA

            security
            maintenance

    */

}(this));
