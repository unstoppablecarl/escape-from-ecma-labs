(function(root) {
    'use strict';

    /**
     * NOTE
     * this mixin requires that the object it is mixed into has an `equipment` property that is an object.
     * exampe:
     * {
     *    head: null,
     *    body: null,
     *    legs: null,
     * }
     */

    RL.Mixins.Equipment = {

        /**
         * Checks if equipment can be equipped to this entity.
         * @method canEquip
         * @param {Equipment} equipment
         * @param {String} [slot]
         * @param {Bool} [logMessage=true]
         * @return {Bool}
         */
        canEquip: function(equipment, slot, logMessage) {
            if (slot === void 0) {
                slot = equipment.defaultSlot || equipment.equipableToSlots[0];
            }
            if (logMessage === void 0) {
                logMessage = true;
            }
            if (slot === 'ammo') {
                var weaponRanged = this.equipment.weaponRanged;
                if (!weaponRanged) {
                    if (logMessage) {
                        this.game.console.log('Cannot equip ammo without a ranged weapon');
                    }
                    return false;
                }
                if (weaponRanged.ammoType) {
                    if (weaponRanged.ammoType !== equipment.ammoType) {
                        if (logMessage) {
                            this.game.console.log('Cannot equip ammo of incompatible type');
                        }
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * Equip an item to this manager.
         * @method equip
         * @param {Equipment} equipment - The equipment item to equip.
         * @param {String} [slot] - The slot to equip this item to. If not set, the first slot in equipment.equipableToSlots will be used.
         */
        equip: function(equipment, slot) {
            if (slot === void 0) {
                slot = equipment.defaultSlot || equipment.equipableToSlots[0];
            }

            if (!(slot in this.equipment)) {
                throw new Error('Equipment "' + equipment.name + '" cannot be equiped to slot "' + slot + '" (slot does not exist)');
            }

            if (!equipment.canEquipToSlot(slot)) {
                throw new Error('Equipment "' + equipment.name + '" cannot be equiped to slot "' + slot + '" (cannot equip to slot)');
            }

            if (!this.canEquip(equipment, slot)) {
                throw new Error('Equipment "' + equipment.name + '" cannot be equiped to this entity');
            }

            this.unEquipSlot(slot);

            this.equipment[slot] = equipment;

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
        unEquip: function(equipment) {
            for (var slot in this.equipment) {
                var equipped = this.equipment[slot];
                if (equipment === equipped) {
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
        unEquipSlot: function(slot) {
            var equipment = this.equipment[slot];
            if (!equipment) {
                return false;
            }
            this.equipment[slot] = void 0;

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
         * This function should contain project specific functionality.
         * Optional Callback.
         * @method onEquip
         * @param {Equipment} equipment
         * @param {String} slot
         */
        onEquip: function(equipment, slot){
            if (slot === 'ammo') {
                // combind ammo into 1 object with ammoQuantity
                var ammoOfSameType = this.inventory.getByType(equipment.type);
                this.inventory.removeMultiple(ammoOfSameType);
                equipment.ammoQuantity = 1 + ammoOfSameType.length;
            }
        },

        /**
         * Called when un-equipping an item from this manager, immediately before `equipment.onUnEquip()`.
         * This function should contain project specific functionality.
         * Optional Callback.
         * @method onUnEquip
         * @param {Equipment} equipment
         * @param {String} slot
         */
        onUnEquip: function(equipment, slot){
            if (slot === 'weaponRanged') {
                this.unEquipSlot('ammo');
            }

            if (slot === 'ammo') {
                // break ammo into separate objects
                var quantity = equipment.ammoQuantity;
                if (quantity) {
                    this.inventory.addByType(equipment.type, quantity);
                }
            } else {
                this.inventory.add(equipment);
            }
        },

        /**
         * Use equipped ammo.
         * @method useAmmo
         * @param {Number} amount
         */
        useAmmo: function(amount) {
            var ammo = this.equipment.ammo;
            if (amount > ammo.ammoQuantity) {
                throw new Error('attempting to use more ammo than available');
            }
            ammo.ammoQuantity -= amount;

            if (ammo.ammoQuantity === 0) {
                this.unEquipSlot('ammo');
            }
        },
    };

}(this));
