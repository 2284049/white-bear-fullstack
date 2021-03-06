// The memory-cards resource

const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllCards = require("../../queries/selectAllCards");
const insertMemoryCard = require("../../queries/insertMemoryCard");
const updateMemoryCard = require("../../queries/updateMemoryCard");
const deleteMemoryCardById = require("../../queries/deleteMemoryCardById");

const validateJwt = require("../../utils/validateJwt");

// @route       GET api/v1/memory-cards
// @desc        Get all memory cards for a user by search term and order
// @access      Private
router.get("/", validateJwt, (req, res) => {
   // middelware = putting a function in the "middle" (here the function is validateJwt)
   // console.log(req.query);
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
         // console.log(camelCasedMemoryCards);
         return res.status(200).json(camelCasedMemoryCards);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

// @route       POST api/v1/memory-cards
// @desc        Post a new memory card to the memory cards resource
// @access      Private
router.post("/", validateJwt, (req, res) => {
   // create a const that has the same properties as the table in your database
   const {
      id,
      imagery,
      answer,
      createdAt,
      nextAttemptAt,
      lastAttemptAt,
      totalSuccessfulAttempts,
      level,
   } = req.body;
   const memoryCard = {
      id,
      imagery,
      answer,
      user_id: req.user.id, // req.user is part of validateJwt; that is where we defined req.user
      created_at: createdAt,
      next_attempt_at: nextAttemptAt,
      last_attempt_at: lastAttemptAt,
      total_successful_attempts: totalSuccessfulAttempts,
      level,
   };
   console.log("Here's the memory card: ", memoryCard);
   db.query(insertMemoryCard, memoryCard) // in the insertMemoryCard function, the ? = memoryCard
      .then((dbRes) => {
         // success
         console.log("Created memory card in the db: ", dbRes);
         return res.status(200).json({ success: "Card created" }); // return with a status
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         res.status(400).json({ dbError });
      });
});

// @route       PUT api/v1/memory-cards/:id
// @desc        Update a memory card in the memory cards resource
// @access      Private
router.put("/:id", validateJwt, (req, res) => {
   const id = req.params.id; // memory card id from URL
   // params is part of EXPRESS, it gives you anything after the slash in URL
   // console.log("memory card id: ", id);
   // We need to build the memory card object to put it into the db:
   const {
      imagery,
      answer,
      createdAt,
      nextAttemptAt,
      lastAttemptAt,
      totalSuccessfulAttempts,
      level,
   } = req.body;
   const memoryCard = {
      id,
      imagery,
      answer,
      user_id: req.user.id, // req.user is part of validateJwt; that is where we defined req.user
      created_at: createdAt,
      next_attempt_at: nextAttemptAt,
      last_attempt_at: lastAttemptAt,
      total_successful_attempts: totalSuccessfulAttempts,
      level,
   };
   console.log("Here's the updated memory card: ", memoryCard);
   db.query(updateMemoryCard, [memoryCard, memoryCard.id]) // in the insertMemoryCard function, the ? = memoryCard
      .then((dbRes) => {
         // success
         console.log("Updated memory card in the db: ", dbRes);
         return res.status(200).json({ success: "Card updated" }); // return with a status
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         res.status(400).json({ dbError });
      });
});

// @route       DELETE api/v1/memory-cards/:id
// @desc        Delete a memory card in the memory cards resource
// @access      Private
router.delete("/:id", validateJwt, (req, res) => {
   const id = req.params.id; // memory card id from URL
   db.query(deleteMemoryCardById, id)
      .then(() => {
         return res.status(200).json({ success: "Card deleted" }); // return with a status
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         res.status(500).json({ dbError });
      });
});

module.exports = router;
