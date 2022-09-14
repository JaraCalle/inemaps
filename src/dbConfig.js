require('dotenv').config();
const {Pool} = require('pg')

//const connectString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}: ${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
	user: 'kkcoypnrovcrsn',
	host: 'ec2-44-209-158-64.compute-1.amazonaws.com',
	database: 'd1nr49veeufkoh',
	password: '12b4a644fda911b8398eb69599717cf64db60133b57b961a1b07e0cbc6e9e5c7',
	ssl: {    /* <----- Add SSL option */
    rejectUnauthorized: false,
},
	port: 5432,
});

module.exports = {pool}