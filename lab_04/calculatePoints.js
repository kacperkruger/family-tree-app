const calculatePoints = (serverValue, userMove) => {
    let blackPoints = 0;
    let whitePoints = 0;

    // black points
    let serverInputAfterBlackPoints = serverValue.split('');
    const userInputAfterBlackPoints = userMove.split('').map((color, index) => {
        if (serverValue[index] === color) {
            blackPoints++;
            serverInputAfterBlackPoints[index] = undefined;
        } else return color;
    });

    // white points
    userInputAfterBlackPoints.map((clientColor) => {
        if (clientColor === undefined) return clientColor;
        else if (serverInputAfterBlackPoints.includes(clientColor)) {
            const serverColorIndex = serverInputAfterBlackPoints.findIndex(
                (serverColor) => clientColor === serverColor
            );
            whitePoints++;
            serverInputAfterBlackPoints[serverColorIndex] = undefined;
        } else return clientColor;
    });

    return [blackPoints, whitePoints];
}

module.exports = calculatePoints;