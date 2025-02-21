import {Server} from "socket.io";
import http from 'http';
import Player from "../game/Player";
import RoomManager from "../game/RoomManager";
import Room from "../game/Room";

const roomManager = new RoomManager();

export default function(server: http.Server) {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        },
    });

    io.on("connection", (socket) => {

        let color = Player.NONE;
        let room: Room;

        socket.on("join", (id) => {
            if (!id || id === "0") {
                room = roomManager.createRoom();
            } else {
                room = roomManager.getRoom(id);
            }
            color = room.join();
            if(color === Player.NONE) {
                socket.emit("join", {status: "error", message: "Room full", code: 1});
                return;
            }
            socket.join("room_" + room.getId());
            socket.emit("join", {
                status: "success",
                color: color,
                board: room.getState(),
                room: room.getId(),
                boards: room.getBoardStates(),
                next: {
                    player: room.getTurn(),
                    board: room.getNextBoard()
                }
            });
        });

        socket.on("place", ({x, y}) => {
            if (color !== Player.NONE && color !== Player.DRAW) {
                let result = room.placeCell(x, y, color);
                if (!result) {
                    socket.emit("place", false);
                } else {
                    io.to("room_" + room.getId()).emit("place", result);
                    if (!result.hasOwnProperty("nextColor")) {
                        roomManager.destroyRoom(room.getId());
                        io.in("room_" + room.getId()).socketsLeave("room_" + room.getId());
                    }
                }
            }
        });

        socket.on("disconnect", () => {
            if (color !== Player.NONE && color !== Player.DRAW) {
                room.leave(color);
            }
        })
    });
}
