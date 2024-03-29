# RecipeNest API!

This API was originally built for the [RecipeNest](https://github.com/7424243/recipenest-client) app.

## Documentation

* Base URL: 'http://localhost:8000/api'
* Response Format: JSON
* Database: recipenest
* Owner: samsheets

### Server and Database Connection
After the Heroku plan updates, the server and database need to be running *locally* in order for the fullstack application to work as expected.

1. Start Server:
```
npm run start
```

2. Start Database in Terminal:
```
/usr/local/opt/postgresql@13/bin/postgres -D /usr/local/var/postgresql@13
```

OR,
2. Start Database in Terminal in the Background:
```
brew services restart postgresql@13
```

### Recipes Endpoints
* Required Parameters: recipe_name (string), url (string), user_id (integer), date_created (timestamptz)
* Optional Parameters: description (string), notes (string), img_url (string)
* ```GET /recipes/```  >>  gets all recipe entries
* ```POST /recipes/```  >>  add a new recipe entry (protected endpoint)
* ```GET /recipes/:recipe_id```  >>  get a recipe entry by id  
Example Response:  
    ```
    {  
        "id": 3,  
        "recipe_name": "Recipe Name",  
        "url": "https://recipeurl.com,  
        "description": "description of recipe",  
        "notes": "notes for recipe",  
        "img_url": "https://recipeimgurl.com",  
        "date_created": "2018-03-01T00:00:00.000Z",  
        "user_id": 1 
    } 
    ```  
* ```DELETE /recipes/:recipe_id```  >>  delete a recipe entry by id (protected endpoint)
* ```PATCH /recipes/:recipe_id```  >>  patch/edit a recipe entry by id (protected endpoint)
* ```GET /recipes/users/:user_id```  >>  get all recipes for a user (protected endpoint)

### Users Endpoints
* Required Parameters: user_name (string), password (string), full_name (string), date_created (timestamptz)
* Optional Parameters: nickname (string)
* ```POST /users/```  >>  create a new user
* ```GET /users/:user_id```  >>  get a user by id  
Example Response:  
    ```
    {  
        "id": 1,  
        "full_name": "Example Name",  
        "user_name": "exampleuser",  
        "password": "$2a$12$vpzXZQp9U1pl1LNv6LVBoONKZWscyMRxRHPZRKJsVG2RhiY..uV5q",  
        "nickname": "user 1",  
        "date_created": "2018-03-01T00:00:00.000Z"  
    }
    ```

### Login Endpoint 
* Required Parameters: user_name (string), password (string)
* ```POST /login```  >>  to login using JWT authentication

## Summary

This server was created in order to help keep track of virtual recipe notes. The database is made up of two tables, one for recipes and one for users. The API allows GET, POST, DELETE, and PATCH requests based on the endpoint. Protected endpoints utilize JWT Authentication.

## Built With

* Node
* Express
* PostgreSQL
* JavaScript

## Heroku Deprecated Info
Heroku plan changes went into effect 11/28/22. As of that date, the server and database are no longer actively deployed there.

* The database dump can be found in the `herokuDbDump` folder.
* Old server api: https://infinite-headland-60692.herokuapp.com/api
