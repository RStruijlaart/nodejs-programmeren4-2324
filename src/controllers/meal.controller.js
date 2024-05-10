const mealService = require('../services/meal.service')
const logger = require('../util/logger')

let mealController = {
    create: (req, res, next) => {
        const meal = req.body
        const profileId = req.userId

        mealService.create(profileId, meal, (error, success) => {
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
}

module.exports = mealController
