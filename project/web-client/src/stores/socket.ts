import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import type { Message } from "@/data/message";
import { ref } from "vue";

export const useSocketStore = defineStore("socket", () => {
  const sockets = ref(new Map<string, Socket>());

  const connect = (roomId: string, cb: Function) => {
    if (sockets.value.has(roomId)) return;
    const socket = io(`http://localhost:9000/${roomId}`);
    socket.on("message", (data) => {
      cb(data);
    });
    sockets.value.set(roomId, socket);
  };

  const emitMessage = (roomId: string, data: Message) => {
    const socket = sockets.value.get(roomId);
    if (!socket) return;
    socket.emit("message", data);
  };

  const clear = () => {
    sockets.value = new Map();
  };

  return { connect, emitMessage, clear };
});
