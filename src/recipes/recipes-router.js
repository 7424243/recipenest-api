const express = require('express')
const xss = require('xss')
const RecipesService = require('./recipes-service')

const recipesRouter = express.Router()
const jsonParser = express.json()

const serializeRecipe = recipe => ({
    id: recipe.id,
    recipe_name: xss(recipe.recipe_name),
    url: xss(recipe.url),
    description: xss(recipe.description),
    notes: xss(recipe.notes),
    img_url: xss(recipe.img_url),
    date_created: recipe.date_created,
    user_id: recipe.user_id
})

recipesRouter 
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipesService.getAllRecipes(knexInstance)
            .then(recipes => {
                res.json(recipes.map(serializeRecipe))
            })
            .catch(next)
    })

module.exports = recipesRouter