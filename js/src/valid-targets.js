(function(root) {
    'use strict';

    /**
     * Manages a list of valid targets and which is currently selected.
     * @class ValidTargets
     * @constructor
     * @param {Game} game - Game instance this obj is attached to.
     * @param {Array} [targets=Array] An Array of valid target objects to select from (intended to be in the format `validTargetsFinder.getValidTargets()` returns).
     * @param {Object} settings
     * @param {Array} [settings.typeSortPriority=this.typeSortPriority] - Array of types in order of their sort priority.
     * @param {Bool} [settings.mapWidth=game.map.width] - Width of `this.map`.
     * @param {Bool} [settings.mapHeight=game.map.height] - Height of `this.map`.
     * @param {Bool} [settings.skipSort=false] - If true initial sort is skipped.
     */
    var ValidTargets = function(game, targets, settings){
        this.game = game;

        settings = settings || {};
        this.typeSortPriority = settings.typeSortPriority || [].concat(this.typeSortPriority);

        var width = settings.mapWidth || this.game.map.width;
        var height = settings.mapWidth || this.game.map.width;

        this.objectManager = new RL.MultiObjectManager(this.game, null, width, height);
        this.setTargets(targets);
        if(!settings.skipSort){
            this.sort();
        }

        this.setCurrentCoord(this.targets[0].x, this.targets[0].y);
    };

    ValidTargets.prototype = {
        constructor: ValidTargets,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type {Game}
        */
        game: null,

        /**
         * Array of target objects.
         * @type {Array}
         * @property targets
         * @readOnly
         */
        targets: null,

        /**
         * Map of target positions.
         * @type {MultiObjectManager}
         * @property objectManager
         *
         */
        objectManager: null,

        /**
         * Currently Selected Object.
         * @property current
         * @type {Object}
         * @readOnly
         */
        current: null,

        /**
         * The currently selected map coord
         * @type {Object}
         */
        currentCoord: null,

        /**
         * Array of types in order of their sort priority.
         * @type {Array}
         * @property typeSortPriority
         */
        typeSortPriority: [],

        /**
         * Sets the targets, replacing currently set ones.
         * @method setTargets
         * @param {Array} targets
         */
        setTargets: function(targets){
            targets = targets || [];
            this.targets = targets;
            this.objectManager.reset();
            for(var i = targets.length - 1; i >= 0; i--){
                var target = targets[i];
                var x = target.x;
                var y = target.y;
                this.objectManager.add(x, y, target);
            }
        },

        /**
         * Sets the currently selected target object.
         * @method setCurrent
         * @param {Object} target
         * @return {Bool} If target was found in `this.targets`. (only set if found).
         */
        setCurrent: function(target){
            var index = this.targets.indexOf(target);
            if(index !== -1){
                this.current = target;
                return true;
            }
            return false;
        },

        /**
         * Gets the currently selected target object.
         * @method getCurrent
         * @param {Bool} [autoset=true] - If no target is set to current autoset the first.
         * @return {Object}
         */
        getCurrent: function(autoset){
            autoset =  autoset !== void 0 ? autoset : true;
            if(autoset && !this.current){
                var targets = this.getTargetsAtCurrentCoord();
                if(targets.length){
                    this.sort(targets);
                    this.setCurrent(targets[0]);
                }
            }

            // if(autoset && !this.current && this.targets.length){
            //     this.sort();
            //     this.setCurrent(this.targets[0]);
            // }

            return this.current;
        },

        /**
         * Sets the object after the currently selected object to be the selected object.
         * @method next
         * @return {Object} The new currently selected object.
         */
        next: function(){
            if(!this.current){
                return this.getCurrent();
            }
            var targets = this.getTargetsAtCurrentCoord();
            var index = targets.indexOf(this.current);
            if(index === targets.length - 1){
                index = 0;
            } else {
                index++;
            }
            this.setCurrent(targets[index]);
            return this.current;
        },

        /**
         * Sets the object before the currently selected object to be the selected object.
         * @method prev
         * @return {Object} The new currently selected object.
         */
        prev: function(){
            if(!this.current){
                return this.getCurrent();
            }
            var targets = this.getTargetsAtCurrentCoord();
            var index = targets.indexOf(this.current);
            if(index === 0){
                index = targets.length - 1;
            } else {
                index--;
            }
            this.setCurrent(targets[index]);

            return this.current;
        },

        setCurrentCoord: function(x, y){
            var current = this.currentCoord;
            if(current && current.x === x && current.y === y){
                return;
            }
            this.currentCoord = {x: x, y: y};

            var targets = this.getTargetsAtCurrentCoord();
            if(targets.length){
                console.log('targets', targets[0].value);
                this.setCurrent(targets[0]);
            }
        },

        getCurrentCoord: function(autoset){
            return this.currentCoord;
        },

        /**
         *
         * @method getTargetsAtCurrentCoord
         * @return {Array}
         */
        getTargetsAtCurrentCoord: function(){
            var coord = this.getCurrentCoord();
            return this.objectManager.get(coord.x, coord.y);
        },

        setCurrentCoordInDirection: function(direction){
            var current = this.getCurrentCoord();
            var targets, nearest;

            var filterUp = function(val, x, y){
                return val.length && y < current.y;
            };

            var filterDown = function(val, x, y){
                return val.length && y > current.y;
            };

            var filterLeft = function(val, x, y){
                return val.length && x < current.x;
            };

            var filterRight = function(val, x, y){
                return val.length && x > current.x;
            };

            if(direction === 'up'){
                targets = this.objectManager.map.filter(filterUp, true);
            }
            else if(direction === 'down'){
                targets = this.objectManager.map.filter(filterDown, true);
            }
            else if(direction === 'left'){
                targets = this.objectManager.map.filter(filterLeft, true);
            }
            else if(direction === 'right'){
                targets = this.objectManager.map.filter(filterRight, true);
            }

            if(targets.length){
                targets = targets.map(function(target){
                    return {
                        distance: RL.Util.getDistance(current.x, current.y, target.x, target.y),
                        x: target.x,
                        y: target.y,
                    };
                });
                nearest = targets.reduce(function(prev, target){
                    if(!prev || target.distance < prev.distance){
                        return target;
                    }
                    return prev;
                });
                this.setCurrentCoord(nearest.x, nearest.y);
            }
        },

        /**
         * Gets the sort priority of an object based on its type using 'this.typeSortPriority'.
         * @method getTypeSortPriority
         * @param {Object} obj
         * @return {Number}
         */
        getTypeSortPriority: function(obj){
            for(var i = this.typeSortPriority.length - 1; i >= 0; i--){
                var type = this.typeSortPriority[i];
                if(obj instanceof type){
                    return i;
                }
            }
        },

        /**
         * Sorts `this.targets` by `this.typeSortPriority` then by range.
         * @method sort
         * @return {Number}
         */
        sort: function(array){
            var _this = this;
            array = array || this.targets;
            array.sort(function(a, b){

                var aTypeSortPriority = _this.getTypeSortPriority(a.value);
                var bTypeSortPriority = _this.getTypeSortPriority(b.value);

                if(aTypeSortPriority === bTypeSortPriority){
                    return a.range - b.range;
                }
                if(aTypeSortPriority > bTypeSortPriority){
                    return 1;
                }
                if(aTypeSortPriority < bTypeSortPriority){
                    return -1;
                }
            });
        },

        /**
         * Finds a target object by its value.
         * @method getTargetByValue
         * @param {Object} value
         * @return {Object}
         */
        getTargetByValue: function(value){
            for(var i = this.targets.length - 1; i >= 0; i--){
                var target = this.targets[i];
                if(target.value === value){
                    return target;
                }
            }
        },
    };

    root.RL.ValidTargets = ValidTargets;

}(this));