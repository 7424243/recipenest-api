const UsersService = {
    getAllUsers(knex) {
        return knex
            .select('*')
            .from('recipenest_users')
    },
    getById(knex, id) {
        return knex
            .select('*')
            .from('recipenest_users')
            .where('id', id)
            .first()
    },
    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('recipenest_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteUser(knex) {
        return knex('recipenest_users')
            .where({id})
            .delete()
    },
    updateUser(knex, id, newUserFields) {
        return knex('recipenest_users')
            .where({id})
            .update(newUserFields)
    }
}

module.exports = UsersService