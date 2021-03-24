require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const recipesRouter = require('./recipes/recipes-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

const app = express()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
//app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  })

//allow CORS for dynamic origins
// const whitelist = ['http://localhost:3000', 'https://recipenest.vercel.app']
// const corsOptions = {
//     origin: function(origin, callback) {
//         let originWhitelisted = whitelist.indexOf(origin) !== -1
//         callback(null, originWhitelisted)
//     }
// }
// app.use(cors(corsOptions))

app.use('/api/recipes', recipesRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'production') {
        // response={error: {message: 'server error'}}
        response = {message: error.message, error}
    } else {
        console.error(error)
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app