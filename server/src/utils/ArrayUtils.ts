import Player from "../game/Player";

function checkLine(array: Player[][], x: number, y: number, dx: number, dy: number): Player {

    const winning = array[y][x];
    if(winning === Player.NONE) {
        return Player.NONE;
    }

    let count = 1;

    for (let i = 0; i < 2; i++) {
        let cx = x;
        let cy = y;

        if (i === 1) {
            dx = -dx;
            dy = -dy;
        }

        let cPlayer: Player | undefined;
        while (cPlayer = array[cy += dy]?.[cx += dx]) {
            if (cPlayer !== winning) {
                return Player.NONE;
            }
            count++;
        }
    }

    if(count === 3) {
        return winning;
    }

    return Player.NONE;
}

export function calculateWin<T>(array: T[][], transformer: ((value: T) => Player)|undefined = undefined, {x, y}: {x: number, y: number} = {x: -1, y: -1}): Player {

    let playerArray: Player[][];

    if(transformer !== undefined) {
        playerArray = array.map(row => row.map(v => transformer(v)));
    } else {
        playerArray = <Player[][]>array;
    }

    if(x !== -1 && y !== -1) {
        let winner = checkLine(playerArray, x, y, 0, 1);
        if(winner === Player.NONE) {
            winner = checkLine(playerArray, x, y, 1, 0);
        }
        if(winner === Player.NONE) {
            winner = checkLine(playerArray, x, y, 1, 1);
        }
        if(winner === Player.NONE) {
            winner = checkLine(playerArray, x, y, -1, 1);
        }
        return winner;
    } else {
        let winner: Player;
        for(let i = 0; i < 3; i++) {
            winner = checkLine(playerArray, 0, i, 1, 0);
            if(winner !== Player.NONE) {
                return winner;
            }
            winner = checkLine(playerArray, i, 0, 0, 1);
            if(winner !== Player.NONE) {
                return winner;
            }
        }

        winner = checkLine(playerArray, 0, 0, 1, 1);
        if(winner !== Player.NONE) {
            return winner;
        }
        return checkLine(playerArray, 2, 0, -1, 1);
    }
}