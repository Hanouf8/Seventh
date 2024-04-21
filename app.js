const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {join} = require("path");


const database = require('./databaseConfig');
const app = express();
const PORT = process.env.PORT || 3000; // Set your preferred port
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);

// Parse JSON bodies (for JSON data)
app.use(bodyParser.json());
// Define a route

const checkUserCookie = (req, res, next) => {
    if (req.url.startsWith('/statics')) {
        next();
    } else if (req.url !== '/login' && req.url !== '/signup' && (req.cookies.uid === undefined || req.cookies.uid === null || req.cookies.uid === '')) {
        if (!req.cookies.uid) {
            console.log("redirect to login");

            return res.redirect('/login');
        } else {

            console.log("redirect to /");
            // set cookie
            // res.cookie('temp', '123456789', {maxAge: 900000, httpOnly: true})
            return res.redirect('/');
        }
    } else if ((req.url === '/login' || req.url === '/signup') && req.cookies.uid) {
        console.log("redirect to /");
        return res.redirect('/');
    }
    next();
};
app.use(checkUserCookie);

// load html file from html folder
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/html/aboutUs.html');
});

app.get('/booking', (req, res) => {
    res.sendFile(__dirname + '/html/booking.html');
});
app.get('/films', (req, res) => {
    res.sendFile(__dirname + '/html/films.html');
});

app.post('/login', (req, res) => {
        const {email, password} = req.body;
        console.log(req.body);
        database.login(email, password, res);
    }
);


app.get('/login', (req, res) => {

    res.sendFile(__dirname + '/html/login.html');
});
// handle login request

app.get('/logout', (req
        , res) => {
        res.clearCookie('uid');
        res.redirect('/login');
    }
);
app.post('/update', (req, res) =>
{
    const data = req.body;
    database.updateUser(data,req);

});

    app.get('/profile',  (req, res) => {
    const uid = req.cookies.uid;

     database.getUser(uid,(d) => {
         d=JSON.parse(JSON.stringify(d));
         d=d[0];
         d.birth_date=d.birth_date.split('T')[0];


         res.render(__dirname + '/html/profile.html', {data: d});

    });

    // convert data to json





})
;
app.get('/signup', (req, res) => {

    res.sendFile(__dirname + '/html/signUp.html');
});
// handle signup request
app.post('/signup', (req, res) =>{
    const data = req.body;
    database.addUser(data);
    res.redirect('/login');
});
app.get('/snacks', (req, res) => {
    res.sendFile(__dirname + '/html/snacks.html');
});

// load css file from css folder
app.use('/statics', express.static(join(__dirname, '/statics')), (req, res) => {
    // console.log(req.url);
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
