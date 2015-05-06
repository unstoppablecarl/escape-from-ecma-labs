(function() {
    'use strict';

    var proto = RL.Game.prototype;

    var NewGame = function Game(){
        proto.constructor.call(this);
        this.miniMap = new RL.Renderer(this, null, null, 2, 'mini-map');

        this.renderer.miniMap = this.miniMap;

        var game = this;

        this.furnitureManager = new RL.MultiObjectManager(this, RL.Furniture);
        this.furnitureManager.makeNewObjectFromType = function(type){
            return RL.Furniture.make(game, type);
        };
        this.itemManager = new RL.MultiObjectManager(this, RL.Item);
        this.itemManager.makeNewObjectFromType = function(type){
            return RL.Item.make(game, type);
        };

        this.smashLayer = new RL.Array2d();
        this.damageLayer = new RL.Array2d();
        this.soundLayer = new RL.Array2d();

        this.knockBackLayer = [];
    };

    var newGamePrototype = {
        constructor: NewGame,

        itemManager: null,

        furnitureManager: null,

        smashLayer: null,

        damageLayer: null,

        miniMap: null,

        showDoorPlacementDebug: false,

        /**
        * Handles user input actions.
        * @method onKeyAction
        * @param {String} action - Action triggered by user input.
        */
        onKeyAction: function(action) {
            if(!this.gameOver){
                var result = this.player.update(action);
                if(result){

                    this.entityManager.update();
                    this.player.updateFov();

                    this.lighting.update();
                    this.renderer.setCenter(this.player.x, this.player.y);
                    this.renderer.draw();

                    this.smashLayer.reset();
                    this.damageLayer.reset();
                    this.soundLayer.reset();
                    if(this.player.dead){
                        this.console.log('Game Over');
                    }

                    // for (var i = 0; i < this.entityManager.objects.length; i++) {
                    //     var ent = this.entityManager.objects[i];
                    //     var existing = this.entityManager.get(ent.x, ent.y);

                    //     if(ent !== existing ){
                    //         var x = 1;
                    //     }
                    // }
                } else if(this.queueDraw){
                    this.renderer.draw();
                }
                this.furnitureManager.update();
            }
            this.queueDraw = false;
        },

        setMapSize: function(width, height){
            proto.setMapSize.call(this, width, height);
            this.itemManager.setSize(width, height);
            this.furnitureManager.setSize(width, height);
            this.smashLayer.setSize(width, height);
            this.damageLayer.setSize(width, height);
            this.soundLayer.setSize(width, height);
            this.miniMap.resize(width, height);
        },

        entityCanMoveThrough: function(entity, x, y, ignoreFurniture){
            ignoreFurniture = ignoreFurniture !== void 0 ? ignoreFurniture : false;
            if(!ignoreFurniture){
                var furniture = this.furnitureManager.getFirst(x, y, function(furniture){
                    return !furniture.passable;
                });
                if(furniture){
                    return false;
                }
            }

            return proto.entityCanMoveThrough.call(this, entity, x, y);
        },

        /**
        * Checks if an entity can move through and into a map tile and that tile is un-occupied.
        * @method entityCanMoveTo
        * @param {Entity} entity - The entity to check.
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        entityCanMoveTo: function(entity, x, y, ignoreFurniture){
            if(!this.entityCanMoveThrough(entity, x, y, ignoreFurniture)){
                return false;
            }
            // check if occupied by entity
            if(this.entityManager.get(x, y)){
                return false;
            }
            return true;
        },
        entityMoveTo: function(entity, x, y){
            if(entity.bleeds){
                var hpRatio = entity.hp / entity.hpMax;
                var bleedChance = ( 1 - hpRatio) * 0.5;
                if(hpRatio < 1 && Math.random() < bleedChance){
                    this.map.get(entity.x, entity.y).blood += bleedChance * 0.5;
                }
            }
            proto.entityMoveTo.call(this, entity, x, y);

            if(entity === this.player){
                var items = this.itemManager.get(x, y);
                if(items && items.length){
                    for(var i = items.length - 1; i >= 0; i--){
                        var item = items[i];
                        entity.performAction('pickup', item);
                    }
                }
            }
            else {
                if(entity.moveSoundChance){
                    var outOfFov = !this.player.fov.get(x, y);
                    if(outOfFov){
                        if(Math.random() < entity.moveSoundChance){
                            this.soundLayer.set(x, y, 'move');
                        }
                    }
                }
            }
        },

        entityCanSeeThrough: function(entity, x, y){
            if(this.disableFov){
                return true;
            }
            var tile = this.map.get(x, y);
            if(!tile || tile.blocksLos){
                return false;
            }
            var furniture = this.furnitureManager.getFirst(x, y, function(furniture){
                return furniture.blocksLos;
            });

            if(furniture){
                return false;
            }
            return true;
        },

        getObjectsAtPostion: function(x, y){
            var result = [];

            var entity = this.entityManager.get(x, y);
            if(entity){
                result.push(entity);
            }
            var furniture = this.furnitureManager.get(x, y);
            if(furniture){
                result = result.concat(furniture);
            }
            var item = this.itemManager.get(x, y);
            if(item){
                result = result.concat(item);
            }
            return result;
        },

        onClick: function(x, y){

            var coords = this.renderer.mouseToTileCoords(x, y),
                tile = this.map.get(coords.x, coords.y);
            if(!tile){
                return;
            }

            console.log('click', tile.x, tile.y, this.getObjectsAtPostion(tile.x, tile.y));

            if(!this.player.fov.get(tile.x, tile.y)){
                return;
            }

            if(this.player.actionTargets && this.player.actionTargets.targets.length){
                var target = this.player.actionTargets.objectManager.getFirst(tile.x, tile.y);
                if(target){
                    this.player.actionTargets.setCurrent(target);
                    this.renderer.draw();
                    return;
                }
            }

            this.console.logTileInspect(tile, this.getObjectsAtPostion(tile.x, tile.y));
        },

        onHover: function(){

        },

        splatter: function(x, y, amount){
            var tile = this.map.get(x, y);
            tile.blood += amount;
            var adj = this.map.getAdjacent(x, y);
            for(var i = adj.length - 1; i >= 0; i--){
                var a = adj[i];
                if(a){
                    a.blood += Math.random() * amount;
                }
            }
        },

        knockBackRadius: function(x, y, radius, pushDistance){
            var settings = {
                radius: radius,
                filter: function(val){
                    return val;
                }
            };

            var ent = this.entityManager.get(x, y);

            if(ent){
                ent.immobilized = true;
            }

            var targets = this.entityManager.map.getWithinSquareRadius(x, y, settings);

            var getTargetsByDistance = function(targets){
                // console.log(x, y, 'targets', targets);
                var targetDistances = [];

                for (var i = 0; i < targets.length; i++) {
                    var target = targets[i];
                    // target.knockedDown = true;
                    target.immobilized = true;
                    target.color = 'green';

                    var distance = RL.Util.getDistance(x, y, target.x, target.y);

                    targetDistances.push({
                        target: target,
                        distance: distance
                    });
                }

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
            };

            var targetDistances = getTargetsByDistance(targets);

            for (var i = 0; i < targetDistances.length; i++) {
                var td = targetDistances[i];
                // console.log(td.target.x, td.target.y);
                // td.target.char = i + '';
                if(td.target.knockBack){
                    td.target.knockBack(x, y, pushDistance);
                }
            }
            // this.renderer.draw();

        }
    };

    RL.Util.merge(NewGame.prototype, proto);
    RL.Util.merge(NewGame.prototype, newGamePrototype);

    RL.Game = NewGame;

}());
