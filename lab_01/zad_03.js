const groupBy = (tab, key) => {
  return tab.reduce((prev, curr) => {
    const k = key(curr);
    const valueUnderK = prev.get(k);
    valueUnderK === undefined
      ? prev.set(k, [curr])
      : prev.set(k, [...valueUnderK, curr]);
    return prev;
  }, new Map());
};

console.log(groupBy([3, 2, 4, 4, 3], (n) => n % 2 === 0));
