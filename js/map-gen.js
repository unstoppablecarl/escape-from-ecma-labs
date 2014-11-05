(function(root) {
    'use strict';

    var MapGen = function MapGen(floorTemplate) {
        this.floorTemplate = floorTemplate;
        this.map = new RL.Array2d();
        this.rooms = [];
    };

    MapGen.prototype = {
        constructor: MapGen,

        map: null,

        floorTemplate: null,

        roomSlotChar: 'r',

        roomSlotWidth: 20,
        roomSlotHeight: 20,

        roomSlots: null,

        getRoomSlots: function(){
            var _this = this,
                width = this.floorTemplate[0].length,
                height = this.floorTemplate.length;

            if(width !== this.map.width || height !== this.map.height){
                this.map.setSize(width, height);
            }


            // loop over each coord in the Array2d (val will be undefined)
            this.map.each(function(val, x, y){
                var char = this.floorTemplate[y][x],
                    type = charToType[char];

                if(char === this.roomSlotChar){
                    this.roomSlots.push({
                        x: x,
                        y: y,
                    });
                }


            });

        }


    };



    MapGen.Template = {
        Floor: {},
        Room: {}
    };

    root.RL.MapGen = MapGen;

}(this));
