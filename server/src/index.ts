import express from 'express';
import http from 'http';
import expressRoutes from './routing/express';
import socketRoutes from './routing/socket';
import RoomManager from './game/RoomManager';

const port: number = Number(process.env.PORT || 3000);

const app = express();
const server = http.createServer(app);

socketRoutes(server);
expressRoutes(app);

server.listen(port, () => {
    console.log("listening on *:3000");
});
