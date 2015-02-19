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
    };

    MapGen.Template = {
        Floor: {},
        Room: {}
    };

    root.RL.MapGen = MapGen;

}(this));
