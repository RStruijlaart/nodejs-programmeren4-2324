const userService = require('../services/user.service')

let userController = {
    create: (req, res, next) => {
        const user = req.body

        userService.getAll((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                const emailExists = success.data.some(obj => obj.emailAdress === user.emailAdress);

                if(emailExists){
                    return next({
                        status: 403,
                        message: 'Email adress already in use',
                        data: {}
                    })
                }

                userService.create(user, (error, success) => {
                    if (error) {
                        return next({
                            status: error.status,
                            message: error.message,
                            data: {}
                        })
                    }
                    if (success) {
                        res.status(201).json({
                            status: success.status,
                            message: success.message,
                            data: success.data
                        })
                    }
                })
            }
        })
    },

    getAll: (req, res, next) => {
        userService.getAll((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getById: (req, res, next) => {
        const userId = req.params.userId
        userService.getById(userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    update: (req, res, next) => {
        const userId = req.params.userId
        const user = req.body
        userService.update(userId, user,(error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    }
}

module.exports = userController
