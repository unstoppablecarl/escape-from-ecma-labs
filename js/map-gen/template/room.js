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
                    },
                    down: {
                        randomlyPlaceDoor: true,
                    },
                    left: {
                        randomlyPlaceDoor: true,
                    },
                    right: {
                        randomlyPlaceDoor: true,
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
                        '##XXXXXXXXXXXXXXXX##',
                        '#                  #',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        '#                  #',
                        '##XXXXXXXXXXXXXXXX##',
                    ],
                    characterToType: {
                        'X': {placeholder: 'valid_door', value: 'door'}
                    }
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
                        '.xxxxxxxxxx#XXXXXXX#',
                        '.z.........#SSSSSSSX',
                        '....hzhzh..+......zX',
                        '##+######..#.S.S.S.X',
                        '#z.....U#..#.S.S.SzX',
                        '#...D..S#..#.S.S.S.X',
                        '#...ch.C#..#.SzSzS.X',
                        '#...DDDD#..#.S.S.S.X',
                        '#.......+..#......zX',
                        '#..hThTz#..#########',
                        '##+######..#......[#',
                        '#..CCCSS#..#..h.h.[#',
                        '#.......#..#.hTTT.[#',
                        '#.......+..+..h.hz[#',
                        '#.DcDD..#..#....zz[#',
                        '#.Dhz..U#..#[[[[[[[#',
                        '#########..#########',
                        '#USSzzzz#..zz.....z.',
                        '#P......+.....z.....',
                        '##XXXXX##xxxxxxxxxx.',
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
                        'P': 'printer',
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
                        'z': { randomNormal: ['zombie', 'floor'] },
                        'X': ['wall', {placeholder: 'valid_door', value: 'door'}],
                        'x': ['floor', {placeholder: 'valid_door', value: 'door'}]
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
                    },
                    down: {
                        randomlyPlaceDoor: true,
                    },
                    left: {
                        randomlyPlaceDoor: true,
                    },
                    right: {
                        randomlyPlaceDoor: true,
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
                },{
                    mapData: [
                        '  ################  ',
                        '                    ',
                        '&                   ',
                        '&                   ',
                        '&                   ',
                        '&                   ',
                        '&                   ',
                        '&                   ',
                        '&                   ',
                        '&                   ',
                        '                    ',
                        '                    ',
                        '&                   ',
                        '&                  &',
                        '&                  &',
                        '&                  &',
                        '&                  &',
                        '&                  &',
                        '                    ',
                        '  ################  ',
                    ],
                    characterToType: {
                        '&': {placeholder: 'valid_door', value: 'door_glass'},
                        '#': {placeholder: 'valid_door', value: 'door'}
                    }
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
                },
                {
                    mapData: [
                        'XXXXXXXXXXXXXXXXXXXX',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'X                  X',
                        'XXXXXXXXXXXXXXXXXXXX',
                    ],
                    characterToType: {
                        'X': {placeholder: 'valid_door', value: 'door'}
                    }
                }]
            }
        }
    };
    root.RL.MapGen.Template.Room = Room;

}(this));
