const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const path = require('path')
const { hasUserWithUserName } = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    id: user.id,
    full_name: xss(user.full_name),
    user_name: xss(user.user_name),
    password: xss(user.password),
    nickname: xss(user.nickname),
    date_created: new Date(user.date_created)
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
    .post(jsonParser, (req, res, next) => {
        const {full_name, user_name, password, nickname} = req.body
        const newUser = {full_name, user_name, password}

        //required fields
        for(const [key, value] of Object.entries(newUser))
            if(value == null)
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
        
        //validate password
        const passwordError = UsersService.validatePassword(password)
        if(passwordError) {
            return res.status(400).json({
                error: {message: passwordError}
            })
        }
        
        //optional field
        newUser.nickname = nickname

        const knexInstance = req.app.get('db')

        UsersService.hasUserWithUserName(knexInstance, user_name)
            .then(hasUserWithUserName => {
                if(hasUserWithUserName) 
                    return res.status(400).json({
                        error: {message: `Username already taken`}
                    })
                return UsersService.insertUser(knexInstance, newUser)
                    .then(user => {
                        res 
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${user.id}`))
                            .json(serializeUser(user))
                    })
            })
            .catch(next)
    })

usersRouter 
    .route('/:user_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getById(knexInstance, req.params.user_id)
            .then(user => {
                if(!user) {
                    return res.status(404).json({
                        error: {message: `User doesn't exist`}
                    })
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeUser(res.user))
    })

module.exports = usersRouter