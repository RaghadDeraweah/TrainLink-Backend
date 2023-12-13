const jwt = require("jsonwebtoken");
const config = require("./config");

let checkToken = (req, res, next) => {
  let token = req.headers["authorization"];
  console.log(token);
  token = token.slice(7, token.length);
  if (token) {
    jwt.verify(token, config.key, (err, decoded) => {
      if (err) {
        console.log("token is invalid");
        return res.json({
          status: false,
          msg: "token is invalid",
        });

      } else {
        console.log("token is valid");
        req.decoded = decoded;
        return res.json({
          status: true,
          ID: req.decoded.ID
        });
        next();
     //   console.log(req.decoded.ID );
        //next(req.decoded.ID);
      }
    });
  } else {
    console.log("token is not provided");
    return res.json({
      status: false,
      msg: "Token is not provided",
    });
  }
};

module.exports = {
  checkToken: checkToken,
};