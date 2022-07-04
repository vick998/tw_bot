const {Pool,Client} = require('pg')
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
    user: 'viktor',
    host: 'localhost',
    database: 'dvd_rentals',
    password: 'admin',
    port: process.env.PORT,
})

module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
  }
