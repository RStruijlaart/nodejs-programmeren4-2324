const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC202 Opvragen van overzicht van users', () => {

    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => {
        chai.request(server)
            .get(endpointToTest)
            .end((err, res) => {
            
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Found 2 users.')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('array').that.is.not.empty

                done()
            })
    })

    it('TC-202-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {

        chai.request(server)
            .get(endpointToTest + '?veld1=error') //dit veld bestaan niet
            .end((err, res) => {
                
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals("Error: field veld1 does not exist or can't be filterd!")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('array').that.is.not.empty

                done()
            })
    }),

    it('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=false', (done) => {

        chai.request(server)
            .get(endpointToTest + '?isActive=false')
            .end((err, res) => {
                
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals("Found 1 users.")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('array').that.is.not.empty

                done()
            })
    }),
    
    it('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=true', (done) => {

        chai.request(server)
            .get(endpointToTest + '?isActive=true')
            .end((err, res) => {
                
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals("Found 1 users.")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('array').that.is.not.empty

                done()
            })
    }),

    it('TC-202-5 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {

        chai.request(server)
            .get(endpointToTest + '?isActive=true&city=kloosterzande')
            .end((err, res) => {
                
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals("Found 1 users.")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('array').that.is.not.empty

                done()
            })
    })
})
