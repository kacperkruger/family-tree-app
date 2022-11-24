let send = document.getElementById("send");
let text = document.getElementById("text");
let message = document.getElementById("message");

const socket = io(`http://${location.host}/${topic}`);
socket.on("connect", () => {
    console.log(socket.id)

    console.log(`Nawiązano połączenie z kanałem „/${topic}”`);
});
socket.on("disconnect", () => {
    console.log(`Połączenie z kanałem „/${topic}” zostało zakończone`);
});
socket.on("message", (data) => {
    console.log(data)
    console.log(data)
    message.textContent = data;
});

send.addEventListener("click", () => {
    socket.send(text.value);
    text.value = "";
    text.focus();
})
