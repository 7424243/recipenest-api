const express = require('express')
const xss = require('xss')
const RecipesService = require('./recipes-service')
const path = require('path')

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

recipesRouter
    .route(`/:recipe_id`)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipesService.getById(knexInstance, req.params.recipe_id)
            .then(recipe => {
                if(!recipe) {
                    return res.status(404).json({
                        error: {message: `Recipe doesn't exist`}
                    })
                }
                res.recipe = recipe
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeRecipe(res.recipe))
    })


module.exports = recipesRouter