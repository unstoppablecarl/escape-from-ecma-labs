(function(root) {
    'use strict';

    /**
     * Helper for random tasks.
     * @class Random
     * @static
     */
    var Random = {

        /**
         * Random number generator function.
         * A function returning a random value from 0 to 1.
         * @property rng
         * @type {Function}
         */
        rng: Math.random,

        /**
         * Returns a weighted random result from an array of objects.
         * @method range
         * @param {Number} min -
         * @param {Number} max -
         * @param {Function} [rng=this.rng] - Random number generator function.
         * @return {Number} Random result. Not rounded to nearest integer.
         */
        range: function(min, max, rng) {
            rng = rng !== void 0 ? rng : this.rng;
            return rng() * (max - min) + min;
        },

        /**
         * Returns a random array item.
         * @method arrayItem
         * @param {Array} array - The array to get a random item from.
         * @param {Function} [rng=this.rng] - Random number generator function.
         * @return {Mixed} Random result.
         */
        arrayItem: function(array, rng) {
            rng = rng !== void 0 ? rng : this.rng;
            return array[Math.floor(rng() * array.length)];
        },

        /**
         * Returns a weighted random result from an array of objects.
         * @method weightedList
         * @param {Array} list - An array of `{weight: 99, value: 'whatever'}` objects.
         * @param {Function} [rng=this.rng] - Random number generator function.
         * @param {String} [weightKey='weight'] - The property key of each array object to use as it's weighted chance.
         * @param {String} [valueKey='value'] - The property key of each array object to use as its value to return if selected.
         * @return {Mixed} The `result[valueKey]` of the array object selected.
         */
        weightedList: function(list, rng, weightKey, valueKey) {
            rng = rng !== void 0 ? rng : this.rng;
            weightKey = weightKey || 'weight';
            valueKey = valueKey || 'value';

            var percentChance = [],
                total = 0,
                i, item;

            for (i = 0; i < list.length; i++) {
                item = list[i];
                total += item[weightKey] || 0;
            }

            for (i = 0; i < list.length; i++) {
                item = list[i];
                percentChance[i] = item[weightKey] / total;
            }

            var random = rng(),
                currentTotal = 0;

            for (i = 0; i < list.length; i++) {
                item = list[i];
                currentTotal += percentChance[i];
                if (random < currentTotal) {
                    return item[valueKey];
                }
            }
        },

        /**
         * Returns a weighted random result
         * @method percentChanceList
         * @param {Array} list - An array of `{chance: 99, value: 'whatever'}` objects.
         * @param {Function} [rng=this.rng] - Random number generator function.
         * @param {String} [chanceKey='chance'] - The property key of each array object to use as it's percent chance.
         * @param {String} [valueKey='value'] - The property key of each array object to use as its value to return if selected.
         * @return {Mixed} The `result[valueKey]` of the array object selected.
         */
        percentChanceList: function(list, rng, chanceKey, valueKey) {
            rng = rng !== void 0 ? rng : this.rng;
            chanceKey = chanceKey || 'chance';
            valueKey = valueKey || 'value';

            var result = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (rng() < item[chanceKey]) {
                    result.push(item[valueKey]);
                }
            }
            return result;
        },

        /**
         * Resolve random result json structure recursively.
         * Processed recursively until a non Object non Array value is resolved.
         * @method resolveRandomData
         * @param {Object|Array|String} value - The value to get the result from
         * @param {Function} callback - Function to call with each resolved result.
         * @return {Mixed}
         */
        resolveRandomData: function(value, callback){
            if(!value){
                return false;
            }
            var i;
            if(Array.isArray(value)){
                for (i = 0; i < value.length; i++) {
                    var val = value[i];
                    this.resolveRandomData(val, callback);
                }
            }
            else if(typeof value === 'object'){
                var repeat = value.repeat || 1;
                var result;
                if(value.randomNormal){
                    for (i = 0; i < repeat; i++) {
                        result = this.arrayItem(value.randomNormal);
                        this.resolveRandomData(result, callback);
                    }
                }
                else if(value.randomWeighted){

                    for (i = 0; i < repeat; i++) {
                        result = this.weightedList(value.randomWeighted);
                        this.resolveRandomData(result, callback);
                    }
                }
                else if(value.randomPercentChance){
                    for (i = 0; i < repeat; i++) {
                        result = this.percentChanceList(value.randomPercentChance);
                        this.resolveRandomData(result, callback);
                    }
                }

            } else {
                callback(value);
            }
        },
    };

    root.RL.Random = Random;

}(this));
