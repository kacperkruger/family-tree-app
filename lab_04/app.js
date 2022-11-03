const express = require('express')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const processUserInput = require('./processUserInput');
const generateServerCode = require('./generateServerCode');

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.json())

// parametr – ewentualnie przekazywany poprzez zmienną środowiskową
const port = process.env.PORT || 3000;
const games = new Map();

app.get('/mmind', (req, res) => {
  const gamesIds = Array.from(games.keys())
  return res.send(gamesIds);
});

// tworzymy i konfigurujemy obiekt aplikacji
app.post('/mmind', (req, res) => {
  const data = req.body;
  const size = parseInt(data.size)
  const dim = parseInt(data.dim)
  const max = parseInt(data.max)

  console.log(typeof size)

  if (typeof size !== "number" || typeof dim !== "number" || typeof max !== "number") 
    return res.status(200).send('Invalid type of parameters')

  const id = uuidv4();

  try {
    const serverCode = generateServerCode(size, dim)
    console.log(serverCode);
    const newGame = {
      status: "onGoing",
      code: serverCode,
      max_moves: max,
      moves: 0,
      moveHistory: []
    }
    games.set(id, newGame);
    
    return res.status(200).send(JSON.stringify({
      size,
      dim,
      max,
      gameid: id
    }));
  } catch (error) {
    return res.status(500).send(error)
  };
});

app.patch('/mmind/:gameid', (req, res) => {
  const gameid = req.params.gameid
  const data = req.body;
  const { userMove } = data;

  try {
    const game = games.get(gameid);
    console.log(game);
    if (game.status !== "onGoing") throw "Game has already ended";

    const serverCode = game.code;
    const [blackPoints, whitePoints] = processUserInput(game.code, userMove, game.dim);

    if (blackPoints === serverCode.length) {
      const updatedGame = {
        ...game,
        status: "Won",
        moves: game.moves + 1,
        moveHistory: [...game.moveHistory, userMove]
      }
      games.set(gameid, updatedGame);
      return res.status(200).send("You won!")
    }

    if (game.moves === game.max_moves - 1) {
      const updatedGame = {
        ...game,
        status: "Lose",
        moves: game.moves + 1,
        moveHistory: [...game.moveHistory, userMove]
      }
      games.set(gameid, updatedGame);
      return res.status(200).send("You lose :(")
    }

    const updatedGame = {
      ...game,
      moves: game.moves + 1,
      moveHistory: [...game.moveHistory, userMove]
    }
    games.set(gameid, updatedGame);
    return res.status(200).send(JSON.stringify({
      white: whitePoints,
      black: blackPoints,
      gameid
    }));
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  };
});

// uruchamiamy serwer gry
app.listen(port, () => {
  console.log(`Serwer gry dostępny na porcie ${port}`);
});
