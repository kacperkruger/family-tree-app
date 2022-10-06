const wishList = [
  {
    name: "Czajnik",
    netto: 100,
  },
  {
    name: "Lodówka",
    netto: 1300,
  },
  {
    name: "Mikrofalówka",
    netto: 340,
  },
  {
    name: "Mikser",
    netto: 120,
  },
  {
    name: "Piekarnik",
    netto: 2100,
  },
];

const func = (tab, trans) => {
  return tab.reduce((prev, curr) => {
    const result = trans(curr);
    return [...prev, result];
  }, []);
};

console.log(func(wishList, (x) => x.name + " -> " + x.netto));
