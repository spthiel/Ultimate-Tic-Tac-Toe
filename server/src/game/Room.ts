import Player, {PlayingPlayer} from "./Player";
import {Result, WinResult} from "../interfaces";
import Board from "./Board";

export default class {

    private state: Player = Player.NONE;
    private bigBoard: Board;
    private boards: Board[][] = [];
    private players = {'red': false, 'blue': false};
    private nextBoard: Board | false = false;
    private nextBoardX: number;
    private nextBoardY: number;
    private turn: PlayingPlayer = Player.RED;

    constructor(
        private id: number
    ) {

        for(let y = 0; y < 3; y++) {
            this.boards[y] = [];
            for(let x = 0; x < 3; x++) {
                this.boards[y][x] = new Board();
            }
        }
        this.bigBoard = new Board();
    }

    public getId() {
        return this.id;
    }
    
    public placeCell(x: number, y: number, player: PlayingPlayer) {
        return this.place((x / 3) | 0, (y / 3) | 0, x % 3, y % 3, player);
    }

    private place(boardX: number, boardY: number, cellX: number, cellY: number = 0, player: PlayingPlayer = undefined): Result|WinResult|false
    {
        if (player !== this.turn) {
            return false;
        }

        let board = this.boards[boardY][boardX];

        if (board !== this.nextBoard && this.nextBoard !== false) {
            return false;
        }

        if (board.getState() !== Player.NONE) {
            return false;
        }

        const lastPlayer = player;

        let newBoardState = board.place(player, cellX, cellY).getOr(undefined);
        
        if (newBoardState === undefined) {
            return false;
        }
        
        this.nextBoard = this.boards[cellY][cellX].getState() === Player.NONE ? this.boards[cellY][cellX] : false;
        this.nextBoardX = cellX;
        this.nextBoardY = cellY;

        if (newBoardState != Player.NONE) {
            let winner = this.bigBoard.place(newBoardState, boardX, boardY).getOr(undefined);
            if (winner === undefined) {
                console.log(`Room ${this.id} ran into an error placing ${newBoardState} at ${boardX}, ${boardY}.`);
                console.log(`Last move was ${boardX},${boardY}:${cellX},${cellY} by ${player}`);
                console.log("State of the boards was: ", this.getState());
                winner = Player.NONE;
            }
            if (winner !== Player.NONE) {
                // Set to impossible value so no player can place anymore
                // @ts-ignore
                this.turn = Player.NONE;
                return {
                    win: winner,
                    placed: {
                        x: cellX + boardX * 3,
                        y: cellY + boardY * 3,
                        placed: lastPlayer
                    }
                }
            }
        }

        this.turn = player === Player.RED ? Player.BLUE : Player.RED;

        return {
            win: newBoardState,
            nextColor: this.turn,
            nextBoard: this.nextBoard && {x: cellX, y: cellY},
            placed: {
                x: cellX + boardX * 3,
                y: cellY + boardY * 3,
                placed: lastPlayer
            }
        };

    }

    public getState(): Player[][] {
        let out: Player[][] = [];

        for (const boardY of this.boards) {
            for (const board of boardY) {
                let temp = []
                for (let player of board) {
                    temp.push(player);
                }
                out.push(temp);
            }
        }

        return out;
    }

    public join(): Player {
        if(!this.players.red) {
            this.players.red = true;
            return Player.RED;
        }
        if(!this.players.blue) {
            this.players.blue = true;
            return Player.BLUE;
        }
        return Player.NONE;
    }

    public leave(color: PlayingPlayer) {
        switch (color) {
            case Player.BLUE:
                this.players.blue = false;
                break;
            case Player.RED:
                this.players.red = false;
                break;
        }
    }

    public getBoardStates(): Player[] {
        let out: Player[] = [];

        for (const boardY of this.boards) {
            for (const board of boardY) {
                out.push(board.getState());
            }
        }

        return out;
    }

    public getTurn() {
        return this.turn;
    }

    public getNextBoard() {
        return this.nextBoard && {x: this.nextBoardX, y: this.nextBoardY}
    }
}
