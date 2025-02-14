const express = require('express')
const Note = require('../models/note')

const notesRouter = express.Router()

notesRouter.get('/', (req, res) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })
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

notesRouter.post('/', (req, res, next) => {
  const body = req.body
  const note = new Note({
    content: body.content,
    important: body.important || false
  })
  note.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => {
      next(error)
    })
})

module.exports = notesRouter
