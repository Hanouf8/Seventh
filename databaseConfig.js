// databaseConfig.js

const mysql = require('mysql');

// Create a connection pool to manage connections
const pool = mysql.createPool({
        connectionLimit: 10,
        host: '127.0.0.1', // Your MySQL host
        user: 'root', // Your MySQL username
        password: 'root', // Your MySQL password
        database: 'cinema' // Your MySQL database name
    }
);

function addUser(data) {
    pool.query(
        'INSERT INTO users (fname, lname, gender, birth_date, email, nationality, password, phone, english, arabic, french) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [data.fname, data.lname, data.gender, data.birth_date, data.email,
            data.nationality, data.password, data.phone,
            data.english === undefined ? 0 : 1, data.arabic === undefined ? 0 : 1, data.french === undefined ? 0 : 1],
        (err, results, fields) => {
            if (err) {
                console.log("Error:->\n", err);
            }
        }
    );
}


function login(email, password, res) {
    pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results, fields) => {
        if (err) {
            console.log(err);
        }
        if (results.length > 0) {
            res.cookie('uid', results[0].uid);
            res.redirect('/');
        }


        console.log(results);
    });
}

function addBill(uid, total, date, time, seats) {
    pool.query('INSERT INTO bills (uid, total, date, time, seats) VALUES (?, ?, ?, ?, ?)', [uid, total, date, time, seats], (err, results, fields) => {
        if (err) {
            console.log(err);
        }
    });
}
function updateUser(data,req) {
//     fname,lname,birth_date,email,nationality,phone

    const updateQuery = `
    UPDATE Users
    SET 
        fname = ?,
        lname = ?,
        birth_date = ?,
        email = ?,
        nationality = ?,
        phone = ?
    WHERE uid = ?
`;


    pool.query(
        updateQuery,
        [
            data.fname,
            data.lname,
            data.birth_date,
            data.email,
            data.nationality,
            data.phone,
            req.cookies.uid
        ],
        (error, results, fields) => {
            if (error) {
                console.error('Error updating user:', error);
                throw error;
            }
           else{
                res.redirect('/profile');
            }
        }
    );
}


// check connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("error connecting: " + err.stack);
    } else {
        console.log('connected as id ');
    }

});
function  getUser(
    uid,
    callback
){

      pool.query(
        'SELECT * FROM users WHERE uid = ?',
        [uid],
        (err, results, fields) => {
            if (err) {
                console.log("Error:->\n", err);
            }



            callback(results);
            return results;
        }



    );

}

module.exports = {pool, addUser,updateUser,getUser, login, addBill,};
