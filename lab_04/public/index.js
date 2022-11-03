let currentGameId = undefined;

const gameContainer = document.getElementById('game-container')

const gameForm = document.getElementById('create-game-container');
const sizeInput = document.getElementById('size-input');
const dimInput = document.getElementById('dim-input');
const maxMovesInput = document.getElementById('max-moves-input');

const moveContainer = document.getElementById('move-container');

const moveForm = document.getElementById('send-container');
const moveInput = document.getElementById('move-input');

const appendGame = (gameId) => {
    const gameElement = document.createElement('div');
    gameElement.innerText = gameId;
    gameContainer.append(gameElement);
    currentGameId = gameElement;
}

window.addEventListener('load', (event) => {
    console.log("aaaa")
    axios.get('/mmind').then(res => {
        const gamesIds = res.data
        console.log(res)
        gamesIds.forEach(id => appendGame(id));
    });
});

const appendMove = (move, blackPoints, whitePoints) => {
    const moveElement = document.createElement('div');
    const moveDiv = document.createElement("div");
    moveDiv.id = "move";
    moveDiv.innerText = move;
    moveElement.append(moveDiv);

    [Array(blackPoints).keys()].forEach(() => {
        const blackPointsDiv = document.createElement("div");
        blackPointsDiv.id = "black";
        moveElement.append(blackPointsDiv)
    });

    [Array(whitePoints).keys()].forEach(() => {
        const whitePointsDiv = document.createElement("div");
        whitePointsDiv.id = "white";
        moveElement.append(whitePointsDiv)
    });


    moveContainer.append(moveElement);
}

gameForm.addEventListener('submit', e => {
    e.preventDefault();

    const size = sizeInput.value;
    const dim = dimInput.value;
    const max_moves = maxMovesInput.value;

    axios.post('/mmind', {size, dim, max_moves}).then((res) => {
        const data = res.data
        appendGame(data.gameid);

        sizeInput.value = '';
        dimInput.value = '';
        maxMovesInput.value = '';
    }).catch((e) => {
        console.log(e)
    });
})

moveForm.addEventListener('submit', e => {
    e.preventDefault();

    const move = moveInput.value;

    axios.patch('/mmind/' + currentGameId, {userMove: move}).then(res => {
        const data = res.data;
        const moveHistory = data.moveHistory
        appendMove(...moveHistory[moveHistory.length - 1]);
    })
})