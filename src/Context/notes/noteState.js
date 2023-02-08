import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {

    const host = "http://localhost:5000"

    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial)

    // Get All Notes
    const getNotes = async () => {
        // API CALL

        // Calling the backend to get all the notes

        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        
        const json = await response.json()
        
        // Setting the notes on the frontend
        setNotes(json)
    }
    
    // Add Note
    const addNote = async (title, description, tag) => {
        // API CALL

        // ADDING A NOTE IN THE BACKEND -> SENDING A POST REQ WITH BODY VALUES SET AS {title, description, tag}

        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag}) // body data type must match "Content-Type" header
        });

        const note = await response.json()
        
        setNotes(notes.concat(note))
    }

    // Delete Note
    const deleteNote = async (id) => {

        // API CALL

        // Deletes in the backend
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = response.json();

        // Deletes from the front end
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }
    // Edit Note
    const editNote = async (id, title, description, tag) => {
        // API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag}) // body data type must match "Content-Type" header
        });
        const json = await response.json(); // parses JSON response into native JavaScript objects

        let newNotes = JSON.parse(JSON.stringify(notes))

        // Logic to edit on the Client Side
        for (let i = 0; i < newNotes.length; i++) {
            const element = newNotes[i];

            if (element._id === id) {
                newNotes[i].title = title;
                newNotes[i].description = description;
                newNotes[i].tag = tag;
                break;
            }
        }
        setNotes(newNotes)
    }

    return (
        <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState