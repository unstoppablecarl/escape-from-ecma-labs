(function() {
    'use strict';

    var proto = RL.Game.prototype;

    var NewGame = function Game(){
        proto.constructor.call(this);
        this.furnitureManager = new RL.MultiObjectManager(this, RL.Furniture);
        this.itemManager = new RL.ObjectManager(this, RL.Item);
        this.smashLayer = new RL.Array2d();
        this.damageLayer = new RL.Array2d();
    };

    var newGamePrototype = {
        constructor: NewGame,

        itemManager: null,

        furnitureManager: null,

        smashLayer: null,

        damageLayer: null,

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
                    if(this.player.dead){
                        console.log('game over');
                    }

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
            var item = this.itemManager.get(x, y);
            if(item && item.canAttachTo(entity)){
                item.attachTo(entity);
                this.itemManager.remove(item);
            }
        },

        entityCanSeeThrough: function(entity, x, y){
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
                result.push(item);
            }
            return result;
        },

        onClick: function(x, y){

            var coords = this.renderer.mouseToTileCoords(x, y),
                tile = this.map.get(coords.x, coords.y);
            if(!tile){
                return;
            }

            console.log('click', tile.x, tile.y);

            if(!this.player.fov.get(tile.x, tile.y)){
                return;
            }

            if(this.player.actionTargets && this.player.actionTargets.targets.length){
                var objects = this.getObjectsAtPostion(coords.x, coords.y);
                for(var i = objects.length - 1; i >= 0; i--){
                    var obj = objects[i];
                    var target = this.player.actionTargets.map.getFirst(tile.x, tile.y);
                    if(target){
                        this.player.actionTargets.setCurrent(target);
                        this.renderer.draw();
                        return;
                    }
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
                a.blood += Math.random() * amount;
            }
        },
    };

    RL.Util.merge(NewGame.prototype, proto);
    RL.Util.merge(NewGame.prototype, newGamePrototype);

    RL.Game = NewGame;

}());
