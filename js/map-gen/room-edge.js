/* global RL */
(function(root) {
    'use strict';

    var RoomEdge = function RoomEdge(game) {
        this.game = game;
        this.rooms = [];
        this.validDoorTiles = [];
        this.roomsBySide = {};

    };

    RoomEdge.prototype = {
        constructor: RoomEdge,

        game: null,
        rooms: null,

        validDoorTiles: null,

        direction: null,

        x1: null,
        y1: null,

        x2: null,
        y2: null,

        roomsBySide: null,

        doorPlaceholderFurnitureType: 'valid_door_placeholder',

        addRoom: function(room, side){
            if(this.rooms.indexOf(room) === -1){
                this.rooms.push(room);
            }
            this.roomsBySide[side] = room;
            room.edgesBySide[side] = this;
            if(this.x1 === null || this.y1 === null || this.x2 === null || this.y2 === null){
                this.setRangeFromRoomSide(room, side);
            }

            if(!this.direction){
                if(side === 'left' || side === 'right'){
                    this.direction = 'vertical';
                } else {
                    this.direction = 'horizontal';
                }
            }
        },

        setRangeFromRoomSide: function(room, side){
            var x1, y1, x2, y2, tx, ty;

            if(side === 'left'){
                x1 = 0;
                y1 = 0;

                x2 = 0;
                y2 = room.height - 1;
            }
            else if(side === 'right'){
                x1 = room.width - 1;
                y1 = 0;

                x2 = room.width - 1;
                y2 = room.height - 1;
            }
            else if(side === 'up'){
                x1 = 0;
                y1 = 0;

                x2 = room.width - 1;
                y2 = 0;
            }
            else if(side === 'down'){
                x1 = 0;
                y1 = room.height - 1;

                x2 = room.width - 1;
                y2 = room.height - 1;
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
            this.x1 = x1 + room.x;
            this.y1 = y1 + room.y;

            this.x2 = x2 + room.x;
            this.y2 = y2 + room.y;

            this.key = this.x1 + ',' + this.y1 + ' ' + this.x2 + ',' + this.y2;
        },

        getValidDoorTiles: function(){
            var validDoorTiles = [];

            var tiles = this.getTileCoords();
            var isHallway = false;
            if(this.rooms.length === 1){
                var room = this.rooms[0];
                var roomSide = room.getSideFromEdge(this);
                var sideType = room.sides[roomSide];
                isHallway = sideType === 'hallway';
            }

            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];

                var furniture = this.game.furnitureManager.get(tile.x, tile.y, function(furniture){
                    var result = furniture.type === 'placeholder' && furniture.name === 'valid_door';
                    return result;
                });

                // if there are at least 2 placeholders in this tile (2 overlapping room edges that are valid door locations)
                var isAdjacentRoom = !isHallway && furniture.length > 1;
                var isAdjacentHallway = isHallway && furniture.length;

                if(isAdjacentRoom || isAdjacentHallway){
                    if(this.game.showDoorPlacementDebug){
                        this.game.furnitureManager.add(tile.x, tile.y, {type: 'placeholder', name: 'valid_door_final'});
                    }

                    validDoorTiles.push({x: tile.x, y: tile.y});
                }
            }

            if(validDoorTiles){
                this.validDoorTiles = validDoorTiles;
            } else {
                this.validDoorTiles = false;
            }
            return this.validDoorTiles;
        },

        getTileCoords: function(){
            var x, y, min, max;
            var result = [];
            if(this.direction === 'vertical'){
                x = this.x1;

                if(this.y1 <= this.y2){
                    min = this.y1;
                    max = this.y2;
                } else {
                    min = this.y2;
                    max = this.y1;
                }

                for (y = min; y < max; y++) {
                    result.push({x: x, y: y});
                }

            } else {
                y = this.y1;

                if(this.x1 <= this.x2){
                    min = this.x1;
                    max = this.x2;
                } else {
                    min = this.x2;
                    max = this.x1;
                }

                for (x = min; x < max; x++) {
                    result.push({x: x, y: y});
                }
            }
            return result;
        },

    };

    root.RL.MapGen.RoomEdge = RoomEdge;

}(this));
