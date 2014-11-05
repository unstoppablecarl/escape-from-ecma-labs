/* global RL */
(function(root) {
    'use strict';

    var Room = function Room(game, template, settings) {
        RL.MapGen.Template.call(this, game, template);

        RL.Util.merge(this, settings);
    };

    Room.prototype = {
        constructor: Room,

        game: null,

        template: null,


        defaultTileType: 'floor',
        defaultDoorFurnitureType: 'door',

        // get min max coord range to load to map
        // so that edges can be clipped for wall overlapping
        // getCoordRange: function(){
        //     var result = {
        //         xMin: 0,
        //         xMax: this.width,
        //         yMin: 0,
        //         yMax: this.height
        //     };

        //     var trimSides = this.placeholder.trimSides;
        //     if(trimSides.up){
        //         result.yMin += 1;
        //     }
        //     if(trimSides.down){
        //         result.yMax -= 1;
        //     }
        //     if(trimSides.left){
        //         result.xMin += 1;
        //     }
        //     if(trimSides.righ){
        //         result.xMax -= 1;
        //     }
        //     return result;
        // },

        loadToMap: function(){

            this.rotation = Math.floor(RL.Random.range(0, 3));

            var originX = this.x;
            var originY = this.y;
            RL.MapGen.Template.prototype.loadToMap.call(this, originX, originY);
        },

        placeDoors: function(){
            var sides = this.template.sides;
            if(sides){
                for(var side in sides){
                    if(this.trimSides[side]){
                        continue;
                    }
                    this.placeDoor(side);
                }
            }
        },

        placeDoor: function(side){
            var sideConfig = this.template.sides[side];

            if(!sideConfig.randomlyPlaceDoor){
                return;
            }
            // get room area type
            var area = this.template.area;
            var doorTemplate = RL.MapGen.Template.Door.getRandom(area);

            var settings = {
                side: side,
                doorFurnitureType: sideConfig.doorFurnitureType
            };

            var door = new RL.MapGen.Door(this.game, doorTemplate, settings);

            var offset = (sideConfig.offset || 0) + Math.ceil(door.width / 2);
            var coord = this.getRandomDoorCoord(side, this.width, this.height, offset);

            coord.x += this.x;
            coord.y += this.y;
            // this.game.map.set(coord.x, coord.y, 'door_placeholder');
            var settings = {
                side: side,
                centerX: coord.x,
                centerY: coord.y,
                doorFurnitureType: sideConfig.doorFurnitureType
            };

            var door = new RL.MapGen.Door(this.game, doorTemplate, settings);
            door.loadToMap();
        },


        getRangeFromSide: function(side){
            var x1, y1, x2, y2, tx, ty;

            if(side === 'left'){
                x1 = 0;
                y1 = 0;

                x2 = 0;
                y2 = this.height - 1;
            }
            else if(side === 'right'){
                x1 = this.width - 1;
                y1 = 0;

                x2 = this.width - 1;
                y2 = this.height - 1;
            }
            else if(side === 'up'){
                x1 = 0;
                y1 = 0;

                x2 = this.width - 1;
                y2 = 0;
            }
            else if(side === 'down'){
                x1 = 0;
                y1 = this.height - 1;

                x2 = this.width - 1;
                y2 = this.height - 1;
            }

            if(x1 > x2){
                tx = x1;
                ty = y1;

                x1 = x2;
                y1 = y2;

                x2 = tx;
                y2 = ty;
            }
            else if(x1 === x2){
                if(y1 > y2){
                    tx = x1;
                    ty = y1;

                    x1 = x2;
                    y1 = y2;

                    x2 = tx;
                    y2 = ty;
                }
            }

            return {
                x1: x1 + this.x,
                y1: y1 + this.y,

                x2: x2 + this.x,
                y2: y2 + this.y
            };
        },

        getDoorPlacementRanges: function(ranges){
            ranges = ranges || {};
            var sides = this.template.sides;
            if(sides){
                for(var side in sides){
                    if(sides[side].randomlyPlaceDoor){
                        var range = this.getRangeFromSide(side);
                        var key = range.x1 + ',' + range.y1 + ' ' + range.x2 + ',' + range.y2;

                        if(!ranges[key]){
                            ranges[key] = range;
                        }
                        var current = ranges[key];
                        current.roomSides = current.roomSides || {};
                        current.rooms = current.rooms || [];
                        if(current.rooms.indexOf(this) === -1){
                            current.rooms.push(this);
                            current.roomSides[side] = this;
                        }

                        if(side === 'left' || side === 'right'){
                            current.direction = 'vertical';
                        } else {
                            current.direction = 'horizontal';
                        }
                    }
                }
            }
            return ranges;
        },

    };

    Room.prototype = RL.Util.merge({}, RL.MapGen.Template.prototype, Room.prototype);

    root.RL.MapGen.Room = Room;

}(this));
