const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')
const db = require('../src/dao/mysql-db')
const logger = require('../src/util/logger')
const jwtSecretKey = require('../src/util/config').secretkey
const jwt = require('jsonwebtoken')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/meal'

const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE

const INSERT_USERS = `INSERT INTO \`user\` VALUES 
(1,'Mariëtte','van den Dullemen',1,'m.vandullemen@server.nl','secret','','','',''),
(2,'John','Doe',1,'j.doe@server.com','secret','06 12425475','editor,guest','',''),
(3,'Herman','Huizinga',1,'h.huizinga@server.nl','secret','06-12345678','editor,guest','',''),
(4,'Marieke','Van Dam',0,'m.vandam@server.nl','secret','06-12345678','editor,guest','',''),
(5,'Henk','Tank',1,'h.tank@server.com','secret','06 12425495','editor,guest','','');`

const INSERT_MEALS = `INSERT INTO \`meal\` VALUES 
(1,1,0,0,1,'2022-03-22 17:35:00',4,12.75,'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',1,'2022-02-26 18:12:40.048998','2022-04-26 12:33:51.000000','Pasta Bolognese met tomaat, spekjes en kaas','Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!','gluten,lactose'),
(2,1,1,0,0,'2022-05-22 13:35:00',4,12.75,'https://static.ah.nl/static/recepten/img_RAM_PRD159322_1024x748_JPG.jpg',2,'2022-02-26 18:12:40.048998','2022-04-25 12:56:05.000000','Aubergine uit de oven met feta, muntrijst en tomatensaus','Door aubergines in de oven te roosteren worden ze heerlijk zacht. De balsamico maakt ze heerlijk zoet.','noten'),
(3,1,0,0,1,'2022-05-22 17:30:00',4,10.75,'https://static.ah.nl/static/recepten/img_099918_1024x748_JPG.jpg',2,'2022-02-26 18:12:40.048998','2022-03-15 14:10:19.000000','Spaghetti met tapenadekip uit de oven en frisse salade','Perfect voor doordeweeks, maar ook voor gasten tijdens een feestelijk avondje.','gluten,lactose'),
(4,1,0,0,0,'2022-03-26 21:22:26',4,4.00,'https://static.ah.nl/static/recepten/img_063387_890x594_JPG.jpg',3,'2022-03-06 21:23:45.419085','2022-03-12 19:51:57.000000','Zuurkool met spekjes','Heerlijke zuurkoolschotel, dé winterkost bij uitstek. ',''),
(5,1,1,0,1,'2022-03-26 21:24:46',6,6.75,'https://www.kikkoman.nl/fileadmin/_processed_/5/7/csm_WEB_Bonte_groenteschotel_6851203953.jpg',3,'2022-03-06 21:26:33.048938','2022-03-12 19:50:13.000000','Groentenschotel uit de oven','Misschien wel de lekkerste schotel uit de oven! En vol vitaminen! Dat wordt smikkelen. Als je van groenten houdt ben je van harte welkom. Wel eerst even aanmelden.','');`

const INSERT_PARTICIPANTS = `INSERT INTO \`meal_participants_user\` VALUES (1,2),(1,3),(1,5),(2,4),(3,3),(3,4),(4,2),(5,4);`

describe('UC-301 Toevoegen van maaltijd', () => {

    beforeEach((done) => {
        
        // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
        db.getConnection(function (err, connection) {
            if (err) throw err // not connected!

            // Use the connection
            connection.query(
                CLEAR_DB + INSERT_USERS + INSERT_MEALS + INSERT_PARTICIPANTS,
                function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release()

                    // Handle error after the release.
                    if (error) throw error
                    // Let op dat je done() pas aanroept als de query callback eindigt!
                    logger.debug('beforeEach done')
                    done()
                }
            )
        })
    })

    it('TC-301-1 Verplicht veld ontbreekt', (done) => {
        const token = jwt.sign({ userId: 1 }, jwtSecretKey)
        chai.request(server)
            .post(endpointToTest)
            .set('Authorization', 'Bearer ' + token)
            .send({

                //name: 'Spagehetti bolognese',
                description: 'Lekkere spaghetti bolognese',
                price: 10.50,
                dateTime: "2022-03-22 17:35:00",
                maxAmountOfParticipants: 6,
                imageUrl: 'https://www.google.com/search?sca_esv=f42f57a008774f06&rlz=1C1CHBF_enNL887NL887&sxsrf=ADLYWIL97C595p2Q9-_mjlLNsFzAQmzh9A:1715347368240&q=spaghetti+bolognese&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwiRibP0loOGAxVQhP0HHVqaAccQ0pQJegQIDBAB&biw=2560&bih=1313&dpr=1#imgrc=qV0QuJqXqWeLFM',
                allergenes: ["gluten", "lactose"]
                
            })
            .end((err, res) => {
            
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Missing or incorrect name field')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    }),

    it('TC-301-2 Niet ingelogd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                name: 'Spagehetti bolognese',
                description: 'Lekkere spaghetti bolognese',
                price: 10.50,
                dateTime: "2022-03-22 17:35:00",
                maxAmountOfParticipants: 6,
                imageUrl: 'https://www.google.com/search?sca_esv=f42f57a008774f06&rlz=1C1CHBF_enNL887NL887&sxsrf=ADLYWIL97C595p2Q9-_mjlLNsFzAQmzh9A:1715347368240&q=spaghetti+bolognese&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwiRibP0loOGAxVQhP0HHVqaAccQ0pQJegQIDBAB&biw=2560&bih=1313&dpr=1#imgrc=qV0QuJqXqWeLFM',
                allergenes: ["gluten", "lactose"]
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(401)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(401)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Authorization header missing!')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    }),

    it('TC-301-3 Maaltijd succesvol toegevoegd', (done) => {
        const token = jwt.sign({ userId: 1 }, jwtSecretKey)
        const date = new Date()
        chai.request(server)
            .post(endpointToTest)
            .set('Authorization', 'Bearer ' + token)
            .send({

                name: 'Spagehetti bolognese',
                description: 'Lekkere spaghetti bolognese',
                price: 10.50,
                dateTime: date.toJSON(),
                maxAmountOfParticipants: 6,
                imageUrl: 'https://www.google.com/search?sca_esv=f42f57a008774f06&rlz=1C1CHBF_enNL887NL887&sxsrf=ADLYWIL97C595p2Q9-_mjlLNsFzAQmzh9A:1715347368240&q=spaghetti+bolognese&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwiRibP0loOGAxVQhP0HHVqaAccQ0pQJegQIDBAB&biw=2560&bih=1313&dpr=1#imgrc=qV0QuJqXqWeLFM',
                allergenes: ["gluten", "lactose"]
                
            })
            .end((err, res) => {
            
                chai.expect(res).to.have.status(201)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(201)
                chai.expect(res.body).to.have.property('message')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.not.empty

                done()
            })
    })
})
