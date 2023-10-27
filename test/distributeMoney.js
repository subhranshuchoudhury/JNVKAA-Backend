const distributeMoney = async () => {
  const data = {
    finalPrediction: {
      color: "GREEN_VIOLET",
      number: 5,
      amount: 300,
    },
    colorPredict: [
      {
        name: "Green",
        amount: 1000,
        mobile: "8249587552 - 1",
      },
      {
        name: "Red",
        amount: 1000,
        mobile: "9938177282 - 2",
      },
      {
        name: "Green",
        amount: 1000,
        mobile: "8249587552 - 3",
      },
      {
        name: "Violet",
        amount: 1000,
        mobile: "9938177282 - 4",
      },
      {
        name: "Green",
        amount: 1000,
        mobile: "8249587552 - 5",
      },
      {
        name: "Red",
        amount: 1000,
        mobile: "9938177282 - 6",
      },
      {
        name: "Green",
        amount: 1000,
        mobile: "8249587552 - 7",
      },
      {
        name: "Red",
        amount: 1000,
        mobile: "9938177282 - 8",
      },
      {
        name: "Green",
        amount: 1000,
        mobile: "8249587552 - 9",
      },
      {
        name: "Red",
        amount: 1000,
        mobile: "9938177282 - 10",
      },
    ],
    numberPredict: [
      {
        name: "num_0",
        amount: 300,
        mobile: "8249587552",
      },
    ],
  };

  const finalPrediction = data.finalPrediction;
  const colorPredictors = data.colorPredict;
  const numberPredictors = data.numberPredict;

  colorPredictors.forEach(async (predictor) => {
    if (
      finalPrediction?.color
        ?.toLowerCase()
        .includes(predictor?.name?.toLowerCase())
    ) {
      if (finalPrediction?.color === "RED") {
        console.log(predictor.amount, predictor.mobile, 2);
      } else if (finalPrediction?.color === "GREEN") {
        console.log(predictor.amount, predictor.mobile, 2);
      } else if (finalPrediction?.color === "VIOLET") {
        console.log(predictor.amount, predictor.mobile, 4.5);
      } else if (finalPrediction?.color === "RED_VIOLET") {
        if (predictor?.name === "Red") {
          console.log(predictor.amount, predictor.mobile, 1.5);
        } else if (predictor?.name === "Violet") {
          console.log(predictor.amount, predictor.mobile, 4.5);
        }
      } else if (finalPrediction?.color === "GREEN_VIOLET") {
        if (predictor?.name === "Green") {
          console.log(predictor.amount, predictor.mobile, 1.5);
        } else if (predictor?.name === "Violet") {
          console.log(predictor.amount, predictor.mobile, 4.5);
        }
      }
    }
  });

  // * number prediction

  numberPredictors.forEach(async (predictor) => {
    if (String(finalPrediction?.number) === predictor?.name?.split("_")[1]) {
      console.log(predictor.amount, predictor.mobile, 9);
    }
  });
};

const multiplierFounder = (number, color) => {
  let multiplier = {};
  if ([1, 3, 7, 9].includes(number)) {
    multiplier = {
      color: ["GREEN"],
      mul: [2],
    };
  } else if ([2, 4, 6, 8].includes(number)) {
    multiplier = {
      color: ["RED"],
      mul: [2],
    };
  } else if ([0, 5].includes(number)) {
    if (color === "RED_VIOLET") {
      multiplier = {
        color: ["RED", "VIOLET"],
        mul: [1.5, 4.5],
      };
    } else if (color === "GREEN_VIOLET") {
      multiplier = {
        color: ["GREEN", "VIOLET"],
        mul: [1.5, 4.5],
      };
    }
  }

  return multiplier;
};
distributeMoney();
