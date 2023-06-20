import Room from "./Room";


export default class RoomManager {

    private currentId = 0;
    private rooms: {[id: number]: Room} = {};

    constructor() {

    }

    public destroyRoom(id: number) {
        delete this.rooms[id];
    }

    public createRoom() {
        while(this.rooms[++this.currentId]);
        return this.rooms[this.currentId] = new Room(this.currentId);
    }

    public getRoom(id: number): Room {
        if(!this.rooms[id]) {
            return this.rooms[id] = new Room(id);
        }
        return this.rooms[id];
    }

}
