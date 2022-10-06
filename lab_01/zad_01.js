const array = [
  {
    id: "abc",
    name: "Ala",
  },
  {
    id: "def",
    name: "Tomek",
  },
  {
    id: "ghi",
    name: "Jan",
  },
];

const mod = array.reduce((acc, curr) => {
  acc[curr.id] = curr;
  return acc;
}, {});

console.log(mod);
