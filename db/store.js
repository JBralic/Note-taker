const util = require('util');
const fs = require('fs');

// This package will be used to generate our unique ids. https://www.npmjs.com/package/uuid
const uuidv1 = require('uuid/v1');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store{
    read (){
        return readFileAsync('db/db.json','utf8');
    }

    write (note){
        return writeFileAsync('db/db.json',JSON.stringify(note))
    }

    getNotes (){
        return this.read().then((notes)=> {
            let parsedNotes;

            try {
                parsedNotes = [].concat(JSON.parse(notes))
            } catch (error) {
                parsedNotes = [];
            }
            return parsedNotes
        })
    }
    addNote (note){
        const{title,text} = note;

        if (!title || !text) {
            throw new Error("Note 'title' and 'text' cannot be blank");
        }

        const newNote = {title, text, id: uuidv1()};

        // get notes, add new note, update notes, return new note
        return this.getNotes().then((notes) => [...notes, newNote])
        .then((updatedNotes) => this.write(updatedNotes))
        .then(()=> newNote);
    }
        removeNote(id){
            return this.getNotes()
            .then((notes)=> notes.filter((note)=> note.id !== id))
            .then((filteredNotes)=> this.write(filteredNotes));
        }
        
    }
module.exports = new Store();