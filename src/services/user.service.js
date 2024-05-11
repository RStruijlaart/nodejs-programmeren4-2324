const logger = require('../util/logger')
const db = require('../dao/mysql-db')

const userService = {
    create: (user, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
          
            connection.query(
                'SELECT emailAdress FROM `user`',
                function (error, results, fields) {

                    if (error) {
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {
                        const emailExists = results.some(obj => obj.emailAdress === user.emailAdress);
                        console.log(results)
                        if(emailExists){
                            callback({ message: `Email adress already in use`, status: 403}, null)
                        }else{
                            
                            let insertQuery = `INSERT INTO \`user\` (firstName, lastName, emailAdress, password, phoneNumber, roles, street, city) VALUES ('${user.firstName}', '${user.lastName}', '${user.emailAdress}', '${user.password}', '${user.phoneNumber}', '${user.roles.toString()}', '${user.street}', '${user.city}' )`;
                            if(Object.keys(user).includes('isActive')){
                                insertQuery = `INSERT INTO \`user\` (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES ('${user.firstName}', '${user.lastName}', ${user.isActive}, '${user.emailAdress}', '${user.password}', '${user.phoneNumber}', '${user.roles.toString()}', '${user.street}', '${user.city}' )`;
                            }

                            connection.query(
                                insertQuery,
                                function (insertError, insertResults, insertFields) {
                                    connection.release()
                
                                    if (insertError) {
                                        callback({message: insertError.sqlMessage, status: 500, data: {}}, null)
                                    } else {
                                        console.log(insertQuery)
                                        callback(null, {
                                            message: `User created with id ${insertResults.insertId}`,
                                            data: user,
                                            status: 201
                                        })
                                    }
                                }
                            )
                        }
                    }
                }
            )
        })
    },

    getAll: (filterFields, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            let query = 'SELECT * FROM `user`';

            const acceptedFilterFields = ['firstName', 'lastName', 'isActive', 'emailAdress', 'phoneNumber', 'street', 'city' ]

            if(Object.keys(filterFields)[0]){

                let field1Key = Object.keys(filterFields)[0];
                let field1Value = filterFields[Object.keys(filterFields)[0]];
                
                if(!acceptedFilterFields.includes(field1Key)){
                    callback({message: `Error: field ${field1Key} does not exist or can't be filterd!`, status: 200, data: {}}, null)
                    return
                }

                if(field1Value === 'true'){
                    field1Value = 1; 
                }else if(field1Value === 'false'){
                    field1Value = 0; 
                }

                query = 'SELECT * FROM `user` WHERE `' + field1Key + '` = \'' + field1Value + '\''

                if(Object.keys(filterFields)[1]){
                    let field2Key = Object.keys(filterFields)[1];
                    let field2Value = filterFields[Object.keys(filterFields)[1]];

                    if(!acceptedFilterFields.includes(field2Key)){
                        callback({message: `Error: field ${field2Key} does not exist or can't be filterd!`, status: 200, data: {}}, null)
                        return
                    }

                    if(field2Value === 'true'){
                        field2Value = 1; 
                    }else if(field2Value === 'false'){
                        field2Value = 0; 
                    }
                    query = 'SELECT * FROM `user` WHERE `' + field1Key + '` = \'' + field1Value + '\' AND `' + field2Key + '` = \'' + field2Value + '\''
                }
            }
          
            connection.query(
                query,
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {
                        logger.debug(results)

                        results.forEach((obj) => {
                            if(obj.roles.length > 0){
                                obj.roles = obj.roles.split(",");
                            }else{
                                obj.roles = [];
                            }
                        })

                        callback(null, {
                            message: `Found ${results.length} users.`,
                            data: results,
                            status: 200
                        })
                    }
                }
            )
        })
    },

    getById: (userId, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `user` WHERE `id` = ' + userId,
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        console.log(error)
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {

                        if(results.length < 1){
                            callback({ message: `Error: id ${userId} does not exist!`, status: 404}, null)
                        }else{

                            if(results[0].roles.length > 0){
                                results[0].roles = results[0].roles.split(",");
                            }else{
                                results[0].roles = [];
                            }

                            callback(null, {
                                message: `Found user with id ${userId}.`,
                                data: results[0],
                                status: 200
                            })
                        }
            
                        
                    }
                }
            )
        })
    },

    update: (profileId, userId, user, callback) => {

        if(profileId != userId){
            callback({message: 'can\'t update someone else\'s data', status: 403, data: {}}, null)
            return
        }

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
          
            connection.query(
                'SELECT id FROM `user` WHERE `id` = ' + userId,
                function (error, results, fields) {

                    if (error) {
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {

                        if(results.length < 1){
                            callback({ message: `Error: id ${userId} does not exist!`, status: 404}, null)
                            return
                        }
                      
                        let insertQuery = `UPDATE \`user\` SET firstName = '${user.firstName}', lastName = '${user.lastName}', emailAdress = '${user.emailAdress}', password = '${user.password}', phoneNumber = '${user.phoneNumber}', roles = '${user.roles.toString()}', street = '${user.street}', city = '${user.city}' WHERE \`id\` = ${userId}`;
                        
                        if(Object.keys(user).includes('isActive')){
                            insertQuery = `UPDATE \`user\` SET firstName = '${user.firstName}', lastName = '${user.lastName}', isActive = ${user.isActive}, emailAdress = '${user.emailAdress}', password = '${user.password}', phoneNumber = '${user.phoneNumber}', roles = '${user.roles.toString()}', street = '${user.street}', city = '${user.city}' WHERE \`id\` = ${userId}`;
                        }
                        connection.query(
                            insertQuery,
                            function (updateError, updateResults, updateFields) {
                                connection.release()
            
                                if (updateError) {
                                    callback({message: updateError.sqlMessage, status: 500, data: {}}, null)
                                } else {
                                    callback(null, {
                                        message: `Updated user with id ${userId}`,
                                        data: user,
                                        status: 200
                                    })
                                }
                            }
                        )
                    }
                }
            )
        })
    },

    delete: (profileId, userId, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
          
            connection.query(
                'SELECT id FROM `user` WHERE `id` = ' + userId,
                function (error, results, fields) {

                    if (error) {
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {

                        if(results.length < 1){
                            callback({ message: `Error: id ${userId} does not exist!`, status: 404}, null)
                            return
                        }

                        if(profileId != userId){
                            callback({message: 'can\'t delete someone else\'s data', status: 403, data: {}}, null)
                            return
                        }
                        
                        deleteMealParticipantsSql = `DELETE FROM \`meal_participants_user\` WHERE \`mealId\` in (SELECT id FROM \`meal\` WHERE cookId = ${userId});`
                        deleteMealsSql = `DELETE FROM \`meal\` WHERE \`cookId\` = ${userId};`;
                        deleteUserSql = `DELETE FROM \`user\` WHERE \`id\` = ${userId};`;
                      
                        connection.query(
                            deleteMealParticipantsSql + deleteMealsSql + deleteUserSql,
                            function (deleteError, deleteResults, deleteFields) {
                                connection.release()
            
                                if (deleteError) {
                                    callback({message: deleteError.sqlMessage, status: 500, data: {}}, null)
                                } else {
                                    callback(null, {
                                        message: `User with id ${userId} has been deleted`,
                                        data: {},
                                        status: 200
                                    })
                                    
                                }
                            }
                        )
                    }
                }
            )
        })
    },

    getProfile: (userId, callback) => {
        logger.info('getProfile userId:', userId)

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT id, firstName, lastName FROM `user` WHERE id = ?',
                [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} user.`,
                            data: results
                        })
                    }
                }
            )
        })
    }
}

module.exports = userService
