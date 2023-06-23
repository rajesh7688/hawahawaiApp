const mysql = require('mysql2');

const config = {
    user: 'umg3v7e23v8dhdzx',
    password: 'UyMDigSkai47blsWhOj6',
    database: 'byd38mnmeuydkemyqrbb',
    host: 'byd38mnmeuydkemyqrbb-mysql.services.clever-cloud.com',
    port: 3306,
};

const createConnection = () => {
    const connection = mysql.createConnection(config);
    
    const query = sql => {
        return new Promise((resolve, reject) => {
            connection.query(sql, (error, result) => {
                if (error) {
                    reject(error, "reject1");
                } else {
                    resolve(result, "resolve1");
                }
            });
        });
    };

    const end = () => {
        return new Promise((resolve, reject) => {
            connection.end(error => {
                if (error) {
                    reject("reject2");
                } else {
                    resolve("resolve2");
                }
            })
        });
    };

    return new Promise((resolve, reject) => {
        connection.connect(error => {
            if (error) {
                reject(error, "reject3");
            } else {
                resolve({ query, end }, "resolve3");
            }
        });
    })
};

module.exports = {
    createConnection
};