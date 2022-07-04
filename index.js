require('dotenv').config()
const tw_client = require("./twclient")
const db = require('./db');

const dbdata = (cb,id) => {
    db.query(`SELECT * FROM film WHERE film_id = ${id}`,(err,res) => {
        if(err) {
            return cb(err)
        }
        cb(res)
    })
}

const tweet = async ddata => {
    const entry = ddata.rows[0]
    try {
        await tw_client.v2.tweet(`Today's film is '${entry.title}', released in ${entry.release_year}, it features ${entry.description}!`)
    } catch(e) {
        dbdata(tweet,entry.film_id + 1)
    }
}


dbdata(tweet,1)
