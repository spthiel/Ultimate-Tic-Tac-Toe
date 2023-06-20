import Cell from "./Cell";
import Player from "./Player";
import * as ArrayUtils from '../utils/ArrayUtils';

export default class implements Iterable<{x: number, y: number, cell: Cell}>{

    private cells: Cell[][] = [];
    private state: Player = Player.NONE;

    constructor() {

        for(let y = 0; y < 3; y++) {
            this.cells[y] = [];
            for(let x = 0; x < 3; x++) {
                this.cells[y][x] = new Cell();
            }
        }
    }

    public placeCell(x: number, y: number, player: Player): Player {
        this.cells[y][x].setState(player);
        return this.state = ArrayUtils.calculateWin(this.cells, (cell) => cell.getState(), {x, y});
    }

    public getState(): Player {
        return this.state;
    }

    *[Symbol.iterator]() {
        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                yield {x, y, cell: this.cells[x][y]};
            }
        }
    }

}