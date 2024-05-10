const logger = require('../util/logger')
const db = require('../dao/mysql-db')

const mealService = {
    create: (cookId, meal, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            mealWithCookId = {...meal, cookId};
            
            let sql = 'INSERT INTO meal (';
            
            // Add column names
            const columns = Object.keys(mealWithCookId).join(',');
            sql += columns + ') VALUES (';
            
            // Add values
            const values = Object.values(mealWithCookId).map(val => {
                // Convert array to string if allergenes
                if (Array.isArray(val)) {
                  return connection.escape(val.toString());
                } else {
                  return connection.escape(val);
                }
              }).join(',');


            sql += values + ')';
            
            console.log(sql);
          
            connection.query(
                sql,
                function (error, results, fields) {

                    if (error) {
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {
                        callback(null, {
                            message: `Meal created with id ${results.insertId}`,
                            data: meal,
                            status: 201
                        })
                    }
                }
            )
        })
    },

    getAll: (callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                `SELECT * FROM \`meal\``,
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {
                        logger.debug(results)

                        results.forEach((obj) => {
                            if(obj.allergenes.length > 0){
                                obj.allergenes = obj.allergenes.split(",");
                            }else{
                                obj.allergenes = [];
                            }
                        })

                        callback(null, {
                            message: `Found ${results.length} meals.`,
                            data: results,
                            status: 200
                        })
                    }
                }
            )
        })
    },

    getById: (mealId, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `meal` WHERE `id` = ' + mealId,
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        console.log(error)
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {

                        if(results.length < 1){
                            callback({ message: `Error: id ${mealId} does not exist!`, status: 404}, null)
                        }else{

                            if(results[0].allergenes.length > 0){
                                results[0].allergenes = results[0].allergenes.split(",");
                            }else{
                                results[0].allergenes = [];
                            }

                            callback(null, {
                                message: `Found meal with id ${mealId}.`,
                                data: results[0],
                                status: 200
                            })
                        }
            
                        
                    }
                }
            )
        })
    },

    delete: (profileId, mealId, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
          
            connection.query(
                'SELECT id FROM `meal` WHERE `id` = ' + mealId,
                function (error, results, fields) {

                    if (error) {
                        callback({message: error.sqlMessage, status: 500, data: {}}, null)
                    } else {

                        if(results.length < 1){
                            callback({ message: `Error: id ${mealId} does not exist!`, status: 404}, null)
                            return
                        }

                        connection.query(
                            'SELECT cookId FROM `meal` WHERE `id` = ' + mealId,
                            function (profileError, profileResults, profileFields) {
                                connection.release()
            
                                if (profileError) {
                                    callback({message: deleteError.sqlMessage, status: 500, data: {}}, null)
                                } else {

                                    if(profileId != profileResults[0].cookId){
                                        callback({message: 'can\'t delete someone else\'s data', status: 403, data: {}}, null)
                                        return
                                    }

                                    connection.query(
                                        `DELETE FROM \`meal\` WHERE \`id\` = ` + mealId,
                                        function (deleteError, deleteResults, deleteFields) {
                                            connection.release()
                        
                                            if (deleteError) {
                                                callback({message: deleteError.sqlMessage, status: 500, data: {}}, null)
                                            } else {
                                                callback(null, {
                                                    message: `Meal with id ${mealId} has been deleted`,
                                                    data: {},
                                                    status: 200
                                                })
                                                
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                }
            )
        })
    }
}

module.exports = mealService
