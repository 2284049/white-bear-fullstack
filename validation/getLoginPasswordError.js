const db = require("../db");
const selectUserByEmail = require("../queries/selectUserByEmail");
const bcrypt = require("bcrypt");

module.exports = async function getLoginPasswordError(password, email) {
   if (password === "") {
      return "Please enter your password."; // display this error
   }
   if ((await checkIsValidUser(email, password)) === false) {
      return "The email and password combination you entered is invalid.";
   }
   return "";
};

function checkIsValidUser(email, password) {
   // get the user by email address
   return db
      .query(selectUserByEmail, email)
      .then(async (users) => {
         const user = users[0];
         // use bcrypt compare function to see if inputted password matches password in db
         const isValidUser = await bcrypt
            .compare(password, user.password)
            .then((isValidUser) => {
               // we get user.password from selectUserByEmail
               // compare user.password with password input
               // if a match, return true, else false
               console.log(isValidUser);
               return isValidUser;
            })
            .catch((err) => {
               console.log(err);
            });
         return isValidUser;
      })
      .catch((err) => {
         return false;
      });
}
