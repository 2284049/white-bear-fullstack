const selectAllCards = `
    SELECT 
        *
    FROM
        memory_cards
    WHERE
        memory_cards.user_id = ?
            AND (memory_cards.imagery LIKE ?
            OR memory_cards.answer LIKE ?)
    ORDER BY 
        ?;
    `;
// the question marks are defined in memory-cards.js
// at this point: db.query(selectAllCards, [INSIDE THIS ARRAY])
module.exports = selectAllCards;
