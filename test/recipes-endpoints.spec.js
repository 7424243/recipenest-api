const {expect} = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const RecipesService = require('../src/recipes/recipes-service')

describe('Recipes Endpoints', function() {

    //create a connection to the test database
    let db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
    })

    //disconnect from database so that tests don't "hang"
    after('disconnect from db', () => db.destroy())

    //clean tables
    before('clean the table', () => db('recipenest_recipes').truncate())

    context('Given there are recipes in the database', () => {
        const testRecipes = [
            {
                "id": 1,
                "recipe_name": "Test Recipe 1",
                "url": "https://testurl1.com",
                "description": "Lorem ipsum dolor sit amet.",
                "notes": "Earum molestiae accusamus veniam consectetur tempora.",
                "img_url": "https://testimgurl1",
                "date_created": "2019-01-03T00:00:00.000Z",
                "user_id": 1,
            },
            {
                "id": 2,
                "recipe_name": "test recipe 2",
                "url": "https://testurl2.com",
                "description": "Necessitatibus, reiciendis?",
                "notes": "Possimus, voluptate?",
                "img_url": "https://testimgurl2.com",
                "date_created": "2018-08-15T23:00:00.000Z",
                "user_id": 2,
            },
            {
                "id": 3,
                "recipe_name": "test recipe 3",
                "url": "https://testurl3.com",
                "description": "Cum, exercitationem cupiditate dignissimos est perspiciatis.",
                "notes": "Adipisci, pariatur.",
                "img_url": "https://testurl3.com",
                "date_created": "2018-03-01T00:00:00.000Z",
                "user_id": 1,
            },
        ]
    })
})


