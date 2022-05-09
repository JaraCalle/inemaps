const express = require("express");
const morgan = require("morgan");
const app = express()

// SETTINGS
app.set('port', process.env.PORT || 8080)

// MIDDLEWARES
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// STARTING THE SERVER
app.listen(app.get('port'), () => {
    console.log('Server started on port: ',app.get('port'))
})   