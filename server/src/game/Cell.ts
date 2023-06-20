import Player from "./Player";

export default class {

    private state: Player;

    constructor() {
        this.state = Player.NONE;
    }

    public setState(player: Player) {
        this.state = player;
    }

    public getState(): Player {
        return this.state;
    }

}