module.exports = function selectUser(email, password) {
   return `
         SELECT 
             id, email, created_at 
         FROM 
             users
         WHERE 
             users.email = '${email}'
              AND users.password = '${password}'
         Limit 1;
     `;
};
