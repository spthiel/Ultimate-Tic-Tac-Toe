enum Player {
    NONE = 0,
    RED = 1,
    BLUE = 2,
    DRAW = 3,
}

export type PlayingPlayer = Player.RED | Player.BLUE;

export default Player;
