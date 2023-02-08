const mongoose = require('mongoose')
const { Schema } = mongoose

const notesSchema = new Schema({
    // Telling the notes schema that this note belongs to this person from the user model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // Name of the User Model is 'user'
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('notes', notesSchema)