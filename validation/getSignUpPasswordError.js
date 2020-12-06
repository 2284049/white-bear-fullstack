module.exports = function getSignUpPasswordError(password, email) {
   if (password === "") {
      return "Please create a password."; // display this error
   }
   if (password.length < 9) {
      return "Your password must be at least 9 characters."; // display this error
   }
   if (checkHasLocalPart(password, email)) {
      return "Your password cannot contain your email address."; // display this error
   }
   const uniqChars = [...new Set(password)]; // puts all unique characters into an array
   if (uniqChars.length < 3) {
      return "Your password must contain at least 3 unique characters."; // display this error
   }
   return "";
};

function checkHasLocalPart(password, email) {
   const localPart = email.split("@")[0]; // the split will give us an array of strings ["local part", "part after @"]; we want the part at index 0
   if (localPart === "") return false;
   else if (localPart.length < 4) return false;
   else return password.includes(localPart); // if this is true, it returns true; if it's false, it returns false
}
