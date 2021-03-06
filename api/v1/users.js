// The users resource
require("dotenv").config();

const express = require("express");
const router = express.Router();
const db = require("../../db");
const insertUser = require("../../queries/insertUser");
const selectUserById = require("../../queries/selectUserById");
const selectUserByEmail = require("../../queries/selectUserByEmail");
const { toHash } = require("../../utils/helpers");
const getSignUpEmailError = require("../../validation/getSignUpEmailError");
const getSignUpPasswordError = require("../../validation/getSignUpPasswordError");
const getLoginEmailError = require("../../validation/getLoginEmailError");
const getLoginPasswordError = require("../../validation/getLoginPasswordError");
const jwt = require("jsonwebtoken");

// @route       POST api/v1/users
// @desc        Create a new user
// @access      Public
router.post("/", async (req, res) => {
   const { id, email, password, createdAt } = req.body;
   const emailError = await getSignUpEmailError(email);
   const passwordError = getSignUpPasswordError(password, email);
   let dbError = "";
   if (emailError === "" && passwordError === "") {
      const hashedPassword = await toHash(password);
      const user = {
         id: id,
         email: email,
         password: hashedPassword,
         created_at: createdAt,
      };
      console.log(user);
      db.query(insertUser, user)
         .then(() => {
            db.query(selectUserById, id)
               .then((users) => {
                  const user = {
                     id: users[0].id,
                     email: users[0].email,
                     createdAt: users[0].created_at,
                  };
                  const accessToken = jwt.sign(
                     // create an access token
                     user,
                     process.env.JWT_ACCESS_SECRET,
                     {
                        expiresIn: "100m",
                     }
                  );
                  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
                  // options: expiresIn: Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
                  // 60 = 60 seconds but "60" = 60 milliseconds
                  res.status(200).json(accessToken); // display that access token
               })
               .catch((err) => {
                  console.log(err);
                  dbError = `${err.code} ${err.sqlMessage}`;
                  res.status(400).json({ dbError });
               });
         })
         .catch((err) => {
            console.log(err);
            dbError = `${err.code} ${err.sqlMessage}`;
            res.status(400).json({ dbError });
         });
   } else {
      res.status(400).json({
         emailError: emailError,
         passwordError: passwordError,
      });
   }
});

// @route       POST api/v1/users/auth
// @desc        Check this user against the db via email and password
// @access      Public
router.post("/auth", async (req, res) => {
   const { email, password } = req.body;
   const emailError = getLoginEmailError(email);
   const passwordError = await getLoginPasswordError(password, email);
   console.log({ emailError, passwordError });
   let dbError = "";
   if (emailError === "" && passwordError === "") {
      // return the user to the client
      db.query(selectUserByEmail, email)
         .then((users) => {
            const user = {
               id: users[0].id,
               email: users[0].email,
               createdAt: users[0].created_at,
            };
            const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
               expiresIn: "100m",
            });
            // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            // options: expiresIn: Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
            // 60 = 60 seconds but "60" = 60 milliseconds
            res.status(200).json(accessToken);
         })
         .catch((err) => {
            console.log(err);
            dbError = `${err.code} ${err.sqlMessage}`;
            res.status(400).json({ dbError });
         });
   } else {
      res.status(400).json({
         emailError: emailError,
         passwordError: passwordError,
      });
   }
});

module.exports = router;
