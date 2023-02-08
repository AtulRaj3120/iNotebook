const jwt = require('jsonwebtoken')

const JWT_SECRET = 'atulisawonderfulguy'

const fetchUser = (req, res, next) => {
    // Get the user from the JWT Token and add it to req id

    const token = req.header('auth-token')

    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    // For Invalid Token
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}

module.exports = fetchUser