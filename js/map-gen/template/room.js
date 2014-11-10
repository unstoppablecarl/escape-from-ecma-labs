(function(root) {
    'use strict';

/**
 * valid values (assumed that tile, furiture, and items do not share any type names):
 * values can be recursive
 *
 * single object:
 *      'chair'
 *
 * multiple objects:
 *      ['table', 'computer']
 *
 * random object(s) from list:
 *      {
 *          repeat: 1,
 *          randomNormal: ['table', 'chair'],
 *      }
 *
 * weighted random object(s) from list:
 *      {
 *          repeat: 1,
 *          randomWeighted: [
 *              {weight: 1, value: ['table_alt', 'computer']},
 *              {weight: 3, value: 'table'},
 *              // example of recursive result
 *              {
 *                  weight: 2,
 *                  value: {
 *                      repeat: 2,
 *                      randomNormal: ['fork', 'knife', 'spoon']
 *                  }
 *              },
 *          ],
 *      }
 *
 * percent chance random object(s) from list:
 *      {
 *         // repeat looped over 2 times and results returned
 *         repeat: 2,
 *         randomPercentChance: [
 *              {chance: .25, value: ['table_alt', 'computer']},
 *              {chance: .30, value: 'table'},
 *          ],
 *      }
 *
 */
    var Room = {
        getRandom: function(area) {
            var keys = Object.keys(this[area]);
            var name = keys[Math.floor(Math.random() * keys.length)];
            var result = this[area][name];
            result.name = name;
            result.area = area;
            return result;
        },

        // area
        office: {
            // name
            basic: {
                name: 'basic',
                author: 'unstoppableCarl',
                area: 'office',

                sides: {
                    up: {
                        randomlyPlaceDoor: true,
                        doorFurnitureType: 'door',
                    },
                    down: {
                        randomlyPlaceDoor: true,
                        doorFurnitureType: 'door',
                    },
                    left: {
                        randomlyPlaceDoor: true,
                        doorFurnitureType: 'door',
                    },
                    right: {
                        randomlyPlaceDoor: true,
                        doorFurnitureType: 'door',
                    },
                },

                // can be extended/overridden by
                characterToTileType: {
                    '.': 'floor',
                    '#': 'wall',
                },

                characterToType: {
                    // z: 'zombie',
                    u: 'trashcan',
                    y: 'medkit',
                    h: 'chair',
                    T: 'table'
                },

                layers: [{
                    mapData: [
                        '####################',
                        '#u.y...............#',
                        '#..TTTTTTTTTTTTTT..#',
                        '#..TTTTTTTTTTTTTT..#',
                        '#..................#',
                        '#....z.............#',
                        '#...hh........hh...#',
                        '#..hTTh......hTTh..#',
                        '#...hh........hh...#',
                        '#..................#',
                        '#...hh........hh...#',
                        '#..hTTh......hTTh..#',
                        '#...hh........hh...#',
                        '#..................#',
                        '#...hh........hh...#',
                        '#..hTTh......hTTh..#',
                        '#...hh........hh...#',
                        '#..................#',
                        '#..................#',
                        '####################',
                    ],
                    defaultTileType: 'floor',
                }, {
                    mapData: [
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '                    ',
                        '         hhhhhhhh   ',
                        '                    ',
                        '                    ',
                    ],

                    characterToType: {
                        h: 'trashcan',
                    },
                }]
            },



            executives: {
                name: 'executives',
                author: 'unstoppableCarl',
                area: 'office',

                sides: {
                    up: {
                        randomlyPlaceDoor: false,
                    },
                    down: {
                        randomlyPlaceDoor: false,
                    },
                    left: {
                        randomlyPlaceDoor: false,
                    },
                    right: {
                        randomlyPlaceDoor: false,
                    },
                },

                // can be extended/overridden by
                characterToTileType: {
                    '.': 'floor',
                    '#': 'wall',

                },
                characterToType: {
                    h: 'chair',
                    '+': 'door',
                },
                layers: [{
                    mapData: [
                        '.z.........#########',
                        '.z.........#SSSSSSS#',
                        '....hzhzh..+......z#',
                        '##+######..#.S.S.S.#',
                        '#z.....U#..#.S.S.Sz#',
                        '#...D..S#..#.S.S.S.#',
                        '#...ch.C#..#.SzSzS.#',
                        '#...DDDD#..#.S.S.S.#',
                        '#.......+..#......z#',
                        '#..hThTz#..#########',
                        '##+######..#......[#',
                        '#..CCCSS#..#..h.h.[#',
                        '#.......#..#.hTTT.[#',
                        '#.......+..+..h.hz[#',
                        '#.DcDD..#..#....zz[#',
                        '#.Dhz..U#..#[[[[[[[#',
                        '#########..#########',
                        '#..h#h..#..zz.....z.',
                        '#...#...#.....z.....',
                        '###+#+###...........',
                    ],
                    defaultTileType: 'floor',
                    characterToType: {
                        'C': ['cabnet', {
                            repeat: 2,
                            randomWeighted: [
                                {weight: 1, value: 'bandage'},
                                {weight: 2, value: 'disinfectant'},
                                {weight: 3, value: 'bandaid'},
                                {weight: 3, value: 'umbrella'},
                                {weight: 1, value: 'meat_tenderizer'},
                                {weight: 10, value: false}
                            ]
                        }],
                        'U': 'trashcan',
                        'S': ['shelves', {

                            randomWeighted: [
                                {weight: 10, value: 'coffee_maker'},
                                {weight: 2, value: 'folding_chair'},
                                {weight: 4, value: 'bandaid'},
                                {weight: 2, value: 'meat_tenderizer'},
                                {weight: 3, value: 'umbrella'},
                                {weight: 1, value: 'pointy_stick'},

                                {weight: 10, value: false}
                            ]
                        }],
                        'D': 'desk',
                        'T': 'table',
                        'h': 'chair',
                        '[': ['cabnet', {
                            repeat: 2,
                            randomWeighted: [
                                {weight: 1, value: 'coffee_maker'},
                                {weight: 3, value: 'bandaid'},
                                {weight: 10, value: false}
                            ]
                        }],
                        'c': ['desk', 'computer'],
                        'z': { randomNormal: ['zombie', 'floor'] }
                    },
                }]
            },

            planning_room: {
                name: 'planning_room',
                author: 'srd',
                area: 'office',

                sides: {
                    up: {
                        randomlyPlaceDoor: true,
                        doorFurnitureType: 'door',

                    },
                    down: {
                        randomlyPlaceDoor: true,
                        doorFurnitureType: 'door',

                    },
                    left: {
                        randomlyPlaceDoor: true,
                        doorFurnitureType: 'door',

                    },
                    right: {
                        randomlyPlaceDoor: true,
                        doorFurnitureType: 'door',

                    },
                },

                // can be extended/overridden by
                characterToTileType: {
                    '.': 'floor',
                    '#': 'wall',

                },
                characterToType: {
                    'h': 'chair',
                    '+': 'door',
                    'T': 'table',
                    'C': ['cabnet', {
                            repeat: 2,
                            randomWeighted: [
                                {weight: 1, value: 'icy_hot'},
                                {weight: 2, value: 'bandage'},
                                {weight: 3, value: 'disinfectant'},
                                {weight: 4, value: 'bandaid'},
                                {weight: 3, value: 'pointy_stick'},
                                {weight: 1, value: 'meat_tenderizer'},
                                {weight: 1, value: 'crowbar'},
                                {weight: 14, value: false}
                            ]
                        }],
                    'W': 'whiteboard',
                    'U': 'trashcan',
                    'S': 'shelf',
                    '&': 'window',
                    'z': { randomNormal: ['zombie', 'floor'] }
                },
                layers: [{
                    mapData: [
                        '####################',
                        '&WWWWWWWWWWW.......&',
                        '&.CT.CT.CT.......CT&',
                        '&U.h..h..h........h&',
                        '&...........z.....h&',
                        '&......z..z.z....CT&',
                        '&.......z...z....CT&',
                        '&...........z.....h&',
                        '&..h..h..h........h&',
                        '&.CT.CT.CT.......CT&',
                        '&SSSSSSSSSSSS......&',
                        '&############&&+&&&&',
                        '&.......z..........&',
                        '&..TTTTTT..TTTTTT..&',
                        '&...hTTh....hTTh...&',
                        '&...zTTz....zTTz...&',
                        '&...hTTh....hTTh...&',
                        '&..TTTTTT..TTTTTT..&',
                        '#U...............z.#',
                        '####################',
                    ],
                    defaultTileType: 'floor',
                }]
            },

            cubicle_hell: {
                name: 'cubicle_hell',
                author: 'unstoppableCarl',
                area: 'office',

                sides: {
                    up: {
                        randomlyPlaceDoor: false,
                    },
                    down: {
                        randomlyPlaceDoor: false,
                    },
                    left: {
                        randomlyPlaceDoor: false,
                    },
                    right: {
                        randomlyPlaceDoor: false,
                    },
                },

                // can be extended/overridden by
                characterToTileType: {
                    '.': 'floor',
                    '#': 'wall',
                },
                characterToType: {
                    '=': 'cubicle_wall',
                    'h': 'chair',
                    'T': 'table',
                    'U': 'trashcan',
                    'z': { randomNormal: ['zombie', 'floor'] }
                },
                layers: [{
                    mapData: [
                        '....................',
                        '....................',
                        '..=====.====.=====..',
                        '..=hz...=hz..=hz....',
                        '..=TT...=TT..=TT.=..',
                        '..=====.====.=====..',
                        '..=hz...=hz..=hz....',
                        '..=TT...=TT..=TT.=..',
                        '..=====.====.=====..',
                        '..=hz...=hz..=hz....',
                        '..=TT...=TT..=TT.=..',
                        '..=====.====.=====..',
                        '..=hz...=hz..=hz....',
                        '..=TT...=TT..=TT.=..',
                        '..=====.====.=====..',
                        '..=hz...=hz..=hz....',
                        '..=TT...=TT..=TT.=..',
                        '..=====.====.=====..',
                        '....................',
                        '....................',
                    ],
                    defaultTileType: 'floor'
                }]
            }
        }
    };
    root.RL.MapGen.Template.Room = Room;

}(this));
