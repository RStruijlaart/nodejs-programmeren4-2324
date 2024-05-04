const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC205 Updaten van usergegevens', () => {

    it('TC-205-1 Verplicht veld “emailAddress” ontbreek', (done) => {
        chai.request(server)
            .put(endpointToTest + '/1')
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                //emailAdress: 'v.a@server.nl',
                password: 'Wachtwoord3',
                isActive: true,
                street: 'straat',
                city: 'stad',
                phoneNumber: '06-12345678',
                roles: []
            })
            .end((err, res) => {
            
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Missing or incorrect emailAdress field')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-205-3 Niet-valide telefoonnummer', (done) => {
        chai.request(server)
            .put(endpointToTest + '/1')
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl',
                password: 'Wachtwoord3',
                isActive: true,
                street: 'straat',
                city: 'stad',
                phoneNumber: '3112345678', //incorrect
                roles: []
            })
            .end((err, res) => {
                
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals("Invalid phoneNumber: expected '3112345678' to match /^06[-\\s]?\\d{8}$/")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-205-4 Gebruiker-ID bestaat niet', (done) => {
        chai.request(server)
            .put(endpointToTest + '/-1')
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl',
                password: 'Wachtwoord3',
                isActive: true,
                street: 'straat',
                city: 'stad',
                phoneNumber: '06-12345678',
                roles: []
            })
            .end((err, res) => {
            
                chai.expect(res).to.have.status(404)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(404)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Error: id -1 does not exist!')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })
})
