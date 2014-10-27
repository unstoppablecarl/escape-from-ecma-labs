(function(root) {
    'use strict';

    /**
     * Manages a list of valid targets and which is currently selected.
     * @class ValidTargets
     * @constructor
     * @param {Array} [targets=Array] An Array of valid target objects to select from.
     */
    var ValidTargets = function(targets, typePriority, skipSort){
        this.targets = targets || [];
        this.typePriority = typePriority || [RL.Entity, RL.Furniture, RL.Item];
        if(!skipSort){
            this.sort();
        }
    };

    ValidTargets.prototype = {
        constructor: ValidTargets,

        /**
         * Array of target objects.
         * @type {Array}
         * @property targets
         */
        targets: null,

        /**
         * Currently Selected Object.
         * @property current
         * @type {Object}
         * @readOnly
         */
        current: null,

        /**
         * Array of types and their sort priority
         * @type {[type]}
         * @property typeSortOrder
         */
        typeSortOrder: null,

        /**
         * Sets the currently selected target object.
         * @method setCurrent
         * @param {Object} target
         */
        setCurrent: function(target){
            var index = this.targets.indexOf(target);

            if(index !== -1){
                if(this.current){
                    this.current.selected = false;
                }
                target.selected = true;
                this.current = target;
            }
        },

        /**
         * Gets the currently selected target object.
         * @method getCurrent
         * @return {Object}
         */
        getCurrent: function(){
            if(!this.current && this.targets.length){
                this.sort();
                this.setCurrent(this.targets[0]);
            }

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

            var index = this.targets.indexOf(this.current);
            if(index === this.targets.length - 1){
                index = 0;
            } else {
                index++;
            }
            this.setCurrent(this.targets[index]);

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

            var index = this.targets.indexOf(this.current);
            if(index === 0){
                index = this.targets.length - 1;
            } else {
                index--;
            }
            this.setCurrent(this.targets[index]);

            return this.current;
        },

        indexOf: function(obj){
            for(var i = this.targets.length - 1; i >= 0; i--){
                var target = this.targets[i];
                if(target.value === obj){
                    return i;
                }
            }
            return -1;
        },
        getTypePriority: function(obj){
            for(var i = this.typePriority.length - 1; i >= 0; i--){
                var type = this.typePriority[i];
                if(obj instanceof type){
                    return i;
                }
            }
        },
        sort: function(){
            var _this = this;
            this.targets.sort(function(a, b){

                var aTypePriority = _this.getTypePriority(a.value);
                var bTypePriority = _this.getTypePriority(b.value);

                if(aTypePriority === bTypePriority){
                    return a.range - b.range;
                }
                if(aTypePriority > bTypePriority){
                    return 1;
                }
                if(aTypePriority < bTypePriority){
                    return -1;
                }
            });
        }
    };

    root.RL.ValidTargets = ValidTargets;

}(this));