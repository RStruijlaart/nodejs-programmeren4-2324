const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC204 Opvragen van usergegevens bij ID', () => {
    
    it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
        chai.request(server)
            .get(endpointToTest + '/-1')
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

    it('TC-201-3 Gebruiker-ID bestaat', (done) => {

        chai.request(server)
            .get(endpointToTest + '/1')
            .end((err, res) => {
                
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals("Found user with id 1.")
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.not.empty

                    const data = res.body.data
                    data.should.have.property('firstName')
                    data.should.have.property('lastName')
                    data.should.have.property('emailAdress')
                    data.should.have.property('password')
                    data.should.have.property('isActive')
                    data.should.have.property('street')
                    data.should.have.property('city')
                    data.should.have.property('phoneNumber')
                    data.should.have.property('roles')
                    data.should.have.property('id').that.is.a('number')

                done()
            })
    })
})
