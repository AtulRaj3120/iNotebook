const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express();
const port = 5000;

app.use(cors())
// To enable us to log the req body json we use a middleware function
app.use(express.json());

app.use('/api/auth', require('./Routes/auth'))
app.use('/api/notes', require('./Routes/notes'))

app.listen(port, ()=> {
    console.log(`iNotebook App Listening on port ${port}`)
})
