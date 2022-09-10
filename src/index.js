const express = require('express');
const app = express();
const {pool} = require('./dbConfig');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const url = require('url');

const initializePassport = require('./passportConfig');

initializePassport(passport);


const PORT = process.env.PORT || 4000;
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(require('./routes/index.routes'));

// Deja usar archivos estaticos
require(__dirname  + '/lib/helper.js');

app.get('/*.*', function(req, res) {

    var options = url.parse(req.url, true);

    var mime = Helper.getMime(options);
    
    serveFile(res, options.pathname, mime);

});

function serveFile(res, pathName, mime) {
    
    mime = mime || 'text/html';
    
    fs.readFile(__dirname + '/' + pathName, function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end('Error loading ' + pathName + " with Error: " + err);
        }
        res.writeHead(200, {"Content-Type": mime});
        res.end(data);
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})