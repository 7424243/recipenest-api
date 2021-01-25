const {expect} = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const {makeUsersArray, makeMaliciousUser} = require('./users.fixtures')

describe.only('Users Endpoints', () => {

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

            //make testing data
            const testUsers = makeUsersArray()

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
                        expect(res.body[0].password).to.eql(expectedUser.password)
                    })
            })
        })


    })
})