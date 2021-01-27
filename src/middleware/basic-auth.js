const AuthService = require('../auth/auth-service')
const usersRouter = require('../users/users-router')

function requireAuth(req, res, next) {

    console.log('requireAuth' ,req.get('Authorization'))

    const authToken = req.get('Authorization') || ''

    let basicToken
    if(!authToken.toLowerCase().startsWith('basic ')) {
        return res.status(401).json({error: 'Missing basic token'})
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length)
        console.log('basic token', basicToken)
    }
    const [tokenUserName, tokenPassword] = Buffer
        .from(basicToken, 'base64')
        .toString()
        .split(':')

    console.log('tokenUserName', tokenUserName)
    console.log('tokenPassword', tokenPassword)

    if(!tokenUserName || !tokenPassword) {
        return res.status(401).json({error: 'Unauthorized request'})
    }

    req.app.get('db')('recipenest_users')
        .where({ user_name: tokenUserName })
        .first()
        .then(user => {
            console.log(user)
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized request' })
            }
            return AuthService.comparePasswords(tokenPassword, user.password)
                .then(passwordsMatch => {
                    if(!passwordsMatch) {
                        return res.status(401).json({error: 'Unauthorized request'})
                    }
                    req.user = user
                    next()

                })
        })
        .catch(next)
    
}

module.exports = {
    requireAuth,
}