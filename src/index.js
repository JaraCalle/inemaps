const express = require('express')
const app = express()
const {pool} = require('./dbConfig')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const path = require('path')

const initializePassport = require('./passportConfig')

initializePassport(passport)


const PORT = process.env.PORT || 4000;
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(require('./routes/index.routes'))

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})