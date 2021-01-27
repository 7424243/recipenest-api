const {expect} = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const {makeUsersArray, makeMaliciousUser} = require('./users.fixtures')
const bcrypt = require('bcryptjs')

describe('Users Endpoints', () => {

    //make testing data
    const testUsers = makeUsersArray()

    //create a connection to the test db
    let db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    //disconnect from database so that tests don't hang
    after('disconnect from db', () => db.destroy())

    //clear any data so that we have a fresh start
    before('clean the table', () => db.raw('TRUNCATE recipenest_users RESTART IDENTITY CASCADE'))

    //clear up table after each test
    afterEach('cleanup', () => db.raw('TRUNCATE recipenest_users RESTART IDENTITY CASCADE'))

    describe('GET /api/users/', () => {

        //for when the db table is empty
        context('Given no users', () => {

            it('responds with 200 and an empty list', () => {

                return supertest(app)
                    .get('/api/users/')
                    .expect(200, [])
            })
        })

        //for whe nthe db table has data
        context('Given there are users in the database', () => {

            //insert test data
            beforeEach('insert users', () => {
                return db   
                    .into('recipenest_users')
                    .insert(testUsers)
            })

            it('GET /api/users/ responds with 200 and all of the users', () => {

                return supertest(app)
                    .get('/api/users/')
                    .expect(200, testUsers)

            })
        })

        //test for malicious user
        context('Given an XSS attack user', () => {

            //testing data
            const {maliciousUser, expectedUser} = makeMaliciousUser()

            //insert data
            beforeEach('insert malicious user', () => {
                return db
                    .into('recipenest_users')
                    .insert(maliciousUser)
            })

            it('removes XSS attack content', () => {

                return supertest(app)
                    .get('/api/users/')
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].full_name).to.eql(expectedUser.full_name)
                    })

            })
        })
    })

    describe('GET /api/users/:user_id', () => {
        
        //no data in the db
        context('Given no users', () => {

            it('responds with 404', () => {

                const userId = 123456

                return supertest(app)
                    .get(`/api/users/${userId}`)
                    .expect(404, {
                        error: {message: `User doesn't exist`}
                    })

            })

        })

        //data in the db
        context('Given there are users in the database', () => {

            //insert test data
            beforeEach('insert users', () => {
                return db
                    .into('recipenest_users')
                    .insert(testUsers)
            })

            it('responds with 200 and the user', () => {

                const userId = 1
                const expectedUser = testUsers[userId - 1]
                return supertest(app)
                    .get(`/api/users/${userId}`)
                    .expect(200, expectedUser)
            })

        })

        //XSS attack
        context('Given an XSS attack user', () => {

            //testing data
            const {maliciousUser, expectedUser} = makeMaliciousUser()

            //insert data
            beforeEach('insert malicious user', () => {
                return db
                    .into('recipenest_users')
                    .insert(maliciousUser)
            })

            it('removes the XSS attack content', () => {

                return supertest(app)
                    .get(`/api/users/${maliciousUser.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.full_name).to.eql(expectedUser.full_name)
                        
                    })
            })

        })
    })

    describe('POST /api/users/', () => {

        //creates a new user
        it('creates a user and responds 201 and the new user', () => {
            
            const newUser = {
                full_name: 'Test fullname',
                user_name: 'Test username',
                password: 'Testing123!', 
                nickname: 'test',
            }
            
            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.full_name).to.eql(newUser.full_name)
                    expect(res.body.user_name).to.eql(newUser.user_name)
                    expect(res.body.nickname).to.eql(newUser.nickname)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    const expected = new Date().toLocaleString()
                    const actual = new Date(res.body.date_created).toLocaleString()
                    expect(actual).to.eql(expected)
                })
                .expect(res => 
                    db  
                        .from('recipenest_users')
                        .select('*')
                        .where({id: res.body.id})
                        .first()
                        .then(row => {
                            expect(row.user_name).to.eql(newUser.user_name)
                            expect(row.full_name).to.eql(newUser.full_name)
                            expect(row.nickname).to.eql(newUser.nickname)
                            const expected = new Date().toLocaleString()
                            const actual = new Date(row.date_created).toLocaleString()
                            expect(actual).to.eql(expected)
                            return bcrypt.compare(newUser.password, row.password)
                        })
                        .then(compareMatch => {
                            expect(compareMatch).to.be.true
                        })
                )
        })

            //xss attack content
        it('removes XSS attack content from response', () => {

            //testing data
            const {maliciousUser, expectedUser} = makeMaliciousUser()

            return supertest(app)
                .post('/api/users/')
                .send(maliciousUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.full_name).to.eql(expectedUser.full_name)
                })
        
        })
        
        //validation tests
        context('validation for required fields, password complexity, and user_name uniqueness', () => {

            //insert test data
            beforeEach('insert users', () => {
                return db
                    .into('recipenest_users')
                    .insert(testUsers)
            })

            //validation test for full_name requirement
            it(`responds with 400 and an error message when the 'full_name' is missing`, () => {

                const newUserNoFullName = {
                    user_name: 'Test username',
                    password: 'Testing123!', 
                    nickname: 'test'
                }

                return supertest(app)
                    .post('/api/users/')
                    .send(newUserNoFullName)
                    .expect(400, {
                        error: {message: `Missing 'full_name' in request body`}
                    })

            })

            //validation test for user_name requirement 
            it(`responds with 400 and an error message when the 'user_name' is missing`, () => {

                const newUserNoUserName = {
                    full_name: 'Test fullname',
                    password: 'Testing123!', 
                    nickname: 'test'
                }

                return supertest(app)
                    .post('/api/users/')
                    .send(newUserNoUserName)
                    .expect(400, {
                        error: {message: `Missing 'user_name' in request body`}
                    })

            })

            //validation test for password requirement
            it(`responds with 400 and an error message when the 'password' is missing`, () => {

                const newUserNoPassword = {
                    full_name: 'Test fullname',
                    user_name: 'Test username',
                    nickname: 'test'
                }

                return supertest(app)
                    .post('/api/users/')
                    .send(newUserNoPassword)
                    .expect(400, {
                        error: {message: `Missing 'password' in request body`}
                    })

            })

            //validation tests for password 
            it(`responds with 400 'Password must be longer than 8 characters'`, () => {
                const newUserShortPassword = {
                    full_name: 'Test fullname',
                    user_name: 'Test username',
                    password: '1234567', 
                    nickname: 'test'
                }
                return supertest(app)
                
                    .post('/api/users/')
                    .send(newUserShortPassword)
                    .expect(400, {
                        error: {message: `Password must be longer than 8 characters`}
                    })

            })

            //validation tests for password 
            it(`responds with 400 'Password must be shorter than 72 characters'`, () => {

                const newUserLongPassword = {
                    full_name: 'Test fullname',
                    user_name: 'Test username',
                    password: '*'.repeat(73), 
                    nickname: 'test'
                }

                return supertest(app)
                    .post('/api/users/')
                    .send(newUserLongPassword)
                    .expect(400, {
                        error: {message: `Password must be less than 72 characters`}
                    })

            })

            //validation tests for password 
            it(`responds with 400 when password starts with spaces`, () => {

                const newUserPasswordStartsSpaces = {
                    full_name: 'Test fullname',
                    user_name: 'Test username',
                    password: ' Testing123!', 
                    nickname: 'test'
                }

                return supertest(app)
                    .post('/api/users/')
                    .send(newUserPasswordStartsSpaces)
                    .expect(400, {
                        error: {message: `Password must not start or end with empty spaces`}
                    })

            })

            //validation tests for password 
            it(`responds with 400 when password ends with spaces`, () => {

                const newUserPasswordEndsSpaces = {
                    full_name: 'Test fullname',
                    user_name: 'Test username',
                    password: 'Testing123! ', 
                    nickname: 'test'
                }

                return supertest(app)
                    .post('/api/users/')
                    .send(newUserPasswordEndsSpaces)
                    .expect(400, {
                        error: {message: `Password must not start or end with empty spaces`}
                    })

            })

            //validation tests for password 
            it(`respond with 400 when password isn't complex enough`, () => {

                const newUserPasswordNotComplex = {
                    full_name: 'Test fullname',
                    user_name: 'Test username',
                    password: '11AAaabb', 
                    nickname: 'test'
                }

                return supertest(app)
                    .post('/api/users/')
                    .send(newUserPasswordNotComplex)
                    .expect(400, {
                        error: {message: `Password must contain 1 upper case, lower case, number and special character`}
                    })

            })

            //validation test for inique user_name
            it(`responds with 400 'User name already taken' when user_name already exists`, () => {
                
                const newDuplicateUserName = {
                    full_name: 'Test fullname',
                    user_name: testUsers[0].user_name,
                    password: 'Testing123!', 
                    nickname: 'test'
                }

                return supertest(app)
                    .post('/api/users/')
                    .send(newDuplicateUserName)
                    .expect(400, {
                        error: {message: 'Username already taken'}
                    })

            })
        
        })

    })
})