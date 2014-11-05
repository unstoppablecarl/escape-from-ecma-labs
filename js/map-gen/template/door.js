(function(root) {
    'use strict';

    var Door = {

        getRandom: function(area){
            var keys = Object.keys(this[area]);
            var name = keys[Math.floor(Math.random() * keys.length)];
            var result = this[area][name];
            result.name = name;
            result.area = area;
            return result;
        },

        office: {
            basic: {
                name: 'basic',
                author: 'unstoppableCarl',
                area: 'office',

                registrationX: 2,
                registrationY: 2,

                layers: [{
                    mapData: [
                        '     ',
                        ' ... ',
                        '  D  ',
                        ' ... ',
                        '     ',
                    ],

                    // optional overrides for this layer
                    characterToType: {
                        'D': 'door_placeholder',
                        '.': 'door_floor_placeholder',
                        '#': 'wall'
                    },
                }],
            },
        }
    };

    root.RL.MapGen.Template.Door = Door;

}(this));
