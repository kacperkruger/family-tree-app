const defFun = (fun, types) => {
  return {
    function: fun,
    typeConstr: types,
  };
};

const myfun = defFun((a, b) => a + b, ["number", "number"]);

const appFun = (f, ...args) => {
  if (f["typeConstr"] === undefined) {
    throw { typerr: "Function doesn't have typeConstr" };
  }
  args.forEach((arg, index) => {
    if (!f["typeConstr"].includes(typeof arg))
      throw {
        typerr: `Type of ${
          index + 1
        } argument doesn't match to function typeConstr`,
      };
  });
  return f.function(...args);
};

try {
  console.log(appFun(myfun, 12, 15));
} catch (e) {
  console.log(e.typerr);
}
