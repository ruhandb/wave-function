var SIZE = 30;
var SZ_TILE = 10;
var ALL_TILES = [/* "dirt", */ "grass", "tree", "forest", "deepforest"/* ,"deepforest2" */, "sand", "water", "deepwater", "deepwater2"/* , "deepwater3" */];
var TILES = {
    grass: { color: "#84a98c", neighbours: ["grass", "grass", "tree", "sand"/* , "dirt" */] },
    //dirt: { color: "#BF8967", neighbours: ["dirt", "dirt", "sand", "grass"] },
    tree: { color: "#52796f", neighbours: ["tree", "tree", "grass", "forest"] },
    forest: { color: "#354f52", neighbours: ["forest", "forest", "tree", "deepforest"] },
    deepforest: { color: "#354f41", neighbours: ["deepforest", "deepforest", "forest"/* , "deepforest2" */] },
    /* deepforest2: { color: "#354f30", neighbours: ["deepforest2", "deepforest2", "deepforest"] }, */
    sand: { color: "#ffd166", neighbours: ["sand", "sand", "grass", "water"/* , "dirt" */] },
    water: { color: "#8ecae6", neighbours: ["water", "water", "sand", "deepwater"] },
    deepwater: { color: "#219ebc", neighbours: ["deepwater", "deepwater", "water", "deepwater2"] },
    deepwater2: { color: "#219eab", neighbours: ["deepwater2", "deepwater2", "deepwater"/* , "deepwater3" */] },
    /* deepwater3: { color: "#219e9a", neighbours: ["deepwater3", "deepwater3", "deepwater2"] } */
}

/* var ALL_TILES = ["grass", "sand", "water"];
var TILES = {
    grass: { color: "#84a98c", neighbours: ["grass","grass","grass","grass","grass","grass","grass","grass", "sand"] },
    // dirt: { color: "#BF8967", neighbours: ["dirt", "dirt", "sand", "grass"] },
    //tree: { color: "#52796f", neighbours: ["tree","tree", "grass", "forest"] },
    //forest: { color: "#354f52", neighbours: ["forest", "forest", "tree"] }, 
    sand: { color: "#ffd166", neighbours: ["sand","sand","sand","sand","sand","sand","sand","sand", "grass", "water"] },
    water: { color: "#8ecae6", neighbours: ["water","water","water","water","water","water","water","water", "sand"] },
    // deepwater: { color: "#219ebc", neighbours: ["deepwater","deepwater", "water"] } 
} */

var gridPos = [];
var grid = [];

window.onload = function () {
    /* console.log("onload"); */
    let container = gid("container");
    container.style.height = "500px";
    container.style.width = "500px";
    container.style.backgroundColor = "black";


    for (let i = 0; i < SIZE; i++) {
        grid.push([]);
        for (let j = 0; j < SIZE; j++) {
            //grid[i].push(getTile(grid, i, j));
            grid[i].push(undefined);
            gridPos.push({ x: j, y: i });

        }
    }
    printTile();
};

function printTile() {
    window.setTimeout(() => {
        if (gridPos.length > 0) {
            let tilePosdx = gridPos.length % (SIZE * 2) == 0 ? getRandomTile() : getNearRandomTile();
            grid[tilePosdx.y][tilePosdx.x] = getTile(grid, tilePosdx.y, tilePosdx.x);
            var div = document.createElement("div");
            div.style.width = SZ_TILE + "px";
            div.style.height = SZ_TILE + "px";
            div.style.background = TILES[grid[tilePosdx.y][tilePosdx.x]].color;
            div.style.position = "absolute";
            div.style.top = (tilePosdx.y * SZ_TILE) + "px";
            div.style.left = (tilePosdx.x * SZ_TILE) + "px";
            container.appendChild(div);
            printTile();
        }
    }, 0);
}

function getRandomTile() {
    let idx = rand(0, gridPos.length - 1);
    let tile = gridPos[idx];
    gridPos.splice(idx, 1);
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
        return !!grid[y][x];
    }
}

function getTile(grid, y, x) {
    var filteredArray = getNeighbours(grid, y, x, 0)


    var r = rand(0, filteredArray.length - 1);
    var tile = filteredArray[r];
    /* console.log(r, tile); */

    return tile;
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

function getNeighbours(grid, y, x, level) {
    let leftTile = getPossibilities(grid, y, x - 1, level);
    let rightTile = getPossibilities(grid, y, x + 1, level);
    let topTile = getPossibilities(grid, y - 1, x, level);
    let bottomTile = getPossibilities(grid, y + 1, x, level);
    let topLeftTile = getPossibilities(grid, y - 1, x - 1, level);
    let topRightTile = getPossibilities(grid, y - 1, x + 1, level);
    let bottomLeftTile = getPossibilities(grid, y + 1, x - 1, level);
    let bottomRightTile = getPossibilities(grid, y + 1, x + 1, level);

    var filteredArray = topTile.filter(value => leftTile.includes(value));
    filteredArray = filteredArray.filter(value => rightTile.includes(value));
    filteredArray = filteredArray.filter(value => bottomTile.includes(value));
    filteredArray = filteredArray.filter(value => topLeftTile.includes(value));
    filteredArray = filteredArray.filter(value => topRightTile.includes(value));
    filteredArray = filteredArray.filter(value => bottomLeftTile.includes(value));
    filteredArray = filteredArray.filter(value => bottomRightTile.includes(value));
    if (filteredArray.length == 0) {
        filteredArray = [];
        concat(filteredArray, leftTile);
        concat(filteredArray, rightTile);
        concat(filteredArray, bottomTile);
        concat(filteredArray, topTile);
        concat(filteredArray, topLeftTile);
        concat(filteredArray, topRightTile);
        concat(filteredArray, bottomLeftTile);
        concat(filteredArray, bottomRightTile);
        if (filteredArray.length == 0) {
            filteredArray = ALL_TILES;
        }
    }
    return filteredArray;
}

function concat(filteredArray, tiles) {
    if (tiles.length < ALL_TILES.length) {
        filteredArray = filteredArray.concat(tiles).unique();
    }
    return filteredArray;
}


function getPossibilities(grid, y, x, level) {

    if (y >= 0 && x >= 0 && y < SIZE && x < SIZE && level < 5) {
        if (TILES[grid[y][x]]) {
            return TILES[grid[y][x]].neighbours;
        } else {
            let neighbours = [];
            getNeighbours(grid, y, x, level + 1).forEach(tile => {
                //if (neighbours.length < ALL_TILES.length) {
                neighbours = neighbours.concat(TILES[tile].neighbours);//.unique();
                //}
            });
            return neighbours;
        }
    }
    return ALL_TILES;
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