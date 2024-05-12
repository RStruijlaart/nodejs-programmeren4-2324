const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const validateToken = require('./authentication.routes.js').validateToken

// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

const validateUserCreateChaiExpect = (req, res, next) => {
    try {
        assert(req.body.firstName, 'Missing or incorrect firstName field')
        chai.expect(req.body.firstName).to.not.be.empty
        chai.expect(req.body.firstName).to.be.a('string')
        chai.expect(req.body.firstName).to.match(
            /^[a-zA-Z]+$/,
            'Invalid firstName'
        )

        assert(req.body.lastName, 'Missing or incorrect lastName field')
        chai.expect(req.body.lastName).to.not.be.empty
        chai.expect(req.body.lastName).to.be.a('string')
        chai.expect(req.body.lastName).to.match(
            /^[a-zA-Z\s]+$/,
            'Invalid lastName'
        )

        assert(req.body.emailAdress, 'Missing or incorrect emailAdress field')
        chai.expect(req.body.emailAdress).to.not.be.empty
        chai.expect(req.body.emailAdress).to.be.a('string')
        chai.expect(req.body.emailAdress).to.match(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/,
            'Invalid emailAdress'
        )

        assert(req.body.password, 'Missing or incorrect password field')
        chai.expect(req.body.password).to.not.be.empty
        chai.expect(req.body.password).to.be.a('string')
        chai.expect(req.body.password).to.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            'Invalid password'
        )
        
        if (req.body.isActive) {
            chai.expect(req.body.isActive).to.be.a('boolean')
        }

        assert(req.body.street, 'Missing or incorrect street field')
        chai.expect(req.body.street).to.not.be.empty
        chai.expect(req.body.street).to.be.a('string')
        chai.expect(req.body.street).to.match(
            /^[a-zA-Z0-9\s]+$/,
            'Invalid street'
        )
        
        assert(req.body.city, 'Missing or incorrect city field')
        chai.expect(req.body.city).to.not.be.empty
        chai.expect(req.body.city).to.be.a('string')
        chai.expect(req.body.city).to.match(
            /^[a-zA-Z\s]+$/,
            'Invalid city'
        )

        assert(req.body.phoneNumber, 'Missing or incorrect phoneNumber field')
        chai.expect(req.body.phoneNumber).to.not.be.empty
        chai.expect(req.body.phoneNumber).to.be.a('string')
        chai.expect(req.body.phoneNumber).to.match(
            /^06[-\s]?\d{8}$/,
            'Invalid phoneNumber'
        )

        assert(req.body.roles, 'Missing or incorrect roles field')
        chai.expect(req.body.roles).to.be.a('array')
        chai.expect(req.body.roles, 'Expected roles not to be empty').to.not.be.empty;

        const roles = req.body.roles
        
        const expectedRoles = ['editor', 'guest', 'admin']
        const hasExpectedRoles = roles.every(x => x === expectedRoles[0] || x === expectedRoles[1] || x === expectedRoles[2]);
        chai.expect(hasExpectedRoles, "Accepteble roles are 'editor', 'guest' and 'admin'").to.be.true;
        
        
        next()
    } catch (ex) {
        return res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Userroutes
router.post('/user', validateUserCreateChaiExpect, userController.create)
router.get('/user', userController.getAll)
router.get('/user/profile', validateToken, userController.getProfile)
router.get('/user?:field1', userController.getAll)
router.get('/user?:field1&:field2', userController.getAll)
router.get('/user/:userId', validateToken, userController.getById)
router.put('/user/:userId', validateToken, validateUserCreateChaiExpect, userController.update)
router.delete('/user/:userId', validateToken, userController.delete)

module.exports = router