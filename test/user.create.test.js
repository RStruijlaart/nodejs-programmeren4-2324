const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC201 Registreren als nieuwe user', () => {
    /**
     * Voorbeeld van een beforeEach functie.
     * Hiermee kun je code hergebruiken of initialiseren.
     */
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    /**
     * Hier starten de testcases
     */
    it('TC-201-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                // firstName: 'Voornaam', ontbreekt
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
            
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Missing or incorrect firstName field')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-2 Niet-valide email adres', (done) => {

        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'v.aserver.nl', //incorrect
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
                    .equals("Invalid emailAdress: expected 'v.aserver.nl' to match /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$/")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-3 Niet-valide password', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl',
                password: 'wachtwoord', //incorrect
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
                    .equals("Invalid password: expected 'wachtwoord' to match /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-4 Gebruiker bestaat al', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Hendrik',
                lastName: 'van Dam',
                emailAdress: 'hvd@server.nl',
                password: 'Secred83',
                isActive: true,
                street: 'oosthof 4',
                city: 'kloosterzande',
                phoneNumber: '06-12345678',
                roles: []
            })
            .end((err, res) => {
                
                chai.expect(res).to.have.status(409)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(409)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals("Email adress already in use")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
        chai.request(server)
            .post(endpointToTest)
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
                res.should.have.status(201)
                res.body.should.be.a('object')

                res.body.should.have.property('data').that.is.a('object')
                res.body.should.have.property('message').that.is.a('string')

                const data = res.body.data
                data.should.have.property('firstName').equals('Voornaam')
                data.should.have.property('lastName').equals('Achternaam')
                data.should.have.property('emailAdress').equals('v.a@server.nl')
                data.should.have.property('password').equals('Wachtwoord3')
                data.should.have.property('isActive').equals(true)
                data.should.have.property('street').equals('straat')
                data.should.have.property('city').equals('stad')
                data.should.have.property('phoneNumber').equals('06-12345678')
                data.should.have.property('roles')
                data.should.have.property('id').that.is.a('number')

                done()
            })
    })
})
