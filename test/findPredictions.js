const demoData = [
  { name: "RED_VIOLET", number: [0], amount: 0 },
  { name: "GREEN", number: [1], amount: 0 },
  { name: "RED", number: [2], amount: 0 },
  { name: "GREEN", number: [3], amount: 0 },
  { name: "RED", number: [4], amount: 0 },
  { name: "GREEN_VIOLET", number: [5], amount: 0 },
  { name: "RED", number: [6], amount: 0 },
  { name: "GREEN", number: [7], amount: 0 },
  { name: "RED", number: [8], amount: 0 },
  { name: "GREEN", number: [9], amount: 0 },
];

const searchDemoData = (data, color, number) => {
  const result = data.filter((item) => {
    if (color && number) {
      return (
        item.name === color.toUpperCase() &&
        item.number.includes(Number(number))
      );
    } else if (color) {
      return item.name === color.toUpperCase();
    } else if (number) {
      return item.number.includes(Number(number));
    }
  });

  return result;
};

console.log(searchDemoData(demoData, "green_violet", "5"));

const getPrePredictorValues = async (colorChoice, numberChoice) => {
  let TOTAL_BET_MONEY = 0;

  let Green_1_3_7_9 = {
    name: "Green",
    number: [1, 3, 7, 9],
    amount: 0,
  };

  let Red_2_4_6_8 = {
    name: "Red",
    number: [2, 4, 6, 8],
    amount: 0,
  };

  let Violet_05 = {
    name: "Violet",
    number: [5],
    amount: 0,
  };

  let Red_0 = {
    name: "Red",
    number: [0],
    amount: 0,
  };

  let Green_5 = {
    name: "Green",
    number: [5],
    amount: 0,
  };

  let numberTotalBet = {
    num_1: 0,
    num_2: 0,
    num_3: 0,
    num_4: 0,
    num_5: 0,
    num_6: 0,
    num_7: 0,
    num_8: 0,
    num_9: 0,
    num_0: 0,
  };

  for (let i = 0; i < colorChoice.length; i++) {
    if (colorChoice[i].name === "Green") {
      Green_1_3_7_9.amount += colorChoice[i].amount * 2;
      Green_5.amount += colorChoice[i].amount * 1.5;
    } else if (colorChoice[i].name === "Red") {
      Red_2_4_6_8.amount += colorChoice[i].amount * 2;
      Red_0.amount += colorChoice[i].amount * 1.5;
    } else if (colorChoice[i].name === "Violet") {
      Violet_05.amount += colorChoice[i].amount * 4.5;
    }

    TOTAL_BET_MONEY += colorChoice[i].amount;
  }

  for (let i = 0; i < numberChoice.length; i++) {
    if (numberChoice[i].name === "num_1") {
      numberTotalBet.num_1 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_2") {
      numberTotalBet.num_2 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_3") {
      numberTotalBet.num_3 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_4") {
      numberTotalBet.num_4 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_5") {
      numberTotalBet.num_5 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_6") {
      numberTotalBet.num_6 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_7") {
      numberTotalBet.num_7 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_8") {
      numberTotalBet.num_8 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_9") {
      numberTotalBet.num_9 += numberChoice[i].amount * 9;
    } else if (numberChoice[i].name === "num_0") {
      numberTotalBet.num_0 += numberChoice[i].amount * 9;
    }

    TOTAL_BET_MONEY += numberChoice[i].amount;
  }

  const bettedDescription = {
    totalBetMoney: TOTAL_BET_MONEY,
    green: Green_1_3_7_9.amount + Green_5.amount,
    red: Red_2_4_6_8.amount + Red_0.amount,
    violet: Violet_05.amount,
    1: numberTotalBet.num_1,
    2: numberTotalBet.num_2,
    3: numberTotalBet.num_3,
    4: numberTotalBet.num_4,
    5: numberTotalBet.num_5,
    6: numberTotalBet.num_6,
    7: numberTotalBet.num_7,
    8: numberTotalBet.num_8,
    9: numberTotalBet.num_9,
    0: numberTotalBet.num_0,
  };

  return bettedDescription;
};
