function makeUsersArray() {
    return [
        {
            id: 5,
            full_name: 'test user 1',
            user_name: 'testuser1',
            password: 'test123',
            date_created: '2019-01-03T00:00:00.000Z'
        },
        {
            id: 6,
            full_name: 'test user 2',
            user_name: 'user2',
            password: '123test',
            date_created: '2019-01-03T00:00:00.000Z'
        }
    ]
}

module.exports = {
    makeUsersArray,
}