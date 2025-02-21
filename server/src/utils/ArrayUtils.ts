import Player from "../game/Player";

function checkSingleLine(array: Player[]): Player {
    if (array.length === 0) {
        return Player.NONE
    }
    
    if (array.includes(Player.DRAW)) {
        return Player.DRAW;
    }
    
    if (array.includes(Player.NONE)) {
        return Player.NONE;
    }
    
    if (array.includes(Player.BLUE)) {
        if (array.includes(Player.RED)) {
            return Player.DRAW;
        }
        
        return Player.BLUE;
    }
    
    return Player.RED
}

function checkLine(array: Player[][], x: number, y: number, dx: number, dy: number): Player | false {

    // Checking diagonal
    if (dx !== 0 && dy !== 0) {
        const sameSign = (dx ^ dy) >= 0
        // but not on the correct diagonal
        if (sameSign && x !== y) {
            return false;
        }
        if (!sameSign && x !== 2 - y) {
            return false;
        }
    }
    
    if (dx < 0) {
        dx = -dx;
        dy = -dy;
    }
    
    if (dx !== 0) {
        while (x > 0) {
            x -= dx;
            y -= dy;
        }
    } else {
        while (y > 0) {
            y -= dy;
        }
    }
    
    const collected = [];
    
    for (let i = 0; i < 3; i++) {
        collected.push(array[y][x]);
        x += dx;
        y += dy;
    }
    
    return checkSingleLine(collected);
}

function *directions() {
    yield [-1, 1];
    yield [0, 1];
    yield [1, 0];
    yield [1, 1];
}

function calculateWinningPlayer(array: Player[][], x: number, y: number) {
    let winner = Player.DRAW;
    for (const [dx, dy] of directions()) {
        const lineWinner = checkLine(array, x, y, dx, dy);
        if (lineWinner === false) {
            continue;
        }
        if (lineWinner === Player.NONE) {
            winner = Player.NONE;
            continue;
        }
        
        if (lineWinner !== Player.DRAW) {
            return lineWinner;
        }
    }
    return winner;
}

export function calculateWin<T>(array: T[][], transformer: ((value: T) => Player)|undefined, x: number, y: number): Player {

    let playerArray: Player[][];

    if(transformer !== undefined) {
        playerArray = array.map(row => row.map(v => transformer(v)));
    } else {
        playerArray = <Player[][]>array;
    }

    return calculateWinningPlayer(playerArray, x, y);
}

export default {
    checkSingleLine,
    checkLine,
    calculateWin,
    calculateWinningPlayer
}