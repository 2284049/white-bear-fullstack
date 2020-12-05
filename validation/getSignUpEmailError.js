const db = require("../db");
const { EMAIL_REGEX } = require("../utils/helpers");
const selectUserByEmail = require("../queries/selectUserByEmail");

module.exports = function getSignUpEmailError(email) {
   if (email === "") {
      return "Please enter your email address.";
   }
   if (EMAIL_REGEX.test(email.toLowerCase()) === false) {
      return "Please enter a valid email address.";
   }
   if (checkIsInDb(email) === true) {
      return "This email address already exists in the database.";
   }
   return "";
};

function checkIsInDb(email) {
   return db
      .query(selectUserByEmail, email)
      .then((users) => {
         if (users.length === 0) return false;
         else return true;
      })
      .catch((err) => {
         console.log(err.response.data);
      });
}
