const calculatePoints = require('./calculatePoints');

const processUserMove = (serverValue, userMove, dim) => {

  if (serverValue.length !== userMove.length) throw 'User move is invalid length';

  if ([...userMove].some((x) => x < 0 || x > dim)) throw 'Invalid number';

  return calculatePoints(serverValue, userMove);
};

module.exports = processUserMove;
