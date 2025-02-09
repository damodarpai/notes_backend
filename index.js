require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

const requestLogger = (req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('---')
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(requestLogger)

app.get('/api/notes', (req, res) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res, next) => {
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

app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/notes/:id', (req, res, next) => {
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

app.post('/api/notes', (req, res, next) => {
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

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
