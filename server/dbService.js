const mysql = require("mysql2");
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    connectionLimit: process.env.DB_LIMIT
});

// TODO: add check if connection was created successfully

function spreadQuestionmarks(count) {

    let output = "";

    for(let i = 0; i < count; i++) {

        if(i !== 0)
            output += ", ?";
        else
            output += "?";
    }

    return output;
}

class dbService {
    static getDbServiceInstance()
    {
        return instance ? instance : new dbService();
    }

    async getTableData(table) {

        try {
            const response = await new Promise((resolve, reject) =>
            {
                const query = `SELECT * FROM ${table}`;

                connection.query(query, (err, results) => 
                {
                    if(err) {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                });
            });

            return response;

        }catch(error){
            console.log(error);
        }
    }

    async insert(table, body) {
        
        try { 

            const insertId = await new Promise((resolve, reject) =>
            {
                const query = `INSERT INTO ${table} (${Object.keys(body)}) VALUES (${spreadQuestionmarks(Object.keys(body).length)})`;

                connection.query(query, Object.values(body), (err, result) => 
                {
                    if(err) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            });
            
            Object.assign({id : insertId}, body);

            return body;

        } catch(error) {
            console.log(error);
        }
    }

    async deleteRowById(info) {
        let id = parseInt(info.id, 10);

        try {
            const response = await new Promise((resolve, reject) =>
            {
                const query = `DELETE FROM ${info.table} WHERE ${info.keyName} = ?`;
    
                connection.query(query, [id], (err, result) => 
                {
                    if(err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

};

module.exports = dbService;