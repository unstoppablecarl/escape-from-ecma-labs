(function(root) {
    'use strict';

    /**
     * Manages equipment of a single entity.
     * @class EquipmentManager
     * @constructor
     * @param {Game} game - Game instance this obj is attached to.
     * @param {Object} [slots] - An object with each key being an equipment slot. If not set this.slots is used instead.
     */
    var EquipmentManager = function EquipmentManager(game, slots) {
        slots = slots || this.slots;

        // make sure each instance of this object has it's own slots obj.
        this.slots = RL.Util.merge({}, slots);
    };

    EquipmentManager.prototype = {
        constructor: EquipmentManager,

        /**
         * Game instance this obj is attached to.
         * @property game
         * @type {Game}
         */
        game: null,

        /**
         * An object with each key being an equipment slot and the value being the equipment equipped to that slot.
         * @type {Object}
         */
        slots: {

            // left_hand: null,
            // right_hand: null,

            // both_hands: null,

            // head: null,
            // torso: null,
            // hands: null,
            // legs: null,
            // feet: null,
            //
            armor: null,
            weaponMelee: null,
            weaponRanged: null,
        },

        /**
         * Equip an item to this manager.
         * @method equip
         * @param {Equipment} equipment - The equipment item to equip.
         * @param {String} [slot] - The slot to equip this item to. If not set, the first slot in equipment.equipableToSlots will be used.
         */
        equip: function(equipment, slot){
            if(slot === void 0){
                slot = equipment.defaultSlot || equipment.equipableToSlots[0];
            }

            if(!(slot in this.slots)){
                throw new Error('Equipment "' + equipment.name + '" cannot be equiped to slot "' + slot + '" (slot does not exist)');
            }

            if(!equipment.canEquipToSlot(slot)){
                throw new Error('Equipment "' + equipment.name + '" cannot be equiped to slot "' + slot + '" (cannot equip to slot)');
            }

            this.unEquipSlot(slot);

            this.slots[slot] = equipment;
            if(this.onEquip){
                this.onEquip(equipment, slot);
            }

            if(equipment.onEquip){
                equipment.onEquip(this, slot);
            }

            return equipment;
        },

        /**
         * Unequip item from given slot.
         * @method unEquipSlot
         * @param {Equipment} equipment - The equpment to unEquip.
         * @return {Equipment} The equipment removed or false if none was equiped.
         */
        unEquip: function(equipment){
            for(var slot in this.slots){
                var slotVal = this.slots[slot];
                if(equipment === slotVal){
                    return this.unEquipSlot(slot);
                }
            }
            return false;
        },

        /**
         * Unequip item from given slot.
         * @method unEquipSlot
         * @param {String} slot - The slot to unequip from.
         * @return {Equipment} The equipment removed or false if none was equiped.
         */
        unEquipSlot: function(slot){
            var equipment = this.slots[slot];
            this.slots[slot] = void 0;

            if(!equipment){
                equipment = false;
            }

            if(this.onUnEquip){
                this.onUnEquip(equipment, slot);
            }

            if(equipment && equipment.onUnEquip){
                equipment.onUnEquip(this, slot);
            }

            return equipment;
        },

        /**
         * Called when equipping an item to this manager, immediately before `equipment.onEquip()`.
         * Optional Callback.
         * @method onEquip
         * @param {Equipment} equipment
         * @param {String} slot
         */
        onEquip: function(equipment, slot){
            if(slot === 'both_hands'){
                this.unEquipSlot('left_hand');
                this.unEquipSlot('right_hand');
            }

            if(slot === 'left_hand' || slot === 'right_hand'){
                this.unEquipSlot('both_hands');
            }
        },

        /**
         * Called when un-equipping an item from this manager, immediately before `equipment.onUnEquip()`.
         * Optional Callback.
         * @method onUnEquip
         * @param {Equipment} equipment
         * @param {String} slot
         */
        onUnEquip: false

    };

    root.RL.EquipmentManager = EquipmentManager;

}(this));
