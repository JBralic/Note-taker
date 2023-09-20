const router = require ("express").Router();
const store = require ("../db/store");

// "/api/notes" get all notes
router.get("/notes", (req,res)=> {
store
.getNotes()
.then((notes)=> {
    return res.json(notes)
})
.catch((err)=> res.status(500).json(err));
});


router.post("/notes", (req,res)=> {

});


router.delete("/notes/:id", (req,res)=> {

});