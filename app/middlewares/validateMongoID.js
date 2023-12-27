const isValidateInputID = (input) => {
  // Check if input is a string
  if (typeof input === "string") {
    // Check if string length is 12 or 24
    if (input.length === 12 || input.length === 24) {
      // Check if string is a valid hexadecimal
      const hexRegex = /^[0-9A-Fa-f]{12,24}$/g;
      if (hexRegex.test(input)) {
        return true;
      }
    }
  }

  // If none of the above conditions are met, return false
  return false;
};

const IDValidator = {
  isValidateInputID,
};

module.exports = IDValidator;
