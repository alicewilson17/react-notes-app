import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { addDoc, onSnapshot } from "firebase/firestore"
import { notesCollection } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )


    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            //sync up our local notes array with the snapshot data
                const notesArr = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }))

        })
        return unsubscribe
    }, [])

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]


    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here"
        }
       const newNoteReference = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteReference.id)
    }

    function updateNote(text) {
        setNotes(oldNotes => {
            const newArray = []
            for (let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if (oldNote.id === currentNoteId) {
                    // Put the most recently-modified note at the top
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }

    function deleteNote(event, noteId) {
        event.stopPropagation()
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }

    // function findCurrentNote() {
    //     return notes.find(note => {
    //         return note.id === currentNoteId
    //     }) || notes[0]
    // }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={currentNote}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
