(function(root) {
    'use strict';


    var extendedPlayer = {
        name: 'You',

        fovMaxViewDistance: 20,
        charStrokeColor: '#000',
        consoleColor: '#00a185',
        charStrokeWidth: 3,
        hp: 20,
        hpMax: 20,

        meleeWeapon: null,
        rangedWeapon: null,

        hpEl: null,
        hpMaxEl: null,
        meleeWeaponEl: null,
        rangedWeaponEl: null,

        pendingAction: false,

        bleeds: true,

        equipment: {
            armor: null,
            weaponMelee: null,
            weaponRanged: null,
            ammo: null,
        },

        init: function(game){
            this.inventory = new RL.Inventory(this.game);
            this.equipment = RL.Util.merge({}, this.equipment);

            var meleeWeapon = RL.Item.make(this.game, 'fists');
            var rangedWeapon = RL.Item.make(this.game, 'throw');

            this.equip(meleeWeapon);
            this.equip(rangedWeapon);

            this.setPerformableAction('open');
            this.setPerformableAction('close');
            this.setPerformableAction('grab');
            this.setPerformableAction('push');
            this.setPerformableAction('pickup');
            this.setPerformableAction('use_item');
            this.setPerformableAction('melee_attack');
            this.setPerformableAction('ranged_attack');

            this.setResolvableAction('melee_attack');
        },

        update: function(action) {

            // if(action === 'cancel'){
            //     this.clearPendingAction();
            // }

            if(this.pendingAction){
                return this.pendingAction(action);
            }

            var isMoveDirection = RL.Util.DIRECTIONS_4.indexOf(action) !== -1;
            if(isMoveDirection){
                return this.move(action);
            }

            if(action === 'wait'){
                return this.wait();
            }

            if(action === 'grab'){
                return this.grab();
            }

            if(action === 'close'){
                return this.close();
            }

            if(action === 'open'){
                return this.open();
            }

            if(action === 'pickup'){
                return this.pickup();
            }

            if(action === 'melee_attack'){
                return this.meleeAttack();
            }

            if(action === 'ranged_attack'){
                return this.rangedAttack();
            }
            return false;
        },

        // action
        move: function(direction){
            var offset = RL.Util.getOffsetCoordsFromDirection(direction),
                x = this.x + offset.x,
                y = this.y + offset.y;

            if(this.canMoveTo(x, y)){

                // move grab target or let go
                if(this.grabTarget){
                    var grabTargetToX = this.grabTarget.x + offset.x,
                        grabTargetToY = this.grabTarget.y + offset.y,
                        pullingToPlayer = (this.x === grabTargetToX && this.y === grabTargetToY);

                    if(pullingToPlayer || this.grabTarget.canMoveTo(grabTargetToX, grabTargetToY)){
                        this.grabTarget.moveTo(grabTargetToX, grabTargetToY);
                    } else {
                        this.game.console.logGrabLetGo(this, this.grabTarget);
                        this.grabTarget = false;
                    }
                }
                this.moveTo(x, y);
                return true;

            } else {
                if(this.movePush(x, y)){
                    return true;
                }

                if(this.moveAttack(x, y)){
                    return true;
                }

                if(this.moveOpen(x, y)){
                    return true;
                }
            }
            return false;
        },

        movePush: function(x, y){
            var _this = this;
            var furniture = this.game.furnitureManager.getFirst(x, y, function(furniture){
                return _this.canPerformActionOnTarget('push', furniture);
            });

            if(!furniture){
                return false;
            }
            return this.performAction('push', furniture);
        },

        moveAttack: function(x, y){
            var entity = this.game.entityManager.get(x, y);
            if(!entity){
                return false;
            }
            return this.performAction('melee_attack', entity);
        },

        moveOpen: function(x, y){
            var _this = this;
            var furniture = this.game.furnitureManager.getFirst(x, y, function(furniture){
                return _this.canPerformActionOnTarget('open', furniture);
            });

            if(!furniture){
                return false;
            }
            return this.performAction('open', furniture);
        },

        // action
        wait: function(){
            this.game.console.logWait(this);
            return true;
        },

        // action
        grab: function(){
            this.pendingActionName = 'grab';
            if(this.grabTarget){
                return this.performAction('grab', this.grabTarget);
            }
            return this.actionAdjacentTargetSelect('grab');
        },

        // action
        close: function(){
            this.pendingActionName = 'close';
            return this.actionAdjacentTargetSelect('close');
        },

        // action
        open: function(){
            this.pendingActionName = 'open';
            return this.actionAdjacentTargetSelect('open');
        },

        // action
        meleeAttack: function(){
            this.pendingActionName = 'melee_attack';
            return this.actionAdjacentTargetSelect('melee_attack');
        },

        // action
        rangedAttack: function(){
            this.pendingActionName = 'ranged_attack';

            var canPerform = this.canPerformAction('ranged_attack');

            if(canPerform){
                var targets = this.getTargetsForAction(this.pendingActionName, {skipCanPerformAction: true});
                if(!targets.length){
                    this.game.console.logNothingTo(this.pendingActionName);
                    return false;
                }

                // uncomment this to auto perform an action when there is only one target
                // if(targets.length === 1){
                //     return this.performAction(this.pendingActionName, targets[0].value, this.pendingActionSettings);
                // }
                var actionTargets = new RL.ValidTargets(this.game, targets);
                this.setPendingAction_actionTargetSelectCoord(this.pendingActionName, actionTargets);
            }
            return false;
        },

        //action
        pickup: function(){
            this.pendingActionName = 'pickup';
            return this.actionAdjacentTargetSelect('pickup');
        },

        // action
        actionAdjacentTargetSelect: function(action){
            var targets = this.getTargetsForAction(this.pendingActionName);
            if(!targets.length){
                this.game.console.logNothingTo(this.pendingActionName);
                this.clearPendingAction();
                return false;
            }

            // auto perform an action when there is only one target
            // if(targets.length === 1){
            //     return this.performAction(this.pendingActionName, targets[0].value, this.pendingActionSettings);
            // }
            var actionTargets = new RL.ValidTargets(this.game, targets);

            this.setPendingAction_actionTargetSelectCoord(this.pendingActionName, actionTargets);
            return false;
        },

        setPendingAction_actionTargetSelectCoord: function(pendingActionName, actionTargets){
            // this.clearPendingAction();

            this.pendingActionName = pendingActionName;
            this.actionTargets = actionTargets;
            this.pendingAction = this.actionTargetSelectCoord;

            this.game.queueDraw = true;

            this.game.console.directionsSelectActionCoord(pendingActionName);
            this.game.console.logSelectActionCoord(pendingActionName);
            this.game.console.logSelectActionCoordChoice(pendingActionName, this.actionTargets.getTargetsAtCurrentCoord());
        },

        // pending action
        actionTargetSelectCoord: function(action){
            if(
                action === 'up' ||
                action === 'down' ||
                action === 'left' ||
                action === 'right'
            ){
                this.game.queueDraw = true;
                this.actionTargets.setCurrentCoordInDirection(action);
                this.game.console.logSelectActionCoordChoice(this.pendingActionName, this.actionTargets.getTargetsAtCurrentCoord());
                return false;
            }

            if(action === this.pendingActionName || action === 'select'){
                var currentTargets = this.actionTargets.getTargetsAtCurrentCoord();
                if(currentTargets.length === 1){
                    var first = currentTargets[0];
                    var target = first.value;
                    this.performAction(this.pendingActionName, target, this.pendingActionSettings);
                    this.clearPendingAction();
                    return true;
                }
                this.setPendingAction_actionTargetSelectFromCoord(this.pendingActionName, this.actionTargets);
                return false;
            }

            this.clearPendingAction();
            return false;
        },

        setPendingAction_actionTargetSelectFromCoord: function(pendingActionName, actionTargets){

            this.pendingActionName = pendingActionName;
            this.actionTargets = actionTargets;
            this.pendingAction = this.actionTargetSelectFromCoord;

            this.queueDraw = true;

            var target = this.actionTargets.getCurrent().value;
            this.game.console.directionsSelectActionTarget(pendingActionName);
            this.game.console.logSelectActionTarget(pendingActionName);
            this.game.console.logSelectActionTargetChoice(pendingActionName, target);
        },

        // pending action
        actionTargetSelectFromCoord: function(action){
            this.actionTargets.ignoreCurrent = false;

            if(
                action === 'prev_target' ||
                action === 'left' ||
                action === 'down'
            ){
                this.game.queueDraw = true;
                this.actionTargets.prev();
                this.game.console.logSelectActionTargetChoice(this.pendingActionName, this.actionTargets.getCurrent().value);
                return false;
            }

            if(
                action === 'next_target' ||
                action === 'right' ||
                action === 'up'
            ){
                this.game.queueDraw = true;
                this.actionTargets.next();
                this.game.console.logSelectActionTargetChoice(this.pendingActionName, this.actionTargets.getCurrent().value);
                return false;
            }

            if(action === this.pendingActionName || action === 'select'){
                var target = this.actionTargets.getCurrent().value;
                this.performAction(this.pendingActionName, target, this.pendingActionSettings);
                this.clearPendingAction();
                return true;
            }

            this.setPendingAction_actionTargetSelectCoord(this.pendingActionName, this.actionTargets);
            this.game.queueDraw = true;
            this.pendingAction = this.actionTargetSelectCoord;
            this.game.console.logSelectActionCoord(this.pendingActionName);
            this.game.console.directionsSelectActionCoord(this.pendingActionName);

            return false;
        },

        takeDamage: function(amount) {
            if(this.game.gameOver){
                return;
            }
            this.hp -= amount;
            var splatter = amount / 10;

            if (this.hp <= 0) {
                splatter *= 1.5;
                this.color = 'red';
                this.game.gameOver = true;
                this.game.console.logDied(this);
                this.game.queueDraw = true;
            }

            this.game.splatter(this.x, this.y, splatter);
        },

        clearPendingAction: function(){
            this.actionTargets = false;
            this.pendingAction = false;
            this.pendingActionName = false;
            this.pendingActionSettings = false;
            this.game.queueDraw = true;
            this.game.console.clearDirections();
        },

        heal: function(amount){
            this.hp += amount;
            if(this.hp > this.hpMax){
                this.hp = this.hpMax;
            }
        },

        getConsoleName: function(){
            return {
                name: this.name,
                color: this.consoleColor
            };
        },
    };

    RL.Util.merge(
        RL.Player.prototype,
        RL.Mixins.Equipment,
        extendedPlayer
    );


}(this));
