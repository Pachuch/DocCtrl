const dbService = require('./db_service');
const rootDir = __dirname.substring(0, __dirname.length - 12);

const retrieve = (request, response) => {
    const db = dbService.getDbServiceInstance();
 
    const results = db.retrieve(request.query.table, request.query.rowId);
  
    results
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const get_table = (request, response) => {
    const db = dbService.getDbServiceInstance();
    const results = db.getTableData(request.params.id);
    results
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
}

const get_filtered = (request, response) => {
    const db = dbService.getDbServiceInstance();

    const { table, ...body} = request.query;
    const results = db.getFilteredRecords(table, body);
  
    results
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
}

const get_user = (request, response) => {
    const db = dbService.getDbServiceInstance();
 
    const results = db.getUser(request.query.username);
  
    results
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const get_record_clauses = (request, response) => {
    const db = dbService.getDbServiceInstance();
 
    const results = db.getRecordClauses(request.query.RecordId);
  
    results
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const get_record_files = (request, response) => {

    const db = dbService.getDbServiceInstance();
 
    const results = db.getRecordFiles(request.query.RecordId);
  
    results
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const get_record_approvers = (request, response) => {

    const db = dbService.getDbServiceInstance();
 
    const results = db.getRecordApprovers(request.query.RecordId);
  
    results
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const get_record_owners = (request, response) => {
    const db = dbService.getDbServiceInstance();
 
    const results = db.getRecordOwners(request.query.RecordId);
  
    results
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const insert_document_draft = (request, response) => {
    const db = dbService.getDbServiceInstance();

    request.body.Category = "Приказ";
    request.body.Kind = "На практику";
    request.body.ChangeDate = new Date();
    request.body.Status = "Проект";
    const results = db.insert('Record', request.body);
  
    results
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
}

const insert = (request, response) => {
    const db = dbService.getDbServiceInstance();

    const { table, ...body} = request.query;
    const results = db.insert(table, body);
    
    results
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
}

const insert_user = (request, response) => {
    const db = dbService.getDbServiceInstance();
  
    request.body.Access = 'user';
    request.body.RegistrationDate = new Date();
    request.body.Deleted = false;
    
    const results = db.insert('User', request.body);
    
    results
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
}

const update_document = (request, response) => {
    const db = dbService.getDbServiceInstance();

    const results = db.update(request.query.table, request.query.rowId, request.body);
    results
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
}

const delete_by_id = (request, response) => {
    const db = dbService.getDbServiceInstance();

    const info = {
      table: request.body.table,
      id: request.params.id
    };
  
    const results = db.deleteRowById(info);
    results
    .then(data => response.json({success: data}))
    .catch(err => console.log(err));
}

const delete_middle = (request, response) => {
    const db = dbService.getDbServiceInstance();

    const results = db.deleteMiddleById(request.query);
    results
    .then(data => response.json({success: data}))
    .catch(err => console.log(err));
}

module.exports = {
    retrieve,
    get_table,
    get_filtered,
    get_user,
    get_record_clauses,
    get_record_files,
    get_record_approvers,
    get_record_owners,
    insert_document_draft,
    insert,
    insert_user,
    update_document,
    delete_by_id,
    delete_middle
};