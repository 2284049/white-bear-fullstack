// The users resource

const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUser = require("../../queries/selectUser");
const { toJson, toSafeParse } = require("../../utils/helpers");

// @route       GET api/v1/users
// @desc        Get a valid user via email & password
// @access      Public
router.get("/", (req, res) => {
   db.query(selectUser("sarah@gmail.com", "replace_me"))
      .then((dbRes) => {
         const users = toSafeParse(toJson(dbRes));
         console.log(users);
         res.json(users);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
