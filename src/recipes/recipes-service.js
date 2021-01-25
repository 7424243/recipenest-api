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
    insertRecipe(knex, newRecipe) {
        return knex
            .insert(newRecipe)
            .into('recipenest_recipes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }

}

module.exports = RecipesService