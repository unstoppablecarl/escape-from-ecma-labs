// map must be 20x20
var mapData = [
    '####################',
    '#..................#',
    '#.################.#',
    '#.#=.#.#..#.#..#.#.#',
    '#.#..+.#..+.#..+.#.#',
    '#.####.####.####.#.#',
    '#.#..+.#..+.#=.+.#.#',
    '#.#..#.#%.#.#..#.#.#',
    '#.####+####+####+#.#',
    '#.&.....hT.......+.#',
    '#.&..............+.#',
    '#.#+####+####+####.#',
    '#.#.#.%#.#..#.#=.#.#',
    '#.#.+..#.+..#.+..#.#',
    '#.#.####.####.####.#',
    '#.#.+..#.+..#.+..#.#',
    '#.#.#..#.#..#.#.%#.#',
    '#.################.#',
    '#..................#',
    '####################',
];

/*
    Do not add doors to the outside edges.
    A single door will be randomly placed on each side of the map fragment.
    Describe the type of doors that should be placed on each side of your fragment. Color suggestions are appreciated but not required.

    material: wood, metal, glass etc
    blocksLos: true/false
    destroyable: true/false
    hp: 1-10
*/

var doorTypes = {
    top: 'wood',
    bottom: 'wood',
    left: 'wood',
    right: 'wood',
};

/*
    Describe the type of map tile each character represents. Color suggestions are appreciated but not required.
    settings
        blocksLos = true/false
        passable = true/false
 */
var characterToTile = {
    '.': 'floor',
    '#': 'wall', // blocks los and impassable
};

/*
    Describe the type of furniture each character represents.
    Tiles with furniture characters are assumed to be on floor tiles.
    If you need to describe a tile with a type other than floor that has furniture
    you will have to make multiple map layers. Color suggestions are appreciated but not required.

    settings
        blocksLos = true/false
        passable = true/false
        pushable = true/false
        destroyable = true/false
        hp = 1-10
*/
var characterToFurniture = {
    h: 'chair',
    T: 'table',
    '=': 'bed',
    '%': 'corpse',
    '&': 'weak wall', // block los and impassable
};