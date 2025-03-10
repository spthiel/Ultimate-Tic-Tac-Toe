import {reactive} from "vue";
import {io} from "socket.io-client";

export const state = reactive({
    connected: false,
});

// @ts-ignore
export const socket = io(undefined, {
    autoConnect: false,
    reconnection: false
});

socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
});