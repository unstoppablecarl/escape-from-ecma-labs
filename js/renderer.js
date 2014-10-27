(function(root) {
    'use strict';


    var extendedRenderer = {


    };

    for (var key in extendedRenderer) {
        root.RL.Renderer.prototype[key] = extendedRenderer[key];
    }

}(this));
