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
                    var roomTemplate = RL.MapGen.Template.Room.getRandom(area);
                    var settings = {x: x, y: y};
                    var room = new RL.MapGen.Room(_this.game, roomTemplate, settings);
                    _this.rooms.push(room);
                }
            });
        },

        placeRooms: function(){

            var i, room,
                rooms = this.rooms;

            // place rooms in random order
            RL.Random.shuffleArray(this.rooms);

            for(i = rooms.length - 1; i >= 0; i--){
                room = rooms[i];
                room.loadToMap();
            }

            var edges = this.getRoomEdges();
            for(var key in edges){
                var edge = edges[key];
                var validTiles = edge.getValidDoorTiles();
                if(!validTiles || !validTiles.length){
                    continue;
                }
                var tile = RL.Random.arrayItem(validTiles);
                var x = tile.x;
                var y = tile.y;
                this.game.map.set(x, y, 'floor');

                // first door placeholder wins
                var placeholder = this.game.furnitureManager.getFirst(x, y, function(furniture){
                    return furniture.type === 'placeholder' && furniture.name === 'valid_door';
                });

                // remove all blocking furniture
                var furniture = this.game.furnitureManager.get(x, y, function(furniture){
                    return !furniture.passable;
                });
                for(var i = furniture.length - 1; i >= 0; i--){
                    this.game.furnitureManager.remove(furniture[i]);
                }

                // get door type from the first placeholder
                var doorType = placeholder.placeholderType;
                this.game.furnitureManager.add(x, y, doorType);
            }

            // // remove all placeholder objects
            // for(var i = this.game.furnitureManager.objects.length - 1; i >= 0; i--){
            //     var furniture = this.game.furnitureManager.objects[i];
            //     if(furniture.type === 'placeholder'){
            //         this.game.furnitureManager.remove(furniture);
            //     }
            // }
        },

        getRoomEdges: function(){
            var i, room,
                rooms = this.rooms,
                edges = {};
            for(i = rooms.length - 1; i >= 0; i--){
                room = rooms[i];
                room.setDoorPlacementEdges(edges);
            }
            return edges;
        },
    };

    Floor.prototype = RL.Util.merge({}, RL.MapGen.Template.prototype, Floor.prototype);


    root.RL.MapGen.Floor = Floor;

}(this));
