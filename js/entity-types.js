(function(root) {
    'use strict';



    var entityTypes = {
        zombie: {
            name: 'Zombie',
            char: 'z',
            color: RL.Util.COLORS.red,
            bgColor: false,
            charStrokeColor: '#000',
            charStrokeWidth: 2,

            consoleColor: RL.Util.COLORS.red_alt,

            playerLastSeen: false,

            turnsSinceStumble: 0,
            maxTurnsWithoutStumble: 10,

            hp: 3,
            hpMax: 3,

            hordePushBonus: 0,

            bleeds: true,

            alerted: false,

            behavior: 'wandering',

            sightRange: 30,

            equipment: {
                armor: null,
                weaponMelee: null,
                weaponRanged: null,
                ammo: null,
            },

            moveSoundChance: 0.5,
            attackSoundChance: 0.95,

            knockedDownCount: 0,

            init: function() {
                this.equipment = RL.Util.merge({}, this.equipment);

                var weaponMelee = RL.Item.make(this.game, 'claws');
                this.equip(weaponMelee);

                this.setPerformableAction('melee_attack', 'melee_attack_zombie');
                this.setPerformableAction('horde_push_bonus');

                this.setResolvableAction('melee_attack');
                this.setResolvableAction('ranged_attack');
                this.setResolvableAction('horde_push_bonus');
                this.log = [];
            },



            update: function() {
                this.alerted = false;
                var result = this._update();
                this.hordePushBonus = 0;
                return result;
            },

            /**
             * Called every turn by the entityManger (entity turns are triggered after player actions are complete)
             * @method update
             */
            _update: function() {
                if(this.immobilized){
                    return true;
                }
                if(this.knockedDownCount){
                    this.knockedDownCount--;
                    this.behavior = 'knocked down';
                    return true;
                }
                var stumbleChance = this.turnsSinceStumble / this.maxTurnsWithoutStumble;
                if(this.turnsSinceStumble && Math.random() < stumbleChance) {
                    this.turnsSinceStumble = 0;
                    this.behavior = 'stumbling';
                    return true;
                }
                this.turnsSinceStumble++;

                this.updatePlayerLastSeen();

                if(this.isAdjacent(this.game.player.x, this.game.player.y)) {
                    this.behavior = 'attacking';
                    return this.performAction('melee_attack', this.game.player);
                }
                if(this.log.length > 20){
                    this.log = this.log.slice(-20);
                }
                this.log.push('-- new turn');
                var destination;
                if(this.playerLastSeen) {
                    destination = this.getNextPathTile(this.playerLastSeen.x, this.playerLastSeen.y);
                    this.log.push('player last seen');
                    this.behavior = 'investigating';
                    if(destination && !this.canMoveTo(destination.x, destination.y)){
                        destination = false;
                    }
                    if(!destination) {
                        this.log.push('cannot move to next player last seen path tile');
                        // get next path tile ignoring furniture and entities
                        destination = this.getNextPathTile(this.playerLastSeen.x, this.playerLastSeen.y, true);

                        if(destination) {
                            this.log.push('found next path tile ignoring furniture and entities');
                            var furniture = this.game.furnitureManager.getFirst(destination.x, destination.y, function(furniture) {
                                return !furniture.passable;
                            });
                            if(furniture) {
                                this.log.push('furniture in the way');
                                if(this.canPerformActionOnTarget('melee_attack', furniture)){
                                    this.log.push('cann attack furniture');
                                }
                                return this.performAction('melee_attack', furniture);
                            } else {
                                var entity = this.game.entityManager.get(destination.x, destination.y);
                                if(entity){
                                    this.log.push('entity in the way');
                                    if(this.performAction('horde_push_bonus', entity)) {
                                        this.log.push('performed horde_push_bonus');
                                        return true;
                                    } else{
                                        this.log.push('cannot perform horde push bonus set destination to false');
                                        destination = false;
                                    }
                                }
                            }
                        }
                    }
                }

                if(!destination) {
                    destination = this.getRandomAdjacentTile();
                    this.behavior = 'wandering';
                    this.log.push('get random adjacent: ' + destination.x + ',' + destination.y);
                }

                if(destination) {
                    this.log.push('moving to: ' + destination.x + ',' + destination.y);

                    if(!this.canMoveTo(destination.x, destination.y)){
                        var x = 1;
                    }
                    this.moveTo(destination.x, destination.y);
                    return true;
                }
                this.log.push('no move');

            },

            updatePlayerLastSeen: function() {
                if(this.playerVisible()) {
                    if(!this.playerLastSeen){
                        this.alerted = true;
                    }
                    this.playerLastSeen = {
                        x: this.game.player.x,
                        y: this.game.player.y
                    };
                }

                // if reached player last seen at tile clear it
                if(this.playerLastSeen &&
                    this.x === this.playerLastSeen.x &&
                    this.y === this.playerLastSeen.y
                ) {
                    this.playerLastSeen = false;
                }
            },



            playerVisible: function() {
                if(this.game.player.fov.get(this.x, this.y)){
                    var distance = RL.Util.getDistance(this.x, this.y, this.game.player.x, this.game.player.y);
                    if(distance <= this.sightRange){
                        return true;
                    }
                }
                return false;
            },


            getTileDrawData: function(){
                var result = RL.Entity.prototype.getTileDrawData.call(this);
                if(this.hp !== this.hpMax){
                    var hpRatio = this.hp / this.hpMax;
                    var ROTColor = ROT.Color;
                    var color = ROTColor.fromString(result.color);
                    color = ROTColor.interpolate([255,200,0],color, hpRatio);
                    result.color = ROTColor.toHex(color);
                }

                if(this.alerted){
                    result.color = RL.Util.COLORS.red_alt;
                    result.after = {
                        char: '!',
                        fontSize: '8px',
                        offsetY: -this.game.renderer.tileSize * 0.5,
                        offsetX: this.game.renderer.tileSize * 0.5,
                        textBaseline: 'top',
                        textAlign: 'right',
                        color: 'red',
                        charStrokeColor: '#000',
                        charStrokeWidth: 3
                    };
                }
                return result;
            },



        },
    };

    for(var type in entityTypes){
        var objProto = entityTypes[type];
        RL.Entity.addType(type, objProto);
    }

    /*
        zombie types

            marketing
            developer
            brogrammer
            project manager
            middle manager
            designer
            IT
            DBA

            sales team

            security
            maintenance

    */

}(this));
