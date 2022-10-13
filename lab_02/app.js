// moduł TCP – jako „podstawa serwera aplikacji”
import net from "net";

import processUserMove from "./process_input.js";

// parametr – ewentualnie przekazywany poprzez zmienną środowiskową
const port = process.env.PORT || 3000;

// tworzymy i konfigurujemy obiekt aplikacji
const app = net.createServer((socket) => {
  server.on("connection", function (sock) {
    console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);
    const serverValue = Array(4)
      .fill()
      .map(Math.random() * (0 - 9) + 0);
    let gameHistory = new Map();

    server.on("data", (data) => {
      if (data === "START") {
        console.log("STARTING GAME");
        server.on("data", (data) => {
          if (data === "STOP") {
            console.log("STOPPED GAME");
            return;
          }
          const processedUserMove = processUserMove(serverValue, data);
          console.log(processedUserMove);
          gameHistory.set(data, processedUserMove);
        });
      }
    });
  });
});
// uruchamiamy serwer gry
app.listen(port, () => {
  console.log(`Serwer gry dostępny na porcie ${port}`);
});
