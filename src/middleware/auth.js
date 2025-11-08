const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuth = token === "xyz";
  if (!isAdminAuth) {
    res.status(401).send("Unauthorised entry");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "abchjk";
  const isUserAuth = token === "abc";
  if (!isUserAuth) {
    res.status(401).send("unauthorised user entry");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
