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

connection.query("SET FOREIGN_KEY_CHECKS=0"); // TODO: disabled key checks

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
            const response = await new Promise((resolve, reject) => {
                let query = "";
                query += `SELECT *\n`;
                query += `FROM ${table}\n`;
                query += `ORDER BY ${table}ID DESC`;

                connection.query(query, (err, results) => 
                {
                    if(err) {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                });
            });

            return response;

        } catch(error){
            console.log(error);
        }
    }

    async getFilteredRecords(table, body) {
        try {
            const response = await new Promise((resolve, reject) =>
            {
                // const query = `SELECT * FROM ${table} WHERE Validation = ${body.validated} AND DATE(DocumentDate) BETWEEN ${body.start} AND ${body.end}`;

                let query = ``;
                query += `SELECT *\n`;
                query += `FROM ${table}\n`;
                // query += `WHERE Validation = ${body.validated} AND\n`;
                query += `WHERE DATE(EndDate) BETWEEN\n`;
                query += `'${body.start}' AND\n`;
                query += `'${body.end}'`;

                connection.query(query, (err, results) => 
                {
                    if(err) {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                });
            });

            return response;

        } catch(error){
            console.log(error);
        }
    }

    async getUser(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM User WHERE Username = '${username}'`
                connection.query(query, (err, results) => {
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

            body = await new Promise((resolve, reject) =>
            {
                const query = `INSERT INTO ${table} (${Object.keys(body)}) VALUES (${spreadQuestionmarks(Object.keys(body).length)})`;

                connection.query(query, Object.values(body), (err, result) => 
                {
                    if(err) reject(new Error(err.message));
                    resolve(Object.assign({insertId : result.insertId}, body));
                });
            });

            return body;

        } catch(error) {
            console.log(error);
        }
    }

    async update(table, record_id, body) {
        
        try { 

            body = await new Promise((resolve, reject) =>
            {
                const query = `UPDATE ${table} SET ? WHERE ${table}ID = ?`;
                connection.query(query, [body, record_id], (err, result) => 
                {
                    if(err) reject(new Error(err.message));
                    resolve(Object.assign({insertId : record_id}, body));
                });
            });

            return body;

        } catch(error) {
            console.log(error);
        }
    }

    async retrieve(table, rowId) {

        try {
            const response = await new Promise((resolve, reject) =>
            {
                const query = `SELECT * FROM ${table} WHERE ${table}ID = ${rowId}`;

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

    async deleteRowById(info) {
        let id = parseInt(info.id, 10);
        try {
            const response = await new Promise((resolve, reject) =>
            {
                const query = `DELETE FROM ${info.table} WHERE ${info.table}ID = ?`;
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

    async deleteMiddleById(params) {

        const { table, parent, parentValue, child, childValue } = params;

        try {
            const response = await new Promise((resolve, reject) =>
            {
                const query = `DELETE FROM ${table} WHERE ${parent} = ${parentValue} AND ${child} = ${childValue}`;
    
                connection.query(query, (err, result) => 
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

    async getRecordClauses(RecordId) {

        try {
            const response = await new Promise((resolve, reject) =>
            {
                const query = `SELECT ClauseID, Number, Body, Performers, ExpirationDate, ReportID FROM Clause WHERE ClauseID IN (SELECT ClauseID FROM RecordClause WHERE RecordID = ${RecordId})`

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

    async getRecordFiles(RecordId) {
        try {
            const response = await new Promise((resolve, reject) =>
            {
                const query = `SELECT FileID, Name, Path, Type FROM File WHERE FileID IN (SELECT FileID FROM RecordFile WHERE RecordID = ${RecordId})`

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

    async getRecordOwners(RecordId) {

        try {
            const response = await new Promise((resolve, reject) =>
            {
                const query = `SELECT UserID, Fullname, Email, Position FROM User WHERE UserID IN (SELECT UserID FROM RecordOwner WHERE RecordID = ${RecordId})`

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
};

module.exports = dbService;