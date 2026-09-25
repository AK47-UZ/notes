import { useState, useEffect } from "react";

import Note from "./Note";
import noteService from "./services/noteService";
import Notification from "./components/Notification";

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2022
      </em>
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  /*useEffect(() => {
    console.log("effect");
    noteService.getAll().then((initialNotes) => {
      console.log("NOTES REÇUES DU BACKEND :", initialNotes)
      setNotes(initialNotes);
    });
  }, []);*/
  useEffect(() => {
  console.log("effect");

  noteService.getAll().then((initialNotes) => {
    console.log("NOTES REÇUES DU BACKEND :", initialNotes);
    setNotes(initialNotes);
  });
}, []);
  if (!notes) {
  return <div>Chargement...</div>;
}
  console.log("RENDER NOTES :", notes);
  const toggleImportanceOf = (id) => {
    console.log("ID reçu :", id);
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
console.log("ID :", id);
console.log("NOTE :", note);
console.log("CHANGED NOTE :", changedNote);
    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch( () => {
        alert(`the note '${note.content}' was already deleted from server `);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    };
    noteService.create(noteObject)
  .then((returnedNote) => {
    setNotes(notes.concat(returnedNote));
    setNewNote("");
  })
  .catch((error) => {
console.log("MESSAGE ERREUR :", error.response?.data?.error);
setErrorMessage(error.response?.data?.error);    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  });
  };
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? `important` : `all`}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};
export default App;
