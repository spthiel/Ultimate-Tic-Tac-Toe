import Board from "./Board";
import Player, {PlayingPlayer} from "./Player";
import {Result, WinResult} from "../interfaces";
import * as ArrayUtils from '../utils/ArrayUtils';

export default class {

    private state: Player = Player.NONE;
    private boards: Board[][] = [];
    private players = {'red': false, 'blue': false};
    private nextBoard: Board|false = false;
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
    }

    public getId() {
        return this.id;
    }

    public placeCell(x: number, y: number, player: PlayingPlayer): Result|WinResult|false;
    public placeCell(boardX: number, boardY: number, cellX: number, cellY: number, player: PlayingPlayer): Result|WinResult|false;

    public placeCell(boardX: number, boardY: number, cellX: number|PlayingPlayer, cellY: number = 0, player: PlayingPlayer = undefined): Result|WinResult|false
    {
        if (player === undefined) {
            return this.placeCell((boardX / 3) | 0, (boardY / 3) | 0, boardX % 3, boardY % 3, cellX);
        }

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

        let newBoardState = board.placeCell(cellX, cellY, player);
        this.nextBoard = this.boards[cellY][cellX].getState() === Player.NONE ? this.boards[cellY][cellX] : false;
        this.nextBoardX = cellX;
        this.nextBoardY = cellY;

        if (newBoardState != Player.NONE) {
            let winner = ArrayUtils.calculateWin(this.boards, (board) => board.getState(), {x: boardX, y: boardY});
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
                for (let {cell} of board) {
                    temp.push(cell.getState());
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
