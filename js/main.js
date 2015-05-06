
var testMode = false;

var keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D'],
    close: ['C'],
    open: ['O'],
    prev_target: ['COMMA'],
    next_target: ['PERIOD'],
    select: ['ENTER'],
    melee_attack: ['Q'],
    pickup: ['E'],
    ranged_attack: ['F'],
    wait: ['SPACE'],
    grab: ['G'],
    cancel: ['ESC']
};

var mapContainerEl = document.getElementById('map-container');
var consoleContainerEl = document.getElementById('console-container');
var consoleDirectionsEl = document.getElementById('console-directions');
var miniMapContainerEl = document.getElementById('mini-map-container');

var playerStartX = 2;
var playerStartY = 2;

var rendererWidth = 40;
var rendererHeight = 40;

RL.ValidTargets.prototype.typeSortPriority = [RL.Entity, RL.Furniture, RL.Item];

// create the game instance
var game = new RL.Game();

if(testMode){
    game.disableFov = true;
    game.renderer.tileSize = 10;
    rendererWidth = 60;
    rendererHeight = 60;
    playerStartX = 20;
    playerStartY = 20;
    game.player.hp = 2000;
    game.player.hpMax = 2000;
}

var template = RL.MapGen.Template.Floor.office.basic;
var requiredRoomTemplates = [RL.MapGen.Template.Room.exit.elevator];
var randomRoomTemplates = RL.MapGen.Template.Room.areaToArray('office');
var floor = new RL.MapGen.Floor(game, template, requiredRoomTemplates, randomRoomTemplates);
floor.loadToMap();

var zombiePopulator = function(game, min, max){
    var targetCount = Math.floor(RL.Random.range(min, max));
    var currentObjects = game.entityManager.objects;
    RL.MapGen.FloorPopulator({
        targetCount: targetCount,
        currentObjects: currentObjects,
        getPlaceableCoords: function(){
            var placeableCoords = [];
            var zombie = RL.Entity.make(game, 'zombie');
            game.map.each(function(val, x, y){
                if(zombie.canMoveTo(x, y)){
                    placeableCoords.push({x: x, y: y});
                }
            });
            return placeableCoords;
        },
        remove: function(obj){
            game.entityManager.remove(obj);
        },
        add: function(x, y){
            game.entityManager.add(x, y, 'zombie');
        },
    });
};

// zombiePopulator(game, 55, 60);


// add input keybindings
game.input.addBindings(keyBindings);

// set player starting position
game.player.x = playerStartX;
game.player.y = playerStartY;

game.renderer.resize(rendererWidth, rendererHeight);

game.renderer.layers = [
    new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),

    new RL.RendererLayer(game, 'furniture', {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'item',      {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'damage',    {draw: false,   mergeWithPrevLayer: true}),

    new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'sound',     {draw: true,    mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false}),
];

mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);
game.console.directionsEl = consoleDirectionsEl;
miniMapContainerEl.appendChild(game.miniMap.canvas);

// game.furnitureManager.add(25, 7, 'chest');
// game.furnitureManager.add(25, 7, 'crate');

// game.map.each(function(val, x, y){
//     if((x+1) % 5 === 0 && (y+1) % 5 === 0){
//         var tile = game.map.get(x, y);
//         if(tile.type !== 'wall'){
//             game.lighting.set(x, y, 100, 100, 100);
//         }
//     }
// });
//

// var d = 0;
// var canMoveToCheck = function(val, x, y){
//     console.log(x, y, val);
//     d++;
//     val.char = '' + d;
//     return false;
// };

// game.map.get(2, 1).char = 'a';
// game.map.get(5, 1).char = 'b';

// var list = game.map.getLineThrough(2, 1, 5, 1, canMoveToCheck, true, true, 3);
// console.log('list', list);

game.start();

RL.Views.inventory(game);
RL.Views.controls(keyBindings);
RL.Views.equipment(game);
RL.Views.stats(game);

game.renderer.draw();


// test data
//

// game.player.inventory.add(RL.Item.make(game, 'heavy_coat'));

// game.player.equip(RL.Item.make(game, 'umbrella'));


game.player.inventory.addByType('pistol_9mm', 1);
game.player.inventory.addByType('pistol_45cal', 1);


game.player.inventory.addByType('grenade', 10);
game.player.inventory.addByType('shock_grenade', 10);

game.player.inventory.addByType('ammo_9mm', 10);
game.player.inventory.addByType('ammo_45cal', 10);
game.player.inventory.addByType('ammo_shock_cannon', 10);


game.player.equip(RL.Item.make(game, 'shock_cannon'));
game.player.equip(RL.Item.make(game, 'ammo_shock_cannon'));







