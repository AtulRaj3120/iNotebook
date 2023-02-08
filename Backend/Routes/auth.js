const express = require('express')
const User = require('../Models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var fetchUser = require('../Middleware/fetchUser')

const JWT_SECRET = 'atulisawonderfulguy'

const router = express.Router()

// Create a User using POST request with User info on route /api/auth/createUser
// ROUTE 1
router.post('/createUser', [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password must be of atleast 5 Characters').isLength({ min: 5 }),
], async (req, res, next) => {
    //If there are errors return BAD REQUEST and return error   
    let success = false

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        //Check whether the user with this email already exists
        let user = await User.findOne({ email: req.body.email })

        // If user already exists
        if (user) {
            return res.status(400).json({ success, error: 'Sorry, A User With This Email Already Exists' })
        }

        // Implementing hashing using bCryptJS

        // .hash and .genSalt function returns a promise
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        // Create a new user using User Mongoose model
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        });

        // The auth token can be converted into the data and verify if the user is valid

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = await jwt.sign(data, JWT_SECRET);

        success = true
        res.json({success, authToken });
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }
})

// Authenticate a User using POST request with User info on route /api/auth/login
// ROUTE 2
router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res, next) => {

    let success = false

    //If there are errors return BAD REQUEST and return error   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Credentials Incorrect" })
        }
        // Comparing Password Entered and Hashed PassWord
        const passwordCompare = await bcrypt.compare(password, user.password)

        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Credentials Incorrect" })
        }
        // If credentials entered are correct then we send the payload which is the data
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = await jwt.sign(data, JWT_SECRET);

        success = true
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }
})

// ROUTE 3 - Get logged in User Details using POST - Login Required

router.post('/getuser', fetchUser, async (req, res, next) => {
    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }
})

module.exports = router