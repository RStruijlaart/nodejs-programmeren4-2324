const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC206 Verwijderen van user', () => {

    it('TC-206-1 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .delete(endpointToTest + '/-1')
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

    it('TC-206-4 Gebruiker succesvol verwijdert', (done) => {
        chai.request(server)
            .delete(endpointToTest + '/2')
            .end((err, res) => {
            
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('User with id 2 has been deleted')
                chai
                    .expect(res.body)
                    .to.have.property('data').that.is.null

                done()
            })
    })
})
