// function getCurrentPeriodTimes() {
//   const currentTime = new Date();
//   const periodStart = new Date(
//     currentTime.getFullYear(),
//     currentTime.getMonth(),
//     currentTime.getDate(),
//     currentTime.getHours(),
//     Math.floor(currentTime.getMinutes() / 3) * 3,
//     0,
//     0
//   );

//   const periodEnd = new Date(periodStart.getTime() + 3 * 60 * 1000);

//   const currentDate = currentTime.toISOString().split("T")[0].replace(/-/g, "");

//   const periodNumber = Math.floor(periodStart.getMinutes() / 3);

//   const currentPeriod = `${currentDate}${periodNumber
//     .toString()
//     .padStart(3, "0")}`;

//   return {
//     startTime: periodStart.toISOString(),
//     endTime: periodEnd.toISOString(),
//     currentPeriod: currentPeriod,
//   };
// }

// const currentPeriodTimes = getCurrentPeriodTimes();
// console.log("Current Period Start Time:", currentPeriodTimes);
// console.log("Current Period End Time:", currentPeriodTimes.endTime);
// console.log("Current Period Number:", currentPeriodTimes.currentPeriod);

function getNextPeriodTimes() {
  const currentTime = new Date();
  const periodStart = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    currentTime.getHours(),
    Math.floor(currentTime.getMinutes() / 3) * 3,
    0,
    0
  );

  const nextPeriodStart = new Date(periodStart.getTime() + 3 * 60 * 1000);
  const nextPeriodEnd = new Date(nextPeriodStart.getTime() + 3 * 60 * 1000);

  const currentDate = nextPeriodStart
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");

  const periodNumber =
    Math.floor(nextPeriodStart.getHours() * 60 + nextPeriodStart.getMinutes()) /
    3;

  const nextPeriod = `${currentDate}${periodNumber
    .toString()
    .padStart(3, "0")}`;

  return {
    startTime: nextPeriodStart.toISOString(),
    endTime: nextPeriodEnd.toISOString(),
    currentPeriod: nextPeriod,
  };
}

const nextPeriodTimes = getNextPeriodTimes();

const milDiff =
  new Date(nextPeriodTimes.startTime).getTime() - new Date().getTime();

const seconds = Math.floor(milDiff / 1000);

console.log("Seconds to next period:", seconds);

console.log("Next Period Start Time:", {
  startTime: new Date(nextPeriodTimes.startTime).toLocaleTimeString(),
  endTime: new Date(nextPeriodTimes.endTime).toLocaleTimeString(),
  currentPeriod: nextPeriodTimes.currentPeriod,
});
