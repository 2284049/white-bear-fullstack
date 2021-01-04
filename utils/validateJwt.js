require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function validateJwt(req, res, next) {
   // middle ware functions must have these 3 parameters (req, res, next)
   // console.log("I'm validating JWT");
   const accessToken = req.header("x-auth-token");
   if (!accessToken) {
      // if not access token
      return res.status(401).json({ authError: "No token provided." });
   }
   try {
      // verify the token
      // if valid, extract the user payload
      // console.log(accessToken);

      const decodedPayload = jwt.verify(
         accessToken,
         process.env.JWT_ACCESS_SECRET
      );
      // console.log("Here's the decoded payload: ", decodedPayload);
      // assigning the payload to the request
      req.user = decodedPayload;
      // continue on in the API
      next(); // means continue on
   } catch {
      return res.status(401).json({ authError: "Unauthorized token." });
   }
};
