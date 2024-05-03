const database = require('../dao/inmem-db')

const userService = {
    create: (user, callback) => {
        database.add(user, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (filterFields, callback) => {
        database.getAll(filterFields, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },

    getById: (userId, callback) => {
        database.getById(userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found user with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    update: (userId, user, callback) => {
        database.update(userId, user,(err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Updated user with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    delete: (userId, callback) => {
        database.delete(userId,(err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User with id ${userId} has been deleted`,
                    data: data
                })
            }
        })
    }
}

module.exports = userService
