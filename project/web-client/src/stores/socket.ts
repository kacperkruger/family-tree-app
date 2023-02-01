import {defineStore} from "pinia";
import {io, Socket} from 'socket.io-client'
import type {Message} from "@/data/message";

export const useSocketStore = defineStore('socket', () => {

    const sockets = new Map<string, Socket>();

    const connect = (roomId: string, cb: Function) => {
        if (sockets.has(roomId)) return
        const socket = io(`http://localhost:9000/${roomId}`)
        socket.on("message", data => {
            cb(data)
        })
        sockets.set(roomId, socket)
    }

    const emitMessage = (roomId: string, data: Message) => {
        const socket = sockets.get(roomId);
        if (!socket) return
        socket.emit("message", data)
    }

    return { connect, emitMessage }
})