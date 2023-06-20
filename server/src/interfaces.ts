import type {PlayingPlayer} from "./game/Player";
import Player from "./game/Player";

export interface BoardDef {
    x: number,
    y: number
}

export interface WinResult {
    win: Player,
    placed: {x: number, y: number, placed: PlayingPlayer}
}

export interface Result extends WinResult{
    nextBoard: BoardDef | false,
    nextColor: Player
}

export interface Join {
    status: string
}

export interface ErrorJoin extends Join {
    status: "error",
    message: string,
    code: number

}

export interface SuccessJoin extends Join {
    status: "success",
    color: Player,
    board: number[][],
    room: number,
    boards: number[],
    next: {
        player: PlayingPlayer,
        board: BoardDef | false
    }
}

export type PlaceResult = WinResult|Result|false;