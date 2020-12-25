// The memory-cards resource

const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllCards = require("../../queries/selectAllCards");
const validateJwt = require("../../utils/validateJwt");

// @route       GET api/v1/memory-cards
// @desc        Get all memory cards for a user by search term and order
// @access      Private
router.get("/", validateJwt, (req, res) => {
   // middelware = putting a function in the "middle" (here the function is validateJwt)
   console.log(req.query);
   const { searchTerm, order } = req.query;
   // writing it the way above is called object destructuring
   // basically we are saying we have 2 new variables to reference:
   // 1) req.query.searchTerm and 2) req.query.order
   // or we can write it like below:
   // const searchTerm = req.query.searchTerm
   // const order = req.query.order

   const userId = req.user.id;

   let constructedSearchTerm;
   if (searchTerm === "" || searchTerm === undefined) {
      constructedSearchTerm = "%%";
   } else {
      constructedSearchTerm = `%${searchTerm}%`;
   }

   db.query(selectAllCards, [
      userId,
      constructedSearchTerm,
      constructedSearchTerm,
      { toSqlString: () => order },
   ])
      // in selectAllCards.js, we have 4 question marks
      // in the array above, we are defining what those question marks are:
      // [userId, searchTerm, searchTerm, order]
      // using this “prepared statement” syntax with escaping query values helps with security
      /* https://www.npmjs.com/package/mysql#escaping-query-values */

      .then((memoryCards) => {
         const camelCasedMemoryCards = memoryCards.map((memoryCard) => {
            return {
               id: memoryCard.id,
               imagery: memoryCard.imagery,
               answer: memoryCard.answer,
               userId: memoryCard.user_id,
               createdAt: memoryCard.created_at,
               nextAttemptAt: memoryCard.next_attempt_at,
               lastAttemptAt: memoryCard.last_attempt_at,
               totalSuccessfulAttempts: memoryCard.total_successful_attempts,
               level: memoryCard.level,
               // we don't have to get all of these; just what we need
            };
         });
         console.log(camelCasedMemoryCards);
         res.json(camelCasedMemoryCards);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
