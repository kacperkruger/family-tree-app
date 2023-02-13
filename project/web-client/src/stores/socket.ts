import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { ref } from "vue";

export const useSocketStore = defineStore("socket", () => {
  const sockets = ref(new Map<string, Socket>());

  const connect = (urlPath: string, cb: Function, authParam?: Object) => {
    if (sockets.value.has(urlPath)) return;
    const socket = io(`${import.meta.env.VITE_WEBSOCKET_HOST_URL}/${urlPath}`, {
      auth: authParam,
    });
    socket.on("message", (data) => {
      cb(data);
    });
    sockets.value.set(urlPath, socket);
  };

  const emit = (urlPath: string, data: any) => {
    const socket = sockets.value.get(urlPath);
    if (!socket) return;
    socket.emit("message", data);
  };

  const clear = () => {
    sockets.value = new Map();
  };

  return { connect, emit, clear };
});
