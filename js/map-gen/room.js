/* global RL */
(function(root) {
    'use strict';

    var Room = function Room(game, template, settings) {
        RL.MapGen.Template.call(this, game, template);
        settings = settings || {};
        RL.Util.merge(this, settings);
        this.edgesBySide = {};

        this.x = settings.x;
        this.y = settings.y;

        this.width = 20; // settings.width
        this.height = 20; // settings.height

        this.sides = {
            left: this.checkSide('left'),
            up: this.checkSide('up'),
            down: this.checkSide('down'),
            right: this.checkSide('right'),
        };
    };

    Room.prototype = {
        constructor: Room,

        game: null,

        x: null,
        y: null,
        width: null,
        height: null,
        template: null,

        sides: null,


        defaultTileType: 'floor',
        defaultDoorFurnitureType: 'door',

        edgesBySide: null,

        checkSide: function(side){
            var offset = RL.Util.DIRECTIONS_TO_OFFSETS[side];
            var ox, oy;

            if(side === 'left' || side === 'up'){
                ox = this.x;
                oy = this.y;
            } else {
                ox = this.x + this.width - 1;
                oy = this.y + this.height - 1;
            }

            var dx = ox + offset.x;
            var dy = oy + offset.y;
            var tile = this.game.map.get(dx, dy);

            if(dx === 0 || dy === 0 || dx === this.game.map.width || dy === this.game.map.height){
                return 'map_edge';
            }

            if(tile && (tile.type === 'room_placeholder' || tile.type === 'room_placeholder_origin')){
                return 'room';
            }

            if(tile && tile.passable){
                return 'hallway';
            }
            return false;
        },

        loadToMap: function(){

            this.rotation = Math.floor(RL.Random.range(0, 3));

            var originX = this.x;
            var originY = this.y;
            RL.MapGen.Template.prototype.loadToMap.call(this, originX, originY);
        },

        setDoorPlacementEdges: function(edges){
            var _this = this;
            edges = edges || {};
            var sides = this.template.sides;
            var tempEdge = new RL.MapGen.RoomEdge(this.game);
            var getRoomEdge = function(room, side){

                tempEdge.setRangeFromRoomSide(room, side);
                var key = tempEdge.key;
                if(!edges[key]){
                    edges[key] = new RL.MapGen.RoomEdge(_this.game);
                }
                return edges[key];
            };

            if(sides){
                for(var side in sides){
                    if(sides[side].randomlyPlaceDoor){
                        var roomEdge = getRoomEdge(this, side);
                        roomEdge.addRoom(this, side);
                    }
                }
            }
            return edges;
        },

        getSideFromEdge: function(edge){
            for(var key in this.edgesBySide){
                if(this.edgesBySide[key] === edge){
                    return key;
                }
            }
            return false;
        }

    };

    Room.prototype = RL.Util.merge({}, RL.MapGen.Template.prototype, Room.prototype);

    root.RL.MapGen.Room = Room;

}(this));
