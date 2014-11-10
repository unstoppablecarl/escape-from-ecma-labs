/* global RL */
(function(root) {
    'use strict';

    var Door = function Door(game, template, settings) {
        RL.MapGen.Template.call(this, game, template);
        RL.Util.merge(this, settings);
    };

    Door.prototype = {
        constructor: Door,

        game: null,

        direction: null,

        centerX: null,
        centerY: null,

        doorFurnitureType: null,
        doorTileType: null,

        sideConfig: null,

        tileAssign: function(x, y, value){
            // clear impassible furniture around door
            if(value === 'door_floor_placeholder' || value === 'door_placeholder'){
                var _this = this;
                this.game.furnitureManager.get(x, y, function(furniture){
                    if(!furniture.passable){
                        _this.game.furnitureManager.remove(furniture);
                    }
                });
                if(value === 'door_placeholder'){
                    this.furnitureAssign(x, y, this.doorFurnitureType);
                }
                value = this.doorTileType || 'floor';
            }

            this.game.map.set(x, y, value);
        },

        loadToMap: function(){
            var originX = this.centerX - this.template.registrationX;
            var originY = this.centerY - this.template.registrationY;
            if(this.direction === 'vertical'){
                this.rotation = 1;
            }
            RL.MapGen.Template.prototype.loadToMap.call(this, originX, originY);
        },

    };

    Door.prototype = RL.Util.merge({}, RL.MapGen.Template.prototype, Door.prototype);

    root.RL.MapGen.Door = Door;

}(this));
