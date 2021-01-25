const RecipesService = {
    getAllRecipes(knex) {
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
    },
    deleteRecipe(knex, id) {
        return knex('recipenest_recipes')
            .where({id})
            .delete()
    },
    updateRecipe(knex, id, newRecipeFields) {
        return knex('recipenest_recipes')
            .where({id})
            .update(newRecipeFields)
    }

}

module.exports = RecipesService