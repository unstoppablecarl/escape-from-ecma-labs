var initGame = function(settings) {
    settings = settings || {};

    var defaults = {
        playerStartX: 2,
        playerStartY: 2,
        template: RL.MapGen.Template.Floor.office.basic,
        requiredRoomTemplates: [RL.MapGen.Template.Room.exit.elevator],
        randomRoomTemplates: RL.MapGen.Template.Room.areaToArray('office'),
    };

    settings = RL.Util.merge(defaults, settings);

    var playerStartX = settings.playerStartX;
    var playerStartY = settings.playerStartY;
    var template = settings.template;
    var requiredRoomTemplates = settings.requiredRoomTemplates;
    var randomRoomTemplates = settings.randomRoomTemplates;
    var testMode = settings.testMode;
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

    var rendererWidth = 40;
    var rendererHeight = 40;

    RL.ValidTargets.prototype.typeSortPriority = [RL.Entity, RL.Furniture, RL.Item];

    // create the game instance
    var game = new RL.Game();

    if (testMode) {
        game.disableFov = true;
        game.renderer.tileSize = 10;
        rendererWidth = 60;
        rendererHeight = 60;
        playerStartX = 20;
        playerStartY = 20;
        game.player.hp = 2000;
        game.player.hpMax = 2000;
    }

    var floor = new RL.MapGen.Floor(game, template, requiredRoomTemplates, randomRoomTemplates);
    floor.loadToMap();

    // add input keybindings
    game.input.addBindings(keyBindings);

    // set player starting position
    game.player.x = playerStartX;
    game.player.y = playerStartY;

    game.renderer.resize(rendererWidth, rendererHeight);

    game.renderer.layers = [
        new RL.RendererLayer(game, 'map', {
            draw: false,
            mergeWithPrevLayer: false
        }),

        new RL.RendererLayer(game, 'furniture', {
            draw: false,
            mergeWithPrevLayer: true
        }),
        new RL.RendererLayer(game, 'item', {
            draw: false,
            mergeWithPrevLayer: true
        }),
        new RL.RendererLayer(game, 'entity', {
            draw: false,
            mergeWithPrevLayer: true
        }),
        new RL.RendererLayer(game, 'damage', {
            draw: false,
            mergeWithPrevLayer: true
        }),

        new RL.RendererLayer(game, 'lighting', {
            draw: true,
            mergeWithPrevLayer: false
        }),
        new RL.RendererLayer(game, 'sound', {
            draw: true,
            mergeWithPrevLayer: false
        }),
        new RL.RendererLayer(game, 'fov', {
            draw: true,
            mergeWithPrevLayer: false
        }),
    ];

    mapContainerEl.appendChild(game.renderer.canvas);
    consoleContainerEl.appendChild(game.console.el);
    game.console.directionsEl = consoleDirectionsEl;
    miniMapContainerEl.appendChild(game.miniMap.canvas);

    RL.Views.inventory(game);
    RL.Views.controls(keyBindings);
    RL.Views.equipment(game);
    RL.Views.stats(game);

    return game;
};
