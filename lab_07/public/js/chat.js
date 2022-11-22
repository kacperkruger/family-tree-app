if (document.readyState === "interactive") {
    let send = document.getElementById("send");
    let text = document.getElementById("text");
    let message = document.getElementById("message");
    console.log("eee")

    const socket = new WebSocket(`ws://${location.host}/?login=${login}`);
    socket.addEventListener("open", () => {
    });
    socket.addEventListener("close", () => {
        console.log("Rozłączenie");
    });
    socket.addEventListener("message", (msg) => {
        message.textContent = `Wiadomość od serwera: „${msg.data}”`;
    });
    socket.addEventListener("error", (err) => {
        console.log("Błąd");
        message.textContent = `Błąd połączenia z serwerem: ${err}`;
    });

    send.addEventListener("click", () => {
        socket.send(text.value);
        text.value = "";
        text.focus();
    })
}
