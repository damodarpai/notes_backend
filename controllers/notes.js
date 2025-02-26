const express = require('express')
const Note = require('../models/note')

const notesRouter = express.Router()

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id
  const note = await Note.findById(id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

notesRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  await Note.findByIdAndDelete(id)
  res.status(204).end()
})

notesRouter.put('/:id', (req, res, next) => {
  const id = req.params.id
  const { content, important } = req.body
  const note = { content, important }
  Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => {
      next(error)
    })
})

notesRouter.post('/', async (req, res, next) => {
  const body = req.body
  const note = new Note({
    content: body.content,
    important: body.important || false
  })
  const savedNote = await note.save()
  res.status(201).json(savedNote)
})

module.exports = notesRouter
