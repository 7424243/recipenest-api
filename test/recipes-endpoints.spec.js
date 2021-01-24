const {expect} = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const {makeRecipesArray, makeMaliciousRecipe} = require('./recipes.fixtures')
const {makeUsersArray} = require('./users.fixtures')

describe('Recipes Endpoints', function() {

    //create a connection to the test database
    let db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    //disconnect from database so that tests don't "hang"
    after('disconnect from db', () => db.destroy())

    //clear any data so that we have a fresh start
    before('clean the table', () => db.raw('TRUNCATE recipenest_users, recipenest_recipes RESTART IDENTITY CASCADE'))

    //clear up table after each test
    afterEach('cleanup', () => db.raw('TRUNCATE recipenest_users, recipenest_recipes RESTART IDENTITY CASCADE'))
   

    describe('GET /api/recipes/', () => {

        //for when the db table is empty
        context('Given no recipes', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/recipes/')
                    .expect(200, [])
            })
        })

        //for when the db table has data
        context('Given there are recipes in the database', () => {

            //some test data
            const testUsers = makeUsersArray()
            const testRecipes = makeRecipesArray()

            //insert the test data
            beforeEach('insert recipes', () => {
                return db
                    .into('recipenest_users')
                    .insert(testUsers)
                    .then(() => {
                        return db   
                            .into('recipenest_recipes')
                            .insert(testRecipes)
                    })
            })

            //assert that the response matches the data we inserted into the db table
            it(`GET /api/recipes/ responds with 200 and all of the recipes`, () => {
                return supertest(app)
                    .get('/api/recipes/')
                    .expect(200, testRecipes)
            })
        })

        //test for malicious recipe
        context('Given an XSS attack recipe', () => {

            //test data
            const testUsers = makeUsersArray()
            const {maliciousRecipe, expectedRecipe} = makeMaliciousRecipe()

            //insert data
            beforeEach('insert malicious recipe', () => {
                return db
                    .into('recipenest_users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('recipenest_recipes')
                            .insert(maliciousRecipe)
                    })
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get('/api/recipes/')
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].recipe_name).to.eql(expectedRecipe.recipe_name)
                        expect(res.body[0].description).to.eql(expectedRecipe.description)
                    })
            })
            
        })
    })
    
})


