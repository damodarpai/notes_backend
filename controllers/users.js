const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('notes', { content: 1, important: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })
  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter
