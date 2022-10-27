const express = require('express')
const { v4: uuidv4 } = require('uuid');
const processUserInput = require('./processUserInput');
const generateServerCode = require('./generateServerCode');

const app = express();
app.use(express.json())

// parametr – ewentualnie przekazywany poprzez zmienną środowiskową
const port = process.env.PORT || 3000;
const games = new Map(); 

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
    const newGame = {
      status: "onGoing",
      code: serverCode,
      max_moves: max,
      moves: 0
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

app.patch('/mmind', (req, res) => {
  const data = req.body;
  const { gameid, userMove } = data;


  try {
    const game = games.get(gameid)
    if (game.moves >= game.max)

    const serverCode = game.code
    const [blackPoints, whitePoints] = processUserInput(userMove, serverCode);
    return res.status(200).send(JSON.stringify({
      white: whitePoints,
      black: blackPoints,
      gameid
    }));
  } catch (error) {
    return res.status(500).send(error);
  };
});

// uruchamiamy serwer gry
app.listen(port, () => {
  console.log(`Serwer gry dostępny na porcie ${port}`);
});
