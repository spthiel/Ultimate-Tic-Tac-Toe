import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
    connected: false,
});

// @ts-ignore
export const socket = io("http://localhost:3000", {
    autoConnect: false,
    reconnection: false
});

socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
});