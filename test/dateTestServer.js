process.env.TZ = "Asia/Kolkata";

const test = () => {
  const date = new Date();
  console.log(date.toLocaleString());
};
test();
const newD = new Date();

console.log(newD.toLocaleString());
