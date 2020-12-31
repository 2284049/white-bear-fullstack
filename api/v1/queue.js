// The queue resource

const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectQueue = require("../../queries/selectQueue");
const validateJwt = require("../../utils/validateJwt");

// @route       GET api/v1/queue
// @desc        Get all memory cards for a user that are queued to occur next
// @access      Private
router.get("/", validateJwt, (req, res) => {
   // middelware = putting a function in the "middle" (here the function is validateJwt)
   //    console.log(req.query);
   // writing it the way above is called object destructuring
   // basically we are saying we have 2 new variables to reference:
   // 1) req.query.searchTerm and 2) req.query.order
   // or we can write it like below:
   // const searchTerm = req.query.searchTerm
   // const order = req.query.order

   const userId = req.user.id;

   db.query(selectQueue, userId) // don't need to put userId in array brackets since it's just a single string
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
         return res.status(200).json(camelCasedMemoryCards);
      })
      .catch((err) => {
         console.log(err);
         return res.status(400).json(err);
      });
});

module.exports = router;
