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
    
    describe(`GET /api/recipes/:id`, () => {
        //test for when the db is empty
        context('Given no recipes', () => {
            it('responds with 404', () => {
                const recipeId= 123456
                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .expect(404, {error: {message: `Recipe doesn't exist`}})
            })
        })

        //test for when there are recipes in the db
        context(`Given there are recipes in the database`, () => {
            
            //make test data
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

            it('responds with 200 and the specified recipe', () => {
                const recipeId = 1
                const expectedRecipe = testRecipes[recipeId -1]
                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .expect(200, expectedRecipe)
            })
        })

        //test for xxs attacks
        context('Given an XXS attack recipe', () => {
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
            it('removes XXS attack content', () => {
                return supertest(app)
                    .get(`/api/recipes/${maliciousRecipe.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.recipe_name).to.eql(expectedRecipe.recipe_name)
                        expect(res.body.description).to.eql(expectedRecipe.description)
                    })
            })
        })
    })

    describe('POST /api/recipes/', () => {
        // //make test data
        // const testUsers = makeUsersArray()

        // //insert the test data
        // beforeEach('insert users', () => {
        //     return db
        //         .into('recipenest_users')
        //         .insert(testUsers)

        // })

        //creating a new recipe and a 201 response
        it('creates a recipe and responds with 201 and the new recipe', () => {
            const testUsers = makeUsersArray()
            this.retries(3)
            const newRecipe = {
                recipe_name: 'Test recipe',
                url: 'https://www.testing123.com',
                description: 'test description',
                notes: 'test notes...',
                img_url: 'https://ww.img.com"',
                user_id: 5
            }
            return db
                .into('recipenest_users')
                .insert(testUsers)
                .then(() => {
                    return supertest(app)
                        .post('/api/recipes')
                        .send(newRecipe)
                        .expect(201)
                        .expect(res => {
                        expect(res.body.recipe_name).to.eql(newRecipe.recipe_name)
                        expect(res.body.url).to.eql(newRecipe.url)
                        expect(res.body.description).to.eql(newRecipe.description)
                        expect(res.body.notes).to.eql(newRecipe.notes)
                        expect(res.body.img_url).to.eql(newRecipe.img_url)
                        expect(res.body.user_id).to.eql(newRecipe.user_id)
                        expect(res.body).to.have.property('id')
                        expect(res.headers.location).to.eql(`/api/recipes/${res.body.id}`)
                        const expected = new Date().toLocaleString()
                        const actual = new Date(res.body.date_created).toLocaleString()
                        expect(actual).to.eql(expected)
                        })
                        .then(postRes => {
                            supertest(app)
                                .get(`/api/recipes/${postRes.body.id}`)
                                .expect(postRes.body)
                        })
                    })
                
        })

        //validation test for recipe_name requirement
        it(`responds with 400 and an error message when the 'recipe_name' is missing`, () => {
            return supertest(app)
                .post('/api/recipes/')
                .send({
                    url: 'https://www.testing123.com',
                    description: 'test description',
                    notes: 'test notes...',
                    img_url: 'https://ww.img.com',
                    user_id: 5
                })
                .expect(400, {
                    error: {message: `Missing 'recipe_name' in request body`}
                })
        })

        //validation test for url requirement
        it(`responds with 400 and an error message when the 'url' is missing`, () => {
            return supertest(app)
                .post('/api/recipes/')
                .send({
                    recipe_name: 'test recipe',
                    description: 'test description',
                    notes: 'test notes...',
                    img_url: 'https://ww.img.com',
                    user_id: 5
                })
                .expect(400, {
                    error: {message: `Missing 'url' in request body`}
                })
        })

        //validation test for user_id requirement
        it(`responds with 400 and an error message when the 'user_id' is missing`, () => {
            return supertest(app)
                .post('/api/recipes/')
                .send({
                    recipe_name: 'test recipe',
                    url: 'https://www.testing123.com',
                    description: 'test description',
                    notes: 'test notes...',
                    img_url: 'https://ww.img.com'
                })
                .expect(400, {
                    error: {message: `Missing 'user_id' in request body`}
                })
        })

        //xss attack content
        it('removes XSS attack content from response', () => {
            const testUsers = makeUsersArray()
            const {maliciousRecipe, expectedRecipe} = makeMaliciousRecipe()
            return db
                .into('recipenest_users')
                .insert(testUsers)
                .then(() => {
                    return supertest(app) 
                        .post('/api/recipes/')
                        .send(maliciousRecipe)
                        .expect(201)
                        .expect(res => {
                            expect(res.body.recipe_name).to.eql(expectedRecipe.recipe_name)
                            expect(res.body.description).to.eql(expectedRecipe.description)
                        })
                })
        })
    })

    describe('DELETE /api/recipes/:recipe_id', () => {

        //no recipes in db
        context('Given no recipes', () => {
            it('responds with 404', () => {
                const recipeId = 123456
                return supertest(app)
                    .delete(`/api/recipes/${recipeId}`)
                    .expect(404, {error: {message: `Recipe doesn't exist`}})
            })
        })

        //recipes in db
        context('Given there are recipes in the database', () => {

            //testing data
            const testUsers = makeUsersArray()
            const testRecipes = makeRecipesArray()
            
            //insert testing data
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

            it('responds with 204 and removes the recipe', () => {
                const idToRemove = 2
                const expectedRecipes = testRecipes.filter(recipe => recipe.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/recipes/${idToRemove}`)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get('/api/recipes/')
                            .expect(expectedRecipes)
                    )
            })
        })
    })
})


