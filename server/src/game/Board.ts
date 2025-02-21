import Player from "./Player";
import ArrayUtils from "../utils/ArrayUtils";
import Result from "./Result";

export default class implements Iterable<Player>{
	
	private cells: Player[][] = [];
	private state: Player = Player.NONE;
	private placed: number = 0;
	
	constructor() {
		for (let i = 0; i < 3; i++) {
			this.cells.push([Player.NONE, Player.NONE, Player.NONE]);
		}
	}
	
	private set(player: Player, x: number, y: number){
		this.cells[y][x] = player;
	}
	
	public place(player: Player, x: number, y: number): Result<Player, Error> {
		if (this.cells[y][x] !== Player.NONE) {
			return Result.of(new Error("Invalid place"));
		}
		this.set(player, x, y);
		this.placed++;
		const winning = ArrayUtils.calculateWinningPlayer(this.cells, x, y);
		if (winning === Player.BLUE || winning === Player.RED) {
			this.state = winning;
			return Result.of(this.state);
		}
		if (this.placed === 9) {
			this.state = Player.DRAW;
			return Result.of(this.state);
		}
		return Result.of(Player.NONE);
	}
	
	public getState(): Player {
		return this.state;
	}
	
	*[Symbol.iterator]() {
		for(let y = 0; y < 3; y++) {
			for(let x = 0; x < 3; x++) {
				yield this.cells[y][x];
			}
		}
	}
}