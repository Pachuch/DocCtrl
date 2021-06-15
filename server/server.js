const express = require("express");
const session = require("express-session");
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const uuid = require('uuid').v4;

const app = express();
dotenv.config();
const dbService = require('./dbService');
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
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
  console.log(request.session);
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
  
  const result = db.insert('Users', request.body);
  
  result.then(data => response.json({ data: data }))
  .catch(err => console.log(err));
});

// TODO undone
app.post('/updateDocument', (request, resonse) => {
   const db = dbService.getDbServiceInstance();

   console.log('Bang');
   console.dir(request);

   const result = db.insert('Records', request.body);
   result
   .then(data => response.json({data: data}))
   .catch(err => console.log(err));
});

app.post('/upload', upload.single('document'), (request, response) => {
  return response.json({status: "OK "});
});

// read
app.get('/getUsersTable', (request, response) => {
  const db = dbService.getDbServiceInstance();
  const results = db.getTableData('Users');
  results.then(data => response.json({data: data})).catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const info = {
    table: request.body.table,
    keyName: request.body.keyName,
    id: request.params.id
  };

  const results = db.deleteRowById(info);
  results
  .then(data => response.json({success: data}))
  .catch(err => console.log(err));
});

app.listen(process.env.PORT, (req, res) => {
  console.log("Server running...");
});