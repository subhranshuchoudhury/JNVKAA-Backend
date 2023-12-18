// process.env.TZ = "Asia/Kolkata";

// const test = () => {
//   const date = new Date();
//   console.log(date.toLocaleString());
// };
// test();
// const newD = new Date();

// console.log(newD.toLocaleString());

// Get the current date
const currentDate = new Date();

// Set the number of days you want to add to the current date
const numberOfDaysToAdd = 7; // Change this value as needed

// Calculate the future date
const futureDate = new Date(currentDate);
futureDate.setDate(currentDate.getDate() + numberOfDaysToAdd);

// Log the future date
console.log("Current Date:", currentDate.toISOString());
console.log("Future Date:", futureDate.toISOString());

let dateString = "08-04-2023";
let dateParts = dateString.split("-");
let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

console.log(dateObject);
