const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const path = require('path')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    id: user.id,
    full_name: xss(user.full_name),
    user_name: xss(user.user_name),
    password: xss(user.password),
    nickname: xss(user.nickname),
    date_created: user.date_created
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })

usersRouter 
    .route('/:user_id')

module.exports = usersRouter