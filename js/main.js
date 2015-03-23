
var testMode = true;

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
var floor = new RL.MapGen.Floor(game, template);
floor.loadToMap();
floor.placeRooms();

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

game.start();

RL.Views.inventory(game);
RL.Views.controls(keyBindings);
RL.Views.equipment(game);
RL.Views.stats(game);




