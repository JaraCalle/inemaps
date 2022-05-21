require('dotenv').config();
const {Pool} = require('pg')

const isProduction = process.env.NODE_ENV === 'production';

//const connectString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}: ${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
	user: 'postgres',
	host: '127.0.0.1',
	database: 'nodelogin',
	password: 'pendejo4172286',
	port: 5432,
});

module.exports = {pool}