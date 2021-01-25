function makeUsersArray() {
    return [
        {
            id: 5,
            full_name: 'test user 1',
            user_name: 'testuser1',
            password: 'test123',
            nickname: 'test nickname',
            date_created: '2019-01-03T00:00:00.000Z'
        },
        {
            id: 6,
            full_name: 'test user 2',
            user_name: 'user2',
            password: '123test',
            nickname: 'test nickname',
            date_created: '2019-01-03T00:00:00.000Z'
        }
    ]
}

function makeMaliciousUser() {
    const maliciousUser = {
        id: 911,
        full_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        user_name: 'test username',
        password: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        nickname: 'test',
        date_created: new Date().toISOString(),
    }
    const expectedUser = {
        ...maliciousUser,
        full_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        password: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousUser,
        expectedUser,
    }
}

module.exports = {
    makeUsersArray,
    makeMaliciousUser,
}