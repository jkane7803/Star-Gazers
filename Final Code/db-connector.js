// Citation for the following code:
// Date: 12/5/22
// Copied from our instructors for class CS 340 at Oregon State University, Dr. Michael Curry and Danielle Safonte.

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : '',
    password        : '',
    database        : 'cs340_kaneju'
})

// Export it for use in our application
module.exports.pool = pool;