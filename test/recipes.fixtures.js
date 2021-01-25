function makeRecipesArray() {
    return [
        {
            id: 1,
            recipe_name: 'Test Recipe 1',
            url: 'https://testurl1.com',
            description: 'Lorem ipsum dolor sit amet.',
            notes: 'Earum molestiae accusamus veniam consectetur tempora.',
            img_url: 'https://testimgurl1',
            date_created: '2019-01-03T00:00:00.000Z',
            user_id: 1,
        },
        {
            id: 2,
            recipe_name: 'test recipe 2',
            url: 'https://testurl2.com',
            description: 'Necessitatibus, reiciendis?',
            notes: 'Possimus, voluptate?',
            img_url: 'https://testimgurl2.com',
            date_created: '2018-08-15T23:00:00.000Z',
            user_id: 2,
        },
        {
            id: 3,
            recipe_name: 'test recipe 3',
            url: 'https://testurl3.com',
            description: 'Cum, exercitationem cupiditate dignissimos est perspiciatis.',
            notes: 'Adipisci, pariatur.',
            img_url: 'https://testurl3.com',
            date_created: '2018-03-01T00:00:00.000Z',
            user_id: 1,
        },
    ]
}

function makeMaliciousRecipe() {
    const maliciousRecipe = {
        id: 911,
        recipe_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        url: 'https://doesthiswork.com',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        notes: 'n/a',
        img_url: 'https://imgurl.com',
        date_created: new Date().toISOString(),
        user_id: 1
    }
    const expectedRecipe = {
        ...maliciousRecipe,
        recipe_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousRecipe, 
        expectedRecipe,
    }
}

module.exports = {
    makeRecipesArray,
    makeMaliciousRecipe,
}