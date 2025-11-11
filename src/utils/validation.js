const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, email, password } = req.body;
  if (firstName < 3 || firstName > 50) {
    throw new Error("first name must be in between 3 to 50 chracters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is weak");
  }
};

module.exports = {
  validateSignUpData,
};
