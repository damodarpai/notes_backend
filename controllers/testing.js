const express = require('express')
const Note = require('../models/note')
const User = require('../models/user')

const testingRouter = express.Router()

testingRouter.post('/reset', async (req, res) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  res.status(204).end()
})

module.exports = testingRouter
