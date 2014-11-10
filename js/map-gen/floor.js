/* global RL */
(function(root) {
    'use strict';

    var Floor = function Floor(game, template) {
        RL.MapGen.Template.call(this, game, template);
        this.rooms = [];
    };

    Floor.prototype = {
        constructor: Floor,

        game: null,

        rooms: null,

        roomOriginChar: 'r',
        roomPlaceholderChar: 'x',
        loadToMap: function(){

            this.game.setMapSize(this.width, this.height);
            RL.MapGen.Template.prototype.loadToMap.call(this);

            var _this = this;

            var area = this.template.area;

            this.game.map.each(function(value, x, y){
                if(value && value.type === 'room_placeholder_origin'){
                    var settings = _this.getRoomSettings(x, y);
                    var roomTemplate = RL.MapGen.Template.Room.getRandom(area);
                    var room = new RL.MapGen.Room(_this.game, roomTemplate, settings);
                    _this.rooms.push(room);
                }
            });
            // console.log(this.rooms);
        },

        placeRooms: function(){

            var i, room,
                rooms = this.rooms;

            for(i = rooms.length - 1; i >= 0; i--){
                room = rooms[i];
                room.loadToMap();
            }

            var getKeyOf = function(obj, value){
                for(var key in obj){
                    if(obj[key] === value){
                        return key;
                    }
                }
            };

            var ranges = this.getRandomDoorRanges();
            for(var key in ranges){
                var range = ranges[key];
                room = RL.Random.arrayItem(range.rooms);
                var roomSide = getKeyOf(range.roomSides, room);
                var area = room.template.area;
                var doorTemplate = RL.MapGen.Template.Door.getRandom(area);

                var settings = {
                    direction: range.direction,
                    doorFurnitureType: room.template.sides[roomSide].doorFurnitureType
                };

                var door = new RL.MapGen.Door(this.game, doorTemplate, settings);

                var offset = (room.template.sides[roomSide].offset || 0) + Math.ceil(door.width * 0.5);
                var coord = this.getRandomCoordFromRange(range, offset);

                door.centerX = coord.x;
                door.centerY = coord.y;

                door.loadToMap();
            }
        },


        getRandomCoordFromRange: function(range, offset){
            var x, y, min, max;

            if(range.direction === 'vertical'){
                x = range.x1;

                if(range.y1 <= range.y2){
                    min = range.y1;
                    max = range.y2;
                } else {
                    min = range.y2;
                    max = range.y1;
                }

                min += offset;
                max -= offset;

                y = Math.floor(RL.Random.range(min, max));

            } else {
                y = range.y1;

                if(range.x1 <= range.x2){
                    min = range.x1;
                    max = range.x2;
                } else {
                    min = range.x2;
                    max = range.x1;
                }

                min += offset;
                max -= offset;

                x = Math.floor(RL.Random.range(min, max));
            }
            return {
                x: x,
                y: y
            };
        },

        getRandomDoorRanges: function(){
            var i,
                rooms = this.rooms,
                ranges = {};

            for(i = rooms.length - 1; i >= 0; i--){
                var room = rooms[i];
                room.getDoorPlacementRanges(ranges);
            }
            return ranges;
        },

        getRoomSettings: function(ox, oy){
            var width = 20;
            var height = 20;

            var out = {
                x: ox,
                y: oy,
                width: width,
                height: height,
                adjacent: {
                    left: null,
                    right: null,
                    up: null,
                    down: null
                },
                adjacentResolved: [],
                trimSides: {}
            };

            var _this = this;

            var checkSide = function(side, placeholder){
                var offset = RL.Util.DIRECTIONS_TO_OFFSETS[side];
                var ox, oy;

                if(side === 'left' || side === 'up'){
                    ox = placeholder.x;
                    oy = placeholder.y;
                } else {
                    ox = placeholder.x + placeholder.width - 1;
                    oy = placeholder.y + placeholder.height - 1;
                }

                var dx = ox + offset.x;
                var dy = oy + offset.y;
                var tile = _this.game.map.get(dx, dy);

                if(tile && tile.type === 'room_placeholder' || tile.type === 'room_placeholder_origin'){
                    return 'room';
                }

                if(tile && tile.passable){
                    return 'hallway';
                }
                return false;
            };

            out.sides = {
                left: checkSide('left', out),
                up: checkSide('up', out),
                down: checkSide('down', out),
                right: checkSide('right', out),
            };

            return out;
        },
    };

    Floor.prototype = RL.Util.merge({}, RL.MapGen.Template.prototype, Floor.prototype);


    root.RL.MapGen.Floor = Floor;

}(this));
