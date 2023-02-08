import React, { useContext, useState } from 'react'
import noteContext from '../Context/notes/noteContext'

function AddNote(props) {

    const context = useContext(noteContext)
    const { addNote } = context

    const [note, setNote] = useState({title:"", description:"", tag:""})

    const handleClick = (event) => {
        event.preventDefault()
        addNote(note.title, note.description, note.tag)
        setNote({title:"", description:"", tag:""})
        props.showAlert("Added Successfully","success")
    }
    // This takes care of changes in title or description or tag as event.target.name is either description, title or tag
    // and the event.target.value is the value the field is being changed to

    // ... spreads the description, tag and title fields such that they can be changed individually with one function
    const onChange = (event) => {
        setNote({...note, [event.target.name]: event.target.value})
    }

    return (
        <><div className="container my-5">
            <h1>Add A Note</h1>
            <form className='my-3'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onChange} value={note.title} required minLength={5}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' onChange={onChange} value={note.description} required minLength={5}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' onChange={onChange} value={note.tag} required minLength={5} />
                </div>
                
                <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
        </>
    )
}

export default AddNote