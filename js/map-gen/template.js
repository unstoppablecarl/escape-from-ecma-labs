/* global RL */
(function(root) {
    'use strict';

    var Template = function Template(game, template) {
        this.game = game;
        this.template = template;

        this.setSizeFromTemplate();
        this.init();

    };

    Template.prototype = {
        constructor: Template,

        game: null,

        width: null,
        height: null,

        // number of times to rotate clockwise 90 deg
        rotation: null,

        init: function(){
            for(var i = this.template.layers.length - 1; i >= 0; i--){
                var layer = this.template.layers[i];
                this.initRotatedLayerMapData(layer);
            }
            this.initRotatedSideData();
        },
        setSizeFromTemplate: function(template){
            template = template || this.template;

            var width = 0;
            var height = 0;

            for(var i = template.layers.length - 1; i >= 0; i--){
                var layer = template.layers[i];
                var layerWidth = layer.mapData[0].length;
                var layerHeight = layer.mapData.length;
                if(layerWidth > width){
                    width = layerWidth;
                }
                if(layerHeight > height){
                    height = layerHeight;
                }
            }
            this.width = width;
            this.height = height;
        },

        loadToMap: function(originX, originY){
            originX = originX || 0;
            originY = originY || 0;

            for (var i = 0; i < this.template.layers.length; i++) {
                var layer = this.template.layers[i];
                this.loadLayer(layer, originX, originY);
            }
        },

        getMergedTypes: function(layer){
            var result = {
                characterToTileType: null,
                characterToType: null,
            };

            for(var key in result){
                result[key] = RL.Util.merge({}, layer[key], this.template[key]);
            }
            return result;
        },

        // get min max coord range to load to map
        // so that edges can be clipped for wall overlapping
        getCoordRange: function(){
            return {
                xMin: 0,
                xMax: this.width,
                yMin: 0,
                yMax: this.height
            };
        },

        loadLayer: function(layer, originX, originY){

            // console.log('loadLayer', layer);
            originX = originX || 0;
            originY = originY || 0;
            var types = this.getMergedTypes(layer);

            var _this = this;
            var x, y, tx, ty, char;

            var range = this.getCoordRange(originX, originY);

            for(x = range.xMin; x < range.xMax; x++){
                for(y = range.yMin; y < range.yMax; y++){

                    tx = originX + x;
                    ty = originY + y;
                    if(this.rotation){
                        char = layer.mapDataRotated[this.rotation][y][x];
                    } else {
                        char = layer.mapData[y][x];
                    }

                    var tileType = types.characterToTileType[char] || layer.defaultTileType;
                    RL.Random.resolveRandomData(tileType, function(value){
                        _this.tileAssign(tx, ty, value);
                    });

                    var objType = types.characterToType[char];
                    RL.Random.resolveRandomData(objType, function(value){
                        _this.objAssign(tx, ty, value);
                    });
                }
            }
        },

        tileAssign: function(x, y, value){
            if(RL.Tile.Types[value].passable){
                var existing = this.game.map.get(x, y);
                if(existing && !existing.passable){
                    return;
                }
            }
            // do not add if there is already an impassable object at this location
            if(this.hasImpassableFurniture(x, y)){
                return;
            }

            return this.game.map.set(x, y, value);
        },

        furnitureAssign: function(x, y, value){

            // do not add if
            // furniture with wall === true or a map tile wall
            // is already at this location
            if(RL.Furniture.Types[value].isWall){
                var furniture = this.game.furnitureManager.getFirst(x, y, function(furniture){
                    return furniture.isWall;
                });
                if(furniture){
                    return;
                }
                if(!this.game.map.get(x, y).passable){
                    return;
                }
            }
            var furniture = this.game.furnitureManager.add(x, y, value);
            if(furniture.isWall){
                this.game.map.set(x, y, 'floor');
            }
            return furniture;
        },

        itemAssign: function(x, y, value){
            return this.game.itemManager.add(x, y, value);
        },

        entityAssign: function(x, y, value){
            return this.game.entityManager.add(x, y, value);
        },

        objAssign: function(x, y, value){

            var isPlaceholder = typeof value === 'object' && value.placeholder;
            if(isPlaceholder){
                return this.objAssignPlaceholder(x, y, value);
            }
            if(RL.Tile.Types[value]){
                return this.tileAssign(x, y, value);
            }
            else if(RL.Entity.Types[value]){
                return this.entityAssign(x, y, value);
            }
            else if(RL.Furniture.Types[value]){
                return this.furnitureAssign(x, y, value);
            }
            else if(RL.Item.Types[value]){
                return this.itemAssign(x, y, value);
            }
        },

        objAssignPlaceholder: function(x, y, obj){
            var result;
            var name = obj.placeholder;
            var value = obj.value;
            result = this.furnitureAssign(x, y, 'placeholder');
            if(result){
                result.name = name;
                result.placeholderType = value;
            }
            return result;
        },

        initRotatedLayerMapData: function(layer){
            var mapData = layer.mapData;
            layer.mapDataRotated = {
                '0': mapData,
                '1': null,
                '2': null,
                '3': null,
            };
            var prev;
            for (var i = 1; i <= 3; i++) {
                mapData = prev || mapData;
                prev = layer.mapDataRotated[i] = this.rotateMapData(mapData);
            }
        },

        initRotatedSideData: function(){
            var template = this.template;
            if(template.sides){
                template.sidesRotated = {
                    '0': template.sides,
                    '1': null,
                    '2': null,
                    '3': null,
                };
                for (var i = 1; i <= 3; i++) {
                    template.sidesRotated[i] = this.rotateSideData(template.sides);
                }
            }
        },

        rotateSideData: function(sideData){
            var newSides = {};
            for(var key in sideData){
                var newKey;
                if(key === 'up'){
                    newKey = 'right';
                }
                else if(key === 'right'){
                    newKey = 'down';
                }
                else if(key === 'down'){
                    newKey = 'left';
                }
                else if(key === 'left'){
                    newKey = 'up';
                }

                newSides[newKey] = sideData[key];
            }
            return newSides;
        },

        rotateMapData: function(mapData){

            var width = mapData[0].length;
            var height = mapData.length;
            var newMapData = [],
                x, y;

            for (y = 0; y < height; y++) {
                    newMapData[y] = [];
                for (x = 0; x < width; x++) {
                    newMapData[y][x] = null;
                }
            }

            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++) {
                    var nx = y;
                    var ny = width - x - 1;
                    newMapData[y][x] = mapData[ny][nx];
                }
            }

            return newMapData;
        },

        hasImpassableFurniture: function(x, y){
            var furniture = this.game.furnitureManager.getFirst(x, y, function(furniture){
                return !furniture.passable;
            });
            return furniture;
        }

    };

    root.RL.MapGen.Template = Template;

}(this));
