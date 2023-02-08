const express = require('express')
const fetchUser = require('../Middleware/fetchUser')
const { body, validationResult } = require('express-validator')
const Notes = require('../Models/Notes')
const router = express.Router()

// Route 1 : Get all the notes -> GET REQUEST -> Login Required

router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {

        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }
})

// Route 2 : Add a new note using POST -> LOGIN REQUIRED

router.post('/addnote', fetchUser, [
    body('title', 'Enter a Valid Title').isLength({ min: 3 }),
    body('description', 'Description must be of atleast 5 Characters').isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body

        //If there are errors return BAD REQUEST and return error   
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Creating a new note model
        const note = new Notes({
            user: req.user.id,
            title,
            description,
            tag,
        })

        const savedNote = await note.save()

        res.json(savedNote);

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }

})

// Route 3 : Update an existing note PUT -> LOGIN REQUIRED

router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body

    // Create a new note object
    const newNote = {}

    // Update only if user wants to
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }

    // Find the note to be updated
    let note = await Notes.findById(req.params.id) // this takes the id passed as parameter

    // If no note with this ID exists
    if (!note) { return res.status(404).send("Not Found") }

    // In our note object we have a field called user having the id of the user so we try to verify it
    if (note.user.toString() != req.user.id) { return res.status(401).send("Not Allowed") }

    // If we reach here then it means that this put request is valid

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json(note)

})

// Route 4 : Delete an existing note DELETE -> LOGIN REQUIRED

router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    try {

        // Find the note to be updated and delete it
        let note = await Notes.findById(req.params.id) // this takes the id passed as parameter

        // If no note with this ID exists
        if (!note) { return res.status(404).send("Not Found") }

        // In our note object we have a field called user having the id of the user so we try to verify it
        if (note.user.toString() != req.user.id) { return res.status(401).send("Not Allowed") }

        // If we reach here then it means that this delete request is valid

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note Deleted", "note": note })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }

})

module.exports = router