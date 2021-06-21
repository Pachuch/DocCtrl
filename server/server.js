const express = require("express");
const session = require("express-session");
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const uuid = require('uuid').v4;
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
dotenv.config();
const dbService = require('./dbService');
const { request } = require("express");
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(session({
  name: "sid",
  resave: false,
  saveUninitialized: false,
  secret: "topsecret_key",
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true,
    secure: true
  }
}));
app.use(express.static('public'));

const redirectLogin = (request, response, next) => {
  if(!request.session.userId) {
    response.redirect('/login');
  } else {
    next();
  }
};

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },

  filename: (req, file, cb) => {
    const {originalname} = file;
    cb(null, `${uuid()}-${originalname}`);
  }
});

const upload = multer({ storage });

// routes

// log in
app.get('/login', (request, response) => {
  // console.log(request.session);
  request.session.userId = 0;

  response.json({
    data: request.session.userId ? true : false
  });
});

// sign in
app.get('/register', (request, response) => {

});

// log out
app.post('/logout', (request, response) => {

});

// create
app.post('/insertUser', (request, response) => {
  const db = dbService.getDbServiceInstance();
  
  request.body.Access = 'user';
  request.body.RegistrationDate = new Date();
  request.body.Deleted = false;
  
  const results = db.insert('User', request.body);
  
  results
  .then(data => response.json({ data: data }))
  .catch(err => console.log(err));
});

app.post('/insert', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const { table, ...body} = request.query;
  const results = db.insert(table, body);
  
  results
  .then(data => response.json({ data: data }))
  .catch(err => console.log(err));
});

app.get('/insertDocumentDraft', (request, response) => {
  const db = dbService.getDbServiceInstance();

  request.body.Validation = 0;
  request.body.ChangeDate = new Date();
  request.body.Status = "draft";
  const results = db.insert('Record', request.body);

  results
  .then(data => response.json({ data: data }))
  .catch(err => console.log(err));
});

app.post('/updateDocument', (request, response) => {
   const db = dbService.getDbServiceInstance();

   const results = db.update(request.query.table, request.query.rowId, request.body);
   results
   .then(data => response.json({data: data}))
   .catch(err => console.log(err));
});

app.post('/upload', upload.single('document_order'), (request, response) => {
  return response.json({ file: response.req.file });
});

// read
app.get('/getTable/:id', (request, response) => {
  const db = dbService.getDbServiceInstance();
  const results = db.getTableData(request.params.id);
  results
  .then(data => response.json({ data: data }))
  .catch(err => console.log(err));
});

app.get('/getFiltered', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const { table, ...body} = request.query;
  const results = db.getFilteredRecords(table, body);

  results
  .then(data => response.json({ data: data }))
  .catch(err => console.log(err));
});

app.get('/getUser', (request, response) => {
  const db = dbService.getDbServiceInstance();
 
  const results = db.getUser(request.query.username);

  results
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
});

app.get('/retrieve', (request, response) => {
  const db = dbService.getDbServiceInstance();
 
  const results = db.retrieve(request.query.table, request.query.rowId);

  results
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
});

app.get('/getRecordClauses', (request, response) => {
  const db = dbService.getDbServiceInstance();
 
  const results = db.getRecordClauses(request.query.RecordId);

  results
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
});

app.get('/getRecordFiles', (request, response) => {
  const db = dbService.getDbServiceInstance();
 
  const results = db.getRecordFiles(request.query.RecordId);

  results
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
});

app.get('/getRecordOwners', (request, response) => {
  const db = dbService.getDbServiceInstance();
 
  const results = db.getRecordOwners(request.query.RecordId);

  results
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const info = {
    table: request.body.table,
    id: request.params.id
  };

  const results = db.deleteRowById(info);
  results
  .then(data => response.json({success: data}))
  .catch(err => console.log(err));
});

app.delete('/deleteMiddle', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const results = db.deleteMiddleById(request.query);
  results
  .then(data => response.json({success: data}))
  .catch(err => console.log(err));
});

app.delete('/deleteRecordFile', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const path = request.query.fileName;

  try {
    fs.unlinkSync(path)
  } catch(err) {
    console.error(err)
  }

  return response.json( { status: "OK"} );
});

app.listen(process.env.PORT, (req, res) => {
  console.log("Server running...");
});