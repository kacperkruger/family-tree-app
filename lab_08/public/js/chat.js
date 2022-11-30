let send = document.getElementById("send");
let text = document.getElementById("text");
let messageContainer = document.getElementById("message-container");

const socket = io(`http://${location.host}/${topic}`);
socket.on("connect", () => {
    console.log(socket.id)

    console.log(`Nawiązano połączenie z kanałem „/${topic}”`);
});
socket.on("disconnect", () => {
    console.log(`Połączenie z kanałem „/${topic}” zostało zakończone`);
});
socket.on("message", data => {
    console.log(data)
    appendMessage(data.username, data.message)
});

send.addEventListener("click", () => {
    const messageVal = text.value
    socket.send(JSON.stringify({
        username,
        message: messageVal
    }));
    appendMessage("You", messageVal)
    text.value = "";
    text.focus();
})

const appendMessage = (username, message) => {
    const messageDiv = document.createElement("div");
    messageDiv.innerText = `${username}: ${message}`;
    messageContainer.append(messageDiv);
}
