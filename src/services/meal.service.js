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
    }
}

module.exports = mealService
