(function(root) {
    'use strict';

    var COLORS = {
        blue: '#2c97de',
        blue_alt: '#227fbb',
        yellow: '#f2c500',
        yellow_alt: '#f59d00',
        orange: '#e87e04',
        orange_alt: '#d55400',
        red: '#e94b35',
        red_alt: '#c23824',
        green: '#1eca6b',
        green_alt: '#1aaf5d',
        purple: '#9c56b8',
        purple_alt: '#8f3faf',
        teal: '#00bd9c',
        teal_alt: '#00a185',
        slate: '#33495f',
        slate_alt: '#2b3e51',
        gray: '#95a5a6',
        gray_alt: '#7f8c8d',
    };

    /**
     * Returns a weighted random result
     * @method getWeightedRandomResult
     * @param {Array} list - An array of `{chance: 99, value: 'whatever'}` objects.
     * @param {String} [weightKey='chance'] - The property of each object in the array to use as a weight chance.
     * @param {String} [valueKey='value'] - The property of each object in the array to return if selected.
     * @return {Mixed}
     */
    var getWeightedRandomResult = function(list, weightKey, valueKey) {
        weightKey = weightKey || 'chance';
        valueKey = valueKey || 'value';

        var percentChance = [],
            total = 0,
            i, item;

        for (i = 0; i < list.length; i++) {
            item = list[i];
            total += item[weightKey];
        }

        for (i = 0; i < list.length; i++) {
            item = list[i];
            percentChance[i] = item[weightKey] / total;
        }

        var random = Math.random(),
            currentTotal = 0;

        for (i = 0; i < list.length; i++) {
            item = list[i];
            currentTotal += percentChance[i];
            if (random < currentTotal) {
                return item[valueKey];
            }
        }
    };

    var getRandomNormal = function(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var getRandomPercentChance = function(arr){
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if(Math.random() < item.chance){
                result.push(item.value);
            }
        }
        return result;
    };

    var resolveRandomData = function(value, callback){
        if(!value){
            return;
        }
        var i;
        // add each from array
        if(Array.isArray(value)){
            for (i = 0; i < value.length; i++) {
                var val = value[i];
                callback(val);
            }
        }
        //
        else if(typeof value === 'object'){
            var repeat = value.repeat || 1;

            if(value.randomNormal){
                for (i = 0; i < repeat; i++) {
                    callback(getRandomNormal(value.randomNormal));
                }

            }
            else if(value.randomWeighted){
                for (i = 0; i < repeat; i++) {
                    callback(getWeightedRandomResult(value.randomWeighted));
                }
            }
            else if(value.randomPercentChance){
                for (i = 0; i < repeat; i++) {
                    callback(getRandomPercentChance(value.randomPercentChance));
                }
            }
        } else {
            callback(x, y, value);
        }
    };

    root.RL.Util.getWeightedRandomResult = getWeightedRandomResult;
    root.RL.Util.COLORS = COLORS;

}(this));
