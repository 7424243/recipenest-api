const { DATABASE_URL } = require('../config')

const RecipesService = {
    getAllRecipes(knex) {
        console.log(DATABASE_URL)
        return knex
            .select('*')
            .from('recipenest_recipes')
    },
    getById(knex, id) {
        return knex
            .select('*')
            .from('recipenest_recipes')
            .where('id', id)
            .first()
    },

}

module.exports = RecipesService