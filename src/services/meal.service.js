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
                        logger.error(error.sqlMessage);
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
    
                    if (error) {
                        connection.release();
                        callback({message: error.sqlMessage, status: 500, data: {}}, null);
                        return;
                    }
    
                    const promises = results.map((obj) => {
                        return new Promise((resolve, reject) => {
                            if(obj.allergenes.length > 0){
                                obj.allergenes = obj.allergenes.split(",");
                            } else {
                                obj.allergenes = [];
                            }
    
                            connection.query(
                                'SELECT * FROM `user` WHERE `id` = ' + obj.cookId,
                                function (userError, userResults, userFields) {
                                    
                                    if (userError) {
                                        connection.release();
                                        reject({message: userError.sqlMessage, status: 500, data: {}});
                                        return;
                                    }
    
                                    let cook;
                                    
                                    if(userResults.length < 1){
                                        cook = "unknown";
                                    } else {
                                        userResults.forEach((obj) => {
                                            if(obj.roles.length > 0){
                                                obj.roles = obj.roles.split(",");
                                            } else {
                                                obj.roles = [];
                                            }
                                        });
    
                                        cook = userResults[0];
                                        delete cook.password;
                                    }
    
                                    connection.query(
                                        `SELECT * FROM \`user\` WHERE id IN (SELECT userId FROM \`meal_participants_user\` WHERE mealId = ${obj.id})`,
                                        function (participantsError, participantsResults, participantsFields) {
                                            
                                            if (participantsError) {
                                                connection.release();
                                                reject({message: participantsError.sqlMessage, status: 500, data: {}});
                                                return;
                                            }
    
                                            let participants;
                                            if(participantsResults.length < 1){
                                                participants = "unknown";
                                            } else {
                                                participantsResults.forEach((obj) => {
                                                    if(obj.roles.length > 0){
                                                        obj.roles = obj.roles.split(",");
                                                    } else {
                                                        obj.roles = [];
                                                    }
                                                    delete obj.password;
                                                });
                                                participants = participantsResults;
                                            }
    
                                            const meal = {...obj, cook, participants};
                                            resolve(meal);
                                        }
                                    );
                                }
                            );
                        });
                    });
    
                    Promise.all(promises)
                        .then((modifiedResults) => {
                            connection.release();
                            callback(null, {
                                message: `Found ${modifiedResults.length} meals.`,
                                data: modifiedResults,
                                status: 200
                            });
                        })
                        .catch((err) => {
                            connection.release();
                            callback(err, null);
                        });
                }
            );
        });
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
                            
                            connection.query(
                                'SELECT * FROM `user` WHERE `id` = ' + results[0].cookId,
                                function (userError, userResults, userFields) {
                                    connection.release()
                
                                    if (userError) {
                                        console.log(userError)
                                        callback({message: userError.sqlMessage, status: 500, data: {}}, null)
                                    } else {
                
                                        let cook;
                                        
                                        if(userResults.length < 1){
                                            cook = "unknown";
                                        }else{
                
                                            if(userResults[0].roles.length > 0){
                                                userResults[0].roles = results[0].roles.split(",");
                                            }else{
                                                userResults[0].roles = [];
                                            }  

                                            cook = userResults[0];

                                            delete cook.password;
                                        }
                                        
                                        connection.query(
                                            `SELECT * FROM \`user\` WHERE id IN (SELECT userId FROM \`meal_participants_user\` WHERE mealId = ${mealId})`,
                                            function (participantsError, participantsResults, participantsFields) {
                                                connection.release()
                            
                                                if (participantsError) {
                                                    console.log(participantsError)
                                                    callback({message: participantsError.sqlMessage, status: 500, data: {}}, null)
                                                } else {

                                                    let participants;
                            
                                                    if(participantsResults.length < 1){
                                                        participants = "unknown"
                                                    }else{
                            
                                                        participantsResults.forEach((obj) => {
                                                            if(obj.roles.length > 0){
                                                                obj.roles = obj.roles.split(",");
                                                            }else{
                                                                obj.roles = [];
                                                            }
                                                        })

                                                        participantsResults.forEach((obj) => {
                                                            delete obj.password
                                                        })

                                                        participants = participantsResults;
                                                    }

                                                    const meal = {...results[0], cook, participants}

                                                    console.log(meal);
        
                                                    callback(null, {
                                                        message: `Found meal with id ${mealId}.`,
                                                        data: meal,
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
