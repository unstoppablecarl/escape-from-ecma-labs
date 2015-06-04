

var settings = {
    playerStartX: 24,
    playerStartY: 24,
    template: RL.MapGen.Template.Floor.test.firing_range,
    // requiredRoomTemplates: null,
    // randomRoomTemplates: null,
};

RL.Entity.Types.zombie.prototype.immobilized = true;

var game = initGame(settings);

game.start();



// var render = function(){
//     game.renderer.draw();
//     window.requestAnimationFrame(render);
// };

// render();


// test data
//

game.player.equip(RL.Item.make(game, 'heavy_coat'));

game.player.equip(RL.Item.make(game, 'umbrella'));


game.player.inventory.addByType('pistol_9mm', 1);
game.player.inventory.addByType('pistol_45cal', 1);


game.player.inventory.addByType('grenade', 10);
game.player.inventory.addByType('shock_grenade', 10);

game.player.inventory.addByType('ammo_9mm', 10);
game.player.inventory.addByType('ammo_45cal', 10);
game.player.inventory.addByType('ammo_shock_cannon', 10);
game.player.inventory.addByType('ammo_shock_cannon_thumper', 10);


game.player.equip(RL.Item.make(game, 'shock_cannon'));
game.player.equip(RL.Item.make(game, 'ammo_shock_cannon_thumper'));


// console.profile('foo');
// var max = 20;
// var i = 0;
// var intervalID = window.setInterval(function(){
//     console.log('tic');
//     game.onKeyAction('left');

//     i++;
//     if(i > max){
//         console.profileEnd();
//         clearInterval(intervalID);
//     }
// }, 20);



