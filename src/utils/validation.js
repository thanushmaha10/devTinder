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

const validateUserEditData = (req) => {
  const allowedEdits = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];

  const isAllowedEdit = Object.keys(req.body).every((key) =>
    allowedEdits.includes(key)
  );

  return isAllowedEdit;
};

const validatePasswordEditData = (req) => {
  const allowedEdit = ["password"];

  const isAllowedEditPassword = Object.keys(req.body).every((key) =>
    allowedEdit.includes(key)
  );

  return isAllowedEditPassword;
};

module.exports = {
  validateSignUpData,
  validateUserEditData,
  validatePasswordEditData,
};
