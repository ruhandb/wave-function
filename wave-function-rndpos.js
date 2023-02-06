var SIZE = 23;
var SZ_TILE = 32;
var ALL_TILES = [];
var TILES = {};
/* var JOIN = {
    sand: {
        join: {
            water: {
                join: {
                    deepwater: {
                        join: {
                            deepwater2: {
                                join: {
                                    deepwater3: {}
                                }
                            },
                        }
                    },
                }
            }
        },
        full: {
            grass: {
                join: {
                    tree: {
                        join: {
                            forest: {
                                join: {
                                    deepforest: {}
                                }
                            }
                        }
                    },
                    lowgrass: {
                        join: {
                            nograss: {
                                join: {
                                    vilage: {
                                        no_repeat: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} */
var JOIN = {
    highgr: {
        rate: 100,
        join: {
            grass: {
                rate: 100,
                full: {
                    water: {
                        rate: 100,
                        join: {
                            deepwater: {
                                rate: 100
                            }
                        }
                    },
                    highland: {
                        rate: 100,
                    }
                },
                join: {
                    castle_: { rate: 1, no_repeat: true, },
                    road_point: { rate: 2, no_repeat: true, }
                }
            }
        }
    }
};

function connectTiles(parent, tile, obj, isJoin) {
    if (!TILES[tile]) {
        if (!obj.no_repeat) {
            TILES[tile] = {
                rate: obj.rate,
                neighbours: {
                    l: [tile],
                    r: [tile],
                    t: [tile],
                    b: [tile],
                    lt: [tile],
                    rt: [tile],
                    lb: [tile],
                    rb: [tile],
                }
            }
        } else {
            TILES[tile] = {
                no_repeat: true,
                rate: obj.rate,
                neighbours: {
                    l: [],
                    r: [],
                    t: [],
                    b: [],
                    lt: [],
                    rt: [],
                    lb: [],
                    rb: [],
                }
            }
        }
    }
    if (parent) {
        // CONNECT TO PARENT
        if (isJoin) {
            TILES[tile].neighbours.l.push(parent);
            TILES[tile].neighbours.r.push(parent);
            TILES[tile].neighbours.t.push(parent);
            TILES[tile].neighbours.b.push(parent);
            TILES[tile].neighbours.lt.push(parent);
            TILES[tile].neighbours.rt.push(parent);
            TILES[tile].neighbours.lb.push(parent);
            TILES[tile].neighbours.rb.push(parent);
        }
    }
    if (obj.join) {
        Object.keys(obj.join).forEach(tileNeig => {
            TILES[tile].neighbours.l.push(tileNeig);
            TILES[tile].neighbours.r.push(tileNeig);
            TILES[tile].neighbours.t.push(tileNeig);
            TILES[tile].neighbours.b.push(tileNeig);
            TILES[tile].neighbours.lt.push(tileNeig);
            TILES[tile].neighbours.rt.push(tileNeig);
            TILES[tile].neighbours.lb.push(tileNeig);
            TILES[tile].neighbours.rb.push(tileNeig);
            if (obj.join[tileNeig]) {
                connectTiles(tile, tileNeig, obj.join[tileNeig], true);
            }
        });
    }
    if (obj.full) {
        Object.keys(obj.full).forEach(tileNeig => {
            generateFullConnection(tile, tileNeig);
            if (obj.full[tileNeig]) {
                connectTiles(tile, tileNeig, obj.full[tileNeig], false);
            }
        });
    }
}

function generateFullConnection(tileA, tileB) {
    if (tileA > tileB) {
        let aux = tileA;
        tileA = tileB;
        tileB = aux;
    }
    let tilesDef = [
        {
            name: tileA,
            lt: "A", rt: "A",
            lb: "A", rb: "A",
        },
        {
            name: tileB,
            lt: "B", rt: "B",
            lb: "B", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_lr",
            lt: "A", rt: "B",
            lb: "A", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_rl",
            lt: "B", rt: "A",
            lb: "B", rb: "A",
        },
        {
            name: tileA + "_" + tileB + "_tb",
            lt: "A", rt: "A",
            lb: "B", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_bt",
            lt: "B", rt: "B",
            lb: "A", rb: "A",
        }

        ,
        {
            name: tileA + "_" + tileB + "_br",
            lt: "A", rt: "A",
            lb: "A", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_lb",
            lt: "A", rt: "A",
            lb: "B", rb: "A",
        },
        {
            name: tileA + "_" + tileB + "_lt",
            lt: "B", rt: "A",
            lb: "A", rb: "A",
        },
        {
            name: tileA + "_" + tileB + "_tr",
            lt: "A", rt: "B",
            lb: "A", rb: "A",
        }

        ,
        {
            name: tileA + "_" + tileB + "_i_br",
            lt: "B", rt: "B",
            lb: "B", rb: "A",
        },
        {
            name: tileA + "_" + tileB + "_i_lb",
            lt: "B", rt: "B",
            lb: "A", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_i_lt",
            lt: "A", rt: "B",
            lb: "B", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_i_tr",
            lt: "B", rt: "A",
            lb: "B", rb: "B",
        }
    ];

    tilesDef.forEach(def => {
        if (!TILES[def.name]) {
            TILES[def.name] = { rate: 10, neighbours: {} };
        }

        TILES[def.name].neighbours = {
            l: addNeigDef(TILES[def.name].neighbours.l, tilesDef.filter(dn => dn.rb == def.lb && dn.rt == def.lt).map(r => r.name)),
            r: addNeigDef(TILES[def.name].neighbours.r, tilesDef.filter(dn => dn.lb == def.rb && dn.lt == def.rt).map(r => r.name)),
            t: addNeigDef(TILES[def.name].neighbours.t, tilesDef.filter(dn => dn.rb == def.rt && dn.lb == def.lt).map(r => r.name)),
            b: addNeigDef(TILES[def.name].neighbours.b, tilesDef.filter(dn => dn.rt == def.rb && dn.lt == def.lb).map(r => r.name)),
            lt: addNeigDef(TILES[def.name].neighbours.lt, tilesDef.filter(dn => dn.rb == def.lt).map(r => r.name)),
            rt: addNeigDef(TILES[def.name].neighbours.rt, tilesDef.filter(dn => dn.lb == def.rt).map(r => r.name)),
            lb: addNeigDef(TILES[def.name].neighbours.lb, tilesDef.filter(dn => dn.rt == def.lb).map(r => r.name)),
            rb: addNeigDef(TILES[def.name].neighbours.rb, tilesDef.filter(dn => dn.lt == def.rb).map(r => r.name)),
        };
    });

}

function addNeigDef(nDef, list) {
    return nDef ? nDef.concat(list).unique() : list;
}

var INVETED_DIRECTION = {
    l: "r",
    r: "l",
    t: "b",
    b: "t",
    lt: "rb",
    rt: "lb",
    lb: "rt",
    rb: "lt",
};

function customConnect(tileA, tileB, directions, bidirect, rate) {
    if (!TILES[tileA]) {
        TILES[tileA] = {
            rate: rate,
            neighbours: {
                l: [],
                r: [],
                t: [],
                b: [],
                lt: [],
                rt: [],
                lb: [],
                rb: [],
            }
        };
    }
    directions.forEach(direction => {
        if (TILES[tileA].neighbours[direction].indexOf(tileB) < 0) {
            TILES[tileA].neighbours[direction].push(tileB);
        }
        if (bidirect) {
            customConnect(tileB, tileA, [INVETED_DIRECTION[direction]], false);
        }
    });
}

function initTile(tile) {
    if (!TILES[tile]) {
        TILES[tile] = {
            neighbours: {
                l: [],
                r: [],
                t: [],
                b: [],
                lt: [],
                rt: [],
                lb: [],
                rb: [],
            }
        };
    }
    return TILES[tile];
}

function specialConnect(tileS, configS, tileA, tileB, directions) {
    let tilesDef = [
        {
            name: tileA,
            lt: "A", rt: "A",
            lb: "A", rb: "A",
        },
        {
            name: tileB,
            lt: "B", rt: "B",
            lb: "B", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_lr",
            lt: "A", rt: "B",
            lb: "A", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_rl",
            lt: "B", rt: "A",
            lb: "B", rb: "A",
        },
        {
            name: tileA + "_" + tileB + "_tb",
            lt: "A", rt: "A",
            lb: "B", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_bt",
            lt: "B", rt: "B",
            lb: "A", rb: "A",
        }

        ,
        {
            name: tileA + "_" + tileB + "_br",
            lt: "A", rt: "A",
            lb: "A", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_lb",
            lt: "A", rt: "A",
            lb: "B", rb: "A",
        },
        {
            name: tileA + "_" + tileB + "_lt",
            lt: "B", rt: "A",
            lb: "A", rb: "A",
        },
        {
            name: tileA + "_" + tileB + "_tr",
            lt: "A", rt: "B",
            lb: "A", rb: "A",
        }

        ,
        {
            name: tileA + "_" + tileB + "_i_br",
            lt: "B", rt: "B",
            lb: "B", rb: "A",
        },
        {
            name: tileA + "_" + tileB + "_i_lb",
            lt: "B", rt: "B",
            lb: "A", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_i_lt",
            lt: "A", rt: "B",
            lb: "B", rb: "B",
        },
        {
            name: tileA + "_" + tileB + "_i_tr",
            lt: "B", rt: "A",
            lb: "B", rb: "B",
        }
    ];
    let funcCompare = {
        l: (cfgA, cfgB) => cfgB.rb == cfgA.lb && cfgB.rt == cfgA.lt,
        r: (cfgA, cfgB) => cfgA.rb == cfgB.lb && cfgA.rt == cfgB.lt,
        t: (cfgA, cfgB) => cfgA.rt == cfgB.rb && cfgA.lt == cfgB.lb,
        b: (cfgA, cfgB) => cfgA.rb == cfgB.rt && cfgA.lb == cfgB.lt,
        lt: (cfgA, cfgB) => cfgA.lt == cfgB.rb,
        rt: (cfgA, cfgB) => cfgA.rt == cfgB.lb,
        lb: (cfgA, cfgB) => cfgA.lb == cfgB.rt,
        rb: (cfgA, cfgB) => cfgA.rb == cfgB.lt,
    };
    directions.forEach(dir => {
        let tiles = tilesDef.filter(dn => funcCompare[dir](configS, dn)).map(r => r.name);
        TILES[tileS].neighbours[dir] = addNeigDef(TILES[tileS].neighbours[dir], tiles);
        tiles.forEach(tile => {
            customConnect(tile, tileS, [INVETED_DIRECTION[dir]], false);
        });
    });
}

function cloneConnections(fromTile, toTile, directions, exceptions) {
    exceptions = !exceptions ? [] : exceptions;
    let from = initTile(fromTile);
    directions.forEach(dir => {
        from.neighbours[dir].forEach(neig => {
            if (toTile != neig || (toTile == neig && !TILES[toTile].no_repeat)) {
                if (exceptions.indexOf(neig) == -1) {
                    customConnect(toTile, neig, [dir], true);
                }
            }
        });
    });
}

var gridPos = [];
var grid = [];
var startDate = new Date();

window.onload = function () {
    /* connectTiles(undefined, "sand", JOIN.sand, true); */
    connectTiles(undefined, "highgr", JOIN.highgr, true);

    customConnect("bridge_h", "bridge_h", ["r"], true, 1);
    cloneConnections("water", "bridge_h", ["t", "b", "lt", "rt", "lb", "rb"], ["bridge_h", "deepwater"]);

    customConnect("bridge_grass_lr", "bridge_h", ["l"], true, 1);
    cloneConnections("grass_water_rl", "bridge_grass_lr", ["t", "b", "lt", "lb"]);

    customConnect("bridge_grass_rl", "bridge_h", ["r"], true, 1);
    cloneConnections("grass_water_lr", "bridge_grass_rl", ["t", "b", "rt", "rb"]);

    cloneConnections("grass", "road_point", ["r", "l", "t", "b", "lt", "rt", "lb", "rb"], ["castle_"]);
    cloneConnections("grass", "castle_", ["r", "l", "t", "b", "lt", "rt", "lb", "rb"], ["road_point"]);

    customConnect("road_h", "bridge_grass_rl", ["r"], true, 10);
    customConnect("road_h", "bridge_grass_lr", ["l"], true);

    customConnect("road_h", "road_h", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_h", "road_lt", ["r", "lt", "rt", "lb", "rb"], true);
    customConnect("road_h", "road_lb", ["r", "lt", "rt", "lb", "rb"], true);
    customConnect("road_h", "road_tr", ["l", "lt", "rt", "lb", "rb"], true);
    customConnect("road_h", "road_br", ["l", "lt", "rt", "lb", "rb"], true);
    cloneConnections("grass", "road_h", ["t", "b", "lt", "rt", "lb", "rb"]);

    cloneConnections("road_h", "bridge_grass_rl", ["l", "lt", "lb"]);
    cloneConnections("road_h", "bridge_grass_lr", ["r", "rt", "rb"]);

    customConnect("road_v", "road_v", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true, 10);
    customConnect("road_v", "road_h", ["lt", "rt", "lb", "rb"], true);
    customConnect("road_v", "road_lt", ["b", "lt", "rt", "lb", "rb"], true);
    customConnect("road_v", "road_tr", ["b", "lt", "rt", "lb", "rb"], true);
    customConnect("road_v", "road_lb", ["t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_v", "road_br", ["t", "lt", "rt", "lb", "rb"], true);
    cloneConnections("grass", "road_v", ["l", "r", "lt", "rt", "lb", "rb"]);

    customConnect("road_lt", "castle_", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_tr", "castle_", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_lb", "castle_", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_br", "castle_", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_h", "castle_", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_v", "castle_", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    cloneConnections("castle_", "road_point", ["l", "r", "lt", "rt", "lb", "rb"], ["castle_"]);

    /* customConnect("road_lt", "road_point", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_tr", "road_point", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_lb", "road_point", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_br", "road_point", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_h", "road_point", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_v", "road_point", ["b", "r", "l", "t", "lt", "rt", "lb", "rb"], true);
 */
    cloneConnections("grass", "road_lt", ["b", "r", "lt", "rt", "lb", "rb"]);
    cloneConnections("grass", "road_tr", ["b", "l", "lt", "rt", "lb", "rb"]);
    cloneConnections("grass", "road_lb", ["t", "r", "lt", "rt", "lb", "rb"]);
    cloneConnections("grass", "road_br", ["t", "l", "lt", "rt", "lb", "rb"]);

    customConnect("road_lt", "road_lb", ["t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_lt", "road_br", ["t", "l", "lt", "rt", "lb", "rb"], true);
    customConnect("road_lt", "road_tr", ["l", "lt", "rt", "lb", "rb"], true);

    customConnect("road_lb", "road_lt", ["b", "lt", "rt", "lb", "rb"], true);
    customConnect("road_lb", "road_tr", ["b", "l", "lt", "rt", "lb", "rb"], true);
    customConnect("road_lb", "road_br", ["l", "lt", "rt", "lb", "rb"], true);

    customConnect("road_tr", "road_br", ["t", "lt", "rt", "lb", "rb"], true);
    customConnect("road_tr", "road_lb", ["t", "r", "lt", "rt", "lb", "rb"], true);
    customConnect("road_tr", "road_lt", ["r", "lt", "rt", "lb", "rb"], true);

    customConnect("road_br", "road_tr", ["b", "lt", "rt", "lb", "rb"], true);
    customConnect("road_br", "road_lt", ["b", "r", "lt", "rt", "lb", "rb"], true);
    customConnect("road_br", "road_lb", ["r", "lt", "rt", "lb", "rb"], true);


    console.log(TILES);
    ALL_TILES = Object.keys(TILES);
    console.log(ALL_TILES);

    for (let i = 0; i < SIZE; i++) {
        grid.push([]);
        for (let j = 0; j < SIZE; j++) {
            grid[i].push([].concat(ALL_TILES));
            gridPos.push({ x: j, y: i });
        }
    }
    generateTile();
};

function generateTile() {
    window.setTimeout(() => {
        if (gridPos.length > 0) {
            //let tilePosdx = gridPos.length % (SIZE * 3) == 0 ? getRandomTile() : getNearRandomTile();
            //let tilePosdx = getNearRandomTile();

            let tilePosdx = gridPos.length % (SIZE * 3) == 0 ? getRandomTile() : geWaveFunctionTile();
            //let tilePosdx = geWaveFunctionTile();

            //let tilePosdx = getRandomTile();
            let tileOptions = getTileOptions(grid[tilePosdx.y][tilePosdx.x]);
            grid[tilePosdx.y][tilePosdx.x] = [tileOptions[rand(0, tileOptions.length - 1)]];
            propagateChanges(tilePosdx.y, tilePosdx.x);
            printTile(tilePosdx.y, tilePosdx.x);
            generateTile();
        } else {
            console.log(new Date(new Date() - startDate).toISOString().slice(11, -1));  // "03:25:45.000"
        }
    }, 0);
}
function getTileOptions(options) {
    let listResult = [];
    options.forEach(tile => {
        for (let i = 0; i < (TILES[tile].rate ? TILES[tile].rate : 10); i++) {
            listResult.push(tile);
        }

        /*  if (tile.indexOf("_") > -1) {
             listResult.push(tile);
         } else {
             
             listResult = listResult.concat([tile, tile, tile, tile, tile, tile, tile, tile, tile, tile, tile, tile ]);
             
         } */
    });
    return listResult;
}

function printTile(y, x) {
    var div = document.createElement("div");
    div.style.width = SZ_TILE + "px";
    div.style.height = SZ_TILE + "px";
    div.style.backgroundImage = "url(tiles/" + grid[y][x][0] + ".png)";
    div.style.position = "absolute";
    div.style.top = (y * SZ_TILE) + "px";
    div.style.left = (x * SZ_TILE) + "px";
    container.appendChild(div);
}



function propagateChanges(y, x) {

    let checkList = [];
    addNeigToCheck(checkList, y, x);
    for (let index = 0; index < checkList.length; index++) {
        const t = checkList[index];
        let neighbours = [];
        for (let i = 0; i < grid[y][x].length; i++) {
            const tile = grid[y][x][i];
            if (neighbours.length < ALL_TILES.length) {
                neighbours = neighbours.concat(TILES[tile].neighbours[t.pos]).unique();
            } else {
                return false;
            }
        }
        let newList = grid[t.y][t.x].filter(value => neighbours.includes(value));
        if (newList.length < grid[t.y][t.x].length && newList.length > 0) {
            grid[t.y][t.x] = newList;
            if (newList.length == 1) {
                printTile(t.y, t.x);
                let pos = gridPos.map((t, i) => { t.index = i; return t; }).find(p => p.y == t.y && p.x == t.x);
                if (pos) {
                    gridPos.splice(pos.index, 1);
                }
            }
            propagateChanges(t.y, t.x);
        } else if (newList.length == 0) {
            console.log(t.y, t.x, "wave fail");
        }
    }
}

function addNeigToCheck(checkList, y, x) {
    if (y > 0) {
        checkList.push({ y: y - 1, x: x, pos: "t" });
    }
    if (y < SIZE - 1) {
        checkList.push({ y: y + 1, x: x, pos: "b" });
    }
    if (x > 0) {
        checkList.push({ y: y, x: x - 1, pos: "l" });
    }
    if (x < SIZE - 1) {
        checkList.push({ y: y, x: x + 1, pos: "r" });
    }
    if (y > 0 && x > 0) {
        checkList.push({ y: y - 1, x: x - 1, pos: "lt" });
    }
    if (y > 0 && x < SIZE - 1) {
        checkList.push({ y: y - 1, x: x + 1, pos: "rt" });
    }
    if (y < SIZE - 1 && x > 0) {
        checkList.push({ y: y + 1, x: x - 1, pos: "lb" });
    }
    if (y < SIZE - 1 && x < SIZE - 1) {
        checkList.push({ y: y + 1, x: x + 1, pos: "rb" });
    }
}

function getRandomTile() {
    let idx = rand(0, gridPos.length - 1);
    let tile = gridPos[idx];
    gridPos.splice(idx, 1);
    return tile;
}
function geWaveFunctionTile() {
    let filteredGridPos = gridPos.map((t, i) => { t.index = i; return t; }).filter(t => {
        return grid[t.y][t.x].length > 1;
    }).sort((tA, tB) => grid[tA.y][tA.x].length - grid[tB.y][tB.x].length);

    filteredGridPos = filteredGridPos.filter(t => grid[t.y][t.x].length == grid[filteredGridPos[0].y][filteredGridPos[0].x].length);

    if (filteredGridPos.length == 0) {
        filteredGridPos = gridPos;
    }

    let idx = rand(0, filteredGridPos.length - 1);
    let tile = filteredGridPos[idx];
    gridPos.splice(tile.index ? tile.index : idx, 1);
    return tile;
}

function getNearRandomTile() {
    let filteredGridPos = gridPos.map((t, i) => { t.index = i; return t; }).filter(t => {
        return hasTileNear(t.y, t.x);
    });

    if (filteredGridPos.length == 0) {
        filteredGridPos = gridPos;
    }

    let idx = rand(0, filteredGridPos.length - 1);
    let tile = filteredGridPos[idx];
    gridPos.splice(tile.index ? tile.index : idx, 1);
    return tile;
}

function hasTileNear(y, x) {
    return checkTile(y - 1, x)
        || checkTile(y + 1, x)
        || checkTile(y, x - 1)
        || checkTile(y, x + 1)
        || checkTile(y - 1, x - 1)
        || checkTile(y + 1, x + 1)
        || checkTile(y + 1, x - 1)
        || checkTile(y - 1, x + 1);

}

function checkTile(y, x) {
    if (y >= 0 && x >= 0 && y < SIZE && x < SIZE) {
        return grid[y][x].length == 1;
    }
    return false;
}

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};

function concat(filteredArray, tiles) {
    if (tiles.length < ALL_TILES.length) {
        filteredArray = filteredArray.concat(tiles).unique();
    }
    return filteredArray;
}

function rand(lowest, highest) {
    var adjustedHigh = (highest - lowest) + 1;
    return Math.floor(Math.random() * adjustedHigh) + parseFloat(lowest);
}

function trueOrFalse() {
    return rand(0, 1) == 1;
}

function gid(id) {
    return document.getElementById(id);
}