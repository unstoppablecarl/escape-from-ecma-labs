(function(root) {
    'use strict';

    root.RL.RendererLayer.Types = {
        map: {
            merge: true,
            cancelTileDrawWhenNotFound: true,
            // draw: true,
            getTileData: function(x, y){

                if(!this.game){
                    return false;
                }

                var tile = this.game.map.get(x, y);

                if(!tile || !tile.explored){
                    return false;
                }

                var tileData = tile.getTileDrawData();

                var targets = this.game.player.actionTargets;
                if(targets && targets.targets.length){

                    var borderColor = 'rgba(0, 200, 0, 0.5)',
                        borderColorSelected = 'rgba(0, 200, 0, 0.85)';

                    var current = targets.getCurrent(false);
                    var isCurrent = current && current.x === x && current.y === y;

                    if(isCurrent){
                        if(!targets.ignoreCurrent){
                            tileData.borderColor = borderColorSelected;
                            tileData.borderWidth = 2;
                        } else {
                            tileData.borderColor = borderColor;
                            tileData.borderWidth = 1;
                        }

                    } else {
                        var targetsAtTile = targets.map.get(x, y);
                        if(targetsAtTile.length){
                            tileData.borderColor = borderColor;
                            tileData.borderWidth = 1;
                        }
                    }
                }
                return tileData;
            }
        },
        furniture: {
            mergeWithPrevLayer: true,
            // draw: true,
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }

                var furniture = this.game.furnitureManager.get(x, y);

                if(furniture.length){

                    var f = furniture[furniture.length - 1];
                    var tileData = f.getTileDrawData();

                    if(f && f.dead){
                        tileData.color = 'red';
                        tileData.charStrokeColor = '#280000';
                    }
                    return tileData;
                }


                return false;
            }
        },
        item: {
            mergeWithPrevLayer: true,
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }
                var item = this.game.itemManager.get(x, y);
                if(item){
                    return item.getTileDrawData();
                }
                return false;
            }
        },
        entity: {
            mergeWithPrevLayer: true,
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }
                var player = this.game.player;
                var entity = false;
                if (
                    player &&
                    x === player.x &&
                    y === player.y
                ) {
                    entity = player;
                } else if(this.game.entityManager){
                    entity = this.game.entityManager.get(x, y);

                }

                if(
                    this.game.player &&
                    this.game.player.fov &&
                    !this.game.player.fov.get(x, y)
                ){
                    return false;
                }

                if(entity){

                    var tileData = entity.getTileDrawData();

                    var smash = this.game.smashLayer.get(x, y);
                    if(smash){

                        var offsetX,
                            offsetY,
                            smashChar = '✹',
                            smashColor = 'rgba(255, 255, 255, 0.75)';
                        if(smash.type === 'melee_attack'){
                            offsetX = (smash.targetX - smash.sourceX) * 0.5;
                            offsetY = (smash.targetY - smash.sourceY) * 0.5;
                        }
                        else if(smash.type === 'ranged_attack'){

                            var vx = (smash.targetX - smash.sourceX);
                            var vy = (smash.targetY - smash.sourceY);
                            var dis = Math.sqrt(vx * vx + vy * vy);
                            vx /= dis;
                            vy /= dis;

                            var targetX = Math.round(vx + smash.sourceX);
                            var targetY = Math.round(vy + smash.sourceY);

                            offsetX = (targetX - smash.sourceX) * 0.5;
                            offsetY = (targetY - smash.sourceY) * 0.5;

                            smashColor = 'rgba(255, 255, 0, 0.75)';
                        }

                        tileData.before = {
                            mask: true,
                            // x: smash.sourceX,
                            // y: smash.sourceY,
                            char: smashChar,
                            color: smashColor,
                            // color: 'rgba(255, 165, 0, 0)',
                            // fontSize: 30,
                            charStrokeWidth: 0.5,
                            // charStrokeColor: 'rgba(255,255,255,0.9)',
                            // color: 'rgba(255,255,255,0.5)',
                            offsetX: offsetX * this.game.renderer.tileSize,
                            offsetY: offsetY * this.game.renderer.tileSize
                        };
                    }



                    if(entity.hordePushBonus){
                        tileData.char = entity.hordePushBonus;
                    }

                    return tileData;
                }
                return false;
            }
        },
        lighting: {
            // this layer does mutate the prevTileData but not in the same way as merging
            mergeWithPrevLayer: false,
            draw: true,
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }
                if(this.game.lighting){
                    prevTileData = this.game.lighting.shadeTile(x, y, prevTileData);
                }
                return prevTileData;
            }
        },
        fov: {
            mergeWithPrevLayer: false,
            draw: true,
            beforeDraw: function(x, y, tileData, ctx){
                ctx.globalAlpha = this.game.renderer.nonVisibleTileAlpha;
            },
            afterDraw: function(x, y, tileData, ctx){
                ctx.globalAlpha = 1;
            },
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }
                if(
                    this.game.player &&
                    this.game.player.fov &&
                    this.game.player.fov.get(x, y)
                ){
                    return false;
                }

                return {
                    bgColor: this.game.renderer.bgColor
                };

            }
        },
        damage: {
            mergeWithPrevLayer: true,
            draw: false,
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }

                // change the bg color of the hovered tile
                var damage = this.game.damageLayer.get(x, y);
                if(damage){
                    return {
                        after: {
                            char: '*',
                            color: 'rgba(190, 5, 25, 1)',
                            charStrokeWidth: 1,
                            // charStrokeColor: 'rgba(250, 0, 0, 1)',
                            // color: 'rgba(255,255,255,0.5)',
                            offsetX: -0.1 * this.game.renderer.tileSize,
                            offsetY: -0.1 * this.game.renderer.tileSize
                        }
                    };
                }
                return false;
            }
        },

        hover: {
            mergeWithPrevLayer: true,
            draw: true,
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }
                // change the bg color of the hovered tile
                if(x == this.game.renderer.hoveredTileX && y == this.game.renderer.hoveredTileY){
                    return {
                        borderColor: 'green'
                    };
                }
                return false;
            }
        }
    };


}(this));
