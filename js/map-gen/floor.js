/* global RL */
(function (root) {
    'use strict';

    var Floor = function Floor(game, template, requiredRoomTemplates, randomRoomTemplates) {
        RL.MapGen.Template.call(this, game, template);
        this.requiredRoomTemplates = requiredRoomTemplates || [];
        this.randomRoomTemplates = randomRoomTemplates || [];
        this.rooms = [];
    };

    Floor.prototype = {
        constructor: Floor,

        game: null,

        rooms: null,
        generateRandomRooms: true,

        loadToMap: function () {

            this.game.setMapSize(this.width, this.height);
            RL.MapGen.Template.prototype.loadToMap.call(this);

            var roomPlaceholderOrigins = this.getRoomPlaceholderOriginCoords();
            var roomCount = roomPlaceholderOrigins.length;
            if (roomCount) {
                var roomTemplates = this.getRoomTemplateList(roomCount);

                for (var i = 0; i < roomPlaceholderOrigins.length; i++) {
                    var coord = roomPlaceholderOrigins[i];
                    var roomTemplate = roomTemplates[i];
                    var room = new RL.MapGen.Room(this.game, roomTemplate, coord);
                    this.rooms.push(room);
                }

                this.placeRooms();
                this.placeDoors();
                if (!this.game.showDoorPlacementDebug) {
                    this.removeFurniturePlaceholders();
                    this.removeTilePlaceholders();
                }
            }
        },

        setMapEdges: function () {
            this.game.map.each(function (value, x, y) {

                var isEdge = false;
                if (x === 0) {
                    isEdge = true;
                } else if (y === 0) {
                    isEdge = true;
                } else if (x === this.game.map.width - 1) {
                    isEdge = true;
                } else if (y === this.game.map.height - 1) {
                    isEdge = true;
                }

                if (isEdge) {
                    this.game.map.set(x, y, 'wall');
                    this.game.furnitureManager.removeAt(x, y)
                }

            }, this);
        },

        getRoomTemplateList: function (count) {
            var out = [];
            out = out.concat(this.requiredRoomTemplates);

            if (out.length > count) {
                throw new Error('requiredRoomTemplates.length exceeds requested count');
            }


            if (this.generateRandomRooms) {
                while (out.length < count) {
                    var roomTemplate = RL.Random.arrayItem(this.randomRoomTemplates);
                    out.push(roomTemplate);
                }
            } else {

                let j = 0;
                while (out.length < count) {

                    var roomTemplate = this.randomRoomTemplates[j];
                    out.push(roomTemplate);

                    j++;
                    if (j == this.randomRoomTemplates.length - 1) {
                        j = 0;
                    }
                }
            }

            return out;
        },

        removeFurniturePlaceholders: function () {
            // remove all placeholder objects
            for (var i = this.game.furnitureManager.objects.length - 1; i >= 0; i--) {
                var furniture = this.game.furnitureManager.objects[i];

                if (furniture.type === 'placeholder') {
                    this.game.furnitureManager.remove(furniture);
                }
            }
        },
        removeTilePlaceholders: function (replaceType) {
            replaceType = replaceType || 'floor';
            var map = this.game.map;

            map.each(function (tile, x, y) {
                if (
                    tile.type === 'room_placeholder' ||
                    tile.type === 'room_placeholder_origin'
                ) {
                    map.set(x, y, replaceType);
                }
            });
        },
        getRoomPlaceholderOriginCoords: function () {
            var roomPlaceholderOrigins = [];
            this.game.map.each(function (value, x, y) {
                if (value && value.type === 'room_placeholder_origin') {
                    roomPlaceholderOrigins.push({x: x, y: y});
                }
            });
            return roomPlaceholderOrigins;
        },

        placeRooms: function (rooms) {
            rooms = rooms || this.rooms;
            var i, room;

            for (i = rooms.length - 1; i >= 0; i--) {
                room = rooms[i];
                room.loadToMap();
            }
        },

        placeDoors: function (rooms) {
            rooms = rooms || this.rooms;
            var edges = RL.MapGen.makeRoomEdgeList(this.game, rooms);
            for (var key in edges) {
                var edge = edges[key];
                var validTiles = edge.getValidDoorTiles();
                if (!validTiles || !validTiles.length) {
                    continue;
                }
                // get random valid door tile
                var tile = RL.Random.arrayItem(validTiles);
                var x = tile.x;
                var y = tile.y;

                // first door placeholder wins (both adjacent rooms have a door placeholder on this tile)
                var placeholder = this.game.furnitureManager.getFirst(x, y, function (furniture) {
                    return furniture.type === 'placeholder' && furniture.name === 'valid_door';
                });

                // get door type from the first placeholder
                var doorType = placeholder.placeholderType;

                this.placeDoor(x, y, doorType);

            }
        },

        placeDoor: function (x, y, doorType, floorType) {
            floorType = floorType || 'floor';

            // remove any walls
            this.game.map.set(x, y, floorType);

            // remove all blocking furniture
            this.game.furnitureManager.removeAt(x, y, function (furniture) {
                return !furniture.passable;
            });

            this.game.furnitureManager.add(x, y, doorType);
        },
    };

    Floor.prototype = RL.Util.merge({}, RL.MapGen.Template.prototype, Floor.prototype);

    root.RL.MapGen.Floor = Floor;

    var FloorPopulator = function (settings) {

        var getPlaceableCoords = settings.getPlaceableCoords;

        var removeObj = settings.remove;
        var addObj = settings.add;
        var targetCount = settings.targetCount;

        var currentObjects = settings.currentObjects;
        var count = currentObjects.length;

        var placeableCoords;

        var remove = function () {
            var obj = RL.Random.arrayItem(currentObjects);
            removeObj(obj);
        };

        var add = function () {
            var coord = RL.Random.arrayItemRemove(placeableCoords);
            addObj(coord.x, coord.y);
        };

        var repeat = function (amount, func) {
            for (var i = 0; i < amount; i++) {
                func();
            }
        };

        if (count > targetCount) {
            var removeCount = count - targetCount;
            repeat(removeCount, remove);
        } else if (count < targetCount) {
            var addCount = targetCount - count;
            placeableCoords = getPlaceableCoords();
            repeat(addCount, add);
        }
    };

    root.RL.MapGen.FloorPopulator = FloorPopulator;

    root.RL.MapGen.Floor.generateOfficeFloor = function () {

        var template = RL.MapGen.Template.Floor.office;
        var requiredRoomTemplates = [RL.MapGen.Template.Room.exit.elevator];
        var randomRoomTemplates = RL.MapGen.Template.Room.getRoomsByType('office');
        var floor = new RL.MapGen.Floor(game, template, requiredRoomTemplates, randomRoomTemplates);
        floor.loadToMap();
        floor.setMapEdges();
    };

    root.RL.MapGen.Floor.generateSingleTestRoom = function () {
        var template = RL.MapGen.Template.Floor.single_test_room;
        var floor = new RL.MapGen.Floor(game, template, [], []);
        floor.loadToMap();
    };


}(this));
