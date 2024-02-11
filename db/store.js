const util = require('util');
const fs = require('fs');
const uuidv1 = require('uuid/v1');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    // Read data from file
    read() {
        return readFileAsync('db/db.json', 'utf8');
    }

    // Write data to file
    write(note) {
        return writeFileAsync('db/db.json', JSON.stringify(note));
    }

    // Get all notes
    getNotes() {
        return this.read().then((notes) => {
            let parsedNotes;

            try {
                parsedNotes = JSON.parse(notes);
            } catch (error) {
                parsedNotes = [];
            }

            return parsedNotes;
        });
    }

    // Add a new note
    addNote(note) {
        const { title, text } = note;

        if (!title || !text) {
            throw new Error("Note 'title' and 'text' cannot be blank");
        }

        const newNote = { title, text, id: uuidv1() };

        return this.getNotes()
            .then((notes) => [...notes, newNote])
            .then((updatedNotes) => this.write(updatedNotes))
            .then(() => newNote);
    }

    // Remove a note by ID
    removeNote(id) {
        return this.getNotes()
            .then((notes) => notes.filter((note) => note.id !== id))
            .then((filteredNotes) => this.write(filteredNotes));
    }
}

module.exports = new Store();