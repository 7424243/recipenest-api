const { DATABASE_URL } = require('../config')

const RecipesService = {
    getAllRecipes(knex) {
        console.log(DATABASE_URL)
        return knex
            .select('*')
            .from('recipenest_recipes')
    },

}

module.exports = RecipesService