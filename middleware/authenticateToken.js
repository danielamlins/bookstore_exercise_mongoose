const jwt = require("jsonwebtoken");

module.exports =  (req, res, next) => {
  try {
    console.log("ok")
    const authHeader = req.headers.authorization.split(" ")[1];
    jwt.verify(authHeader, process.env.JWT_KEY, (err, user) => {
      console.log(user)
      if (err) return sendStatus(403); // Forbiden
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

// exports.authenticateToken = function (req, res, next) {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token === null) return res.sendStatus(401)

//     jwt.verify(token, process.env.JWT_KEY, (err, user) => {
//         if (err) return sendStatus(403) // Forbiden
//         req.user = user;
//         next()
//     })
// }

// WIth this, we need a header following the format:
// "Bearer token"
// Then we can check, on the server side, which user is logged in.
