const generate = (size, dim) => {
    let serverCode = ""
    Array.from(Array(size)).forEach(_ => serverCode += Math.floor(Math.random() * dim + 1))
    return serverCode;
};

module.exports = generate;