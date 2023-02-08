const mongoose = require('mongoose')
const mongoUri = 'mongodb://localhost:27017/inotebook?readPreference=primary&directConnection=true&ssl=false'

const connectToMongo = () => {
    mongoose.connect(mongoUri, () => {
        console.log("Connected to DB");
    })
}

module.exports = connectToMongo