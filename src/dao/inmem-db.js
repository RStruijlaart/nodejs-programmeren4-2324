//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const database = {
    // het array met dummy records. Dit is de 'database'.
    _data: [
        {
            id: 0,
            firstName: 'Hendrik',
            lastName: 'van Dam',
            emailAdress: 'hvd@server.nl',
            password: 'Secred8',
            isActive: true,
            street: 'oosthof 4',
            city: 'kloosterzande',
            phoneNumber: '06-12345678',
            roles: []
        },
        {
            id: 1,
            firstName: 'Marieke',
            lastName: 'Jansen',
            emailAdress: 'm@server.nl',
            password: 'Secred8',
            isActive: false,
            street: 'oosthof 4',
            city: 'kloosterzande',
            phoneNumber: '06-12345678',
            roles: []
        }
    ],

    // Ieder nieuw item in db krijgt 'autoincrement' index.
    // Je moet die wel zelf toevoegen aan ieder nieuw item.
    _index: 2,
    _delayTime: 500,

    getAll(filterFields, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {

            if(Object.keys(filterFields).length === 0){
                callback(null, this._data)
            }else{
                console.log(filterFields)
                const objFields = ['firstName', 'lastName', 'emailAdress', 'isActive', 'street', 'city', 'phoneNumber'];

                for (let field in filterFields) {
                    if(objFields.includes(field) === false){
                        callback({ message: `Error: field ${field} does not exist or can't be filterd!`, status: 200, data: this._data}, null)
                        return
                    }
                }

                const filterdData = this._data.filter((obj => {
                    return Object.keys(filterFields).every(field => obj[field].toString() === filterFields[field]);
                }));

                callback(null, filterdData)
            }

        }, this._delayTime)
    },

    getById(id, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            if (id < 0 || id >= this._data.length) {
                callback({ message: `Error: id ${id} does not exist!`, status: 404}, null)
            } else {
                callback(null, this._data[id])
            }
        }, this._delayTime)
    },

    add(item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {

            const emailExists = this._data.some(obj => obj.emailAdress === item.emailAdress);

            if(emailExists){
                callback({ message: `Email adress already in use`, status: 403}, null)
            }else{
                // Voeg een id toe en voeg het item toe aan de database
                item.id = this._index++
                // Voeg item toe aan de array
                this._data.push(item)

                // Roep de callback aan het einde van de operatie
                // met het toegevoegde item als argument, of null als er een fout is opgetreden
                callback(null, item)
            }
        }, this._delayTime)
    },

    update(id, item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            if (id < 0 || id >= this._data.length) {
                callback({ message: `Error: id ${id} does not exist!`, status: 404}, null)
            } else {
                
                for (let field in this._data[id]) {
                    if(field !== 'id'){
                        this._data[id][field] = item[field];
                    }
                }

                callback(null, this._data[id])
                console.log(this._data[id])
            }
        }, this._delayTime)
    },

    delete(id, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            if (id < 0 || id >= this._data.length) {
                callback({ message: `Error: id ${id} does not exist!`, status: 404}, null)
            } else {

                const indexToDelete = this._data.findIndex(obj => obj.id === parseInt(id));
                this._data.splice(indexToDelete, 1);

                callback(null, null)
            }
        }, this._delayTime)
    }
}

module.exports = database
// module.exports = database.index;
