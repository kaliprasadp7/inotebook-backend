const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// ROUTE:1 Fetch all the notes using: GET "/api/notes/fetchallnotes" Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
    res.json(notes)

  } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

// ROUTE:2 Add a new note using: POST "/api/notes/addnote" Login required
router.post('/addnote', fetchuser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be 5 character').isLength({ min: 5 })
], async (req, res) => {

  try {
    const {title, description, tag} = req.body;
  // If there are errors return bad request and the errors
  const result = validationResult(req);
  if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
  }

  const note = new Note({title, description, tag, user:req.user.id})
  const savedNote = await note.save();

  res.json(savedNote);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
}

})

// ROUTE:3 Update note using: PUT "/api/notes/updatenote" Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

  const {title, description, tag} = req.body;
  //create newNote object
  const newNote = {};
  if(title){newNote.title = title}
  if(description){newNote.description = description}
  if(tag){newNote.tag = tag}

  //Find the note to be updated and update it
  let note = await Note.findById(req.params.id);
  if(!note){return res.status(404).send("Not found")}

  if(note.user.toString() !==  req.user.id){
    return res.status(404).send("Not found");
  }

  note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true})
  res.json({note});

})

// ROUTE:4 Delete note using: DELETE "/api/notes/deletenote" Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  //Find the note to be updated and update it
  let note = await Note.findById(req.params.id);
  if(!note){return res.status(404).send("Not found")}

  if(note.user.toString() !==  req.user.id){
    return res.status(404).send("Not found");
  }

  note = await Note.findByIdAndDelete(req.params.id);
  res.send({"Success" : "Note has been deleted succesfully", note:note});
})

module.exports = router