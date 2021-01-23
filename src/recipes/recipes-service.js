const RecipesService = {
    getAllRecipes(knex) {
        return knex.select('*').from('recipenest_recipes')
    },

}

module.exports = RecipesService