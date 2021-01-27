const bcrypt = require('bcryptjs')

function hashUserPassword(users) {
    const protectedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return protectedUsers
}




module.exports = {
    hashUserPassword,
}