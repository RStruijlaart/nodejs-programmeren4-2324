const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const mealController = require('../controllers/meal.controller.js')
const validateToken = require('./authentication.routes.js').validateToken

// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

const validateMealCreateChaiExpect = (req, res, next) => {
    try {

        acceptebleFields = ['name', 'description', 'price', 'dateTime', 'maxAmountOfParticipants' ,'imageUrl', 'isActive', 'isVega', 'isVegan', 'isToTakeHome', 'allergenes']

        const fieldCheck = Object.keys(req.body).some((key) => {
            return !acceptebleFields.includes(key)
        })

        chai.expect(fieldCheck, "Accepteble fields are 'name', 'description', 'price', 'dateTime', 'maxAmountOfParticipants' ,'imageUrl', 'isActive', 'isVega', 'isVegan', 'isToTakeHome' and 'allergenes'").to.be.false;
        
        assert(req.body.name, 'Missing or incorrect name field')
        chai.expect(req.body.name).to.not.be.empty
        chai.expect(req.body.name).to.be.a('string')
        
        assert(req.body.description, 'Missing or incorrect description field')
        chai.expect(req.body.description).to.not.be.empty
        chai.expect(req.body.description).to.be.a('string')

        assert(req.body.price, 'Missing or incorrect price field')
        chai.expect(req.body.price).to.be.a('number')
        
        assert(req.body.dateTime, 'Missing or incorrect dateTime field')
        chai.expect(req.body.dateTime).to.not.be.empty
        chai.expect(req.body.dateTime).to.be.a('string')

        assert(req.body.maxAmountOfParticipants, 'Missing or incorrect maxAmountOfParticipants field')
        chai.expect(req.body.maxAmountOfParticipants).to.be.a('number')

        assert(req.body.imageUrl, 'Missing or incorrect imageUrl field')
        chai.expect(req.body.imageUrl).to.not.be.empty
        chai.expect(req.body.imageUrl).to.be.a('string')


        if(req.body.isActive){
            chai.expect(req.body.isActive).to.be.a('boolean')
        }

        if(req.body.isVega){
            chai.expect(req.body.isVega).to.be.a('boolean')
        }

        if(req.body.isVegan){
            chai.expect(req.body.isVegan).to.be.a('boolean')
        }

        if(req.body.isToTakeHome){
            chai.expect(req.body.isToTakeHome).to.be.a('boolean')
        }

        if(req.body.allergenes){
            chai.expect(req.body.allergenes).to.be.a('array')

            const allergenes = req.body.allergenes
            const expectedAllergenes = ['gluten', 'lactose', 'noten']
            const hasExpectedAllergenes = allergenes.every(x => x === expectedAllergenes[0] || x === expectedAllergenes[1] || x === expectedAllergenes[2]);
            chai.expect(hasExpectedAllergenes, "Accepteble allergenes are 'gluten', 'lactose' and 'noten'").to.be.true;
        }
        
        next()
    } catch (ex) {
        return res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Mealroutes
router.post('/meal', validateToken, validateMealCreateChaiExpect, mealController.create)
router.get('/meal', mealController.getAll)
router.get('/meal/:mealId', mealController.getById)
router.delete('/meal/:mealId', validateToken, mealController.delete)


module.exports = router