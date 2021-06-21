const express = require("express");
const session = require("express-session");
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
 
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
app.use(express.static(__dirname + "/public"));

const mainRouter = require('./routes/main_routes');
const dbRouter = require('./routes/db_routes');
app.use(mainRouter);
app.use(dbRouter);

const redirectHome = (request, response, next) => {
  if (!request.session.userId) {
    response.redirect('/');
  } else { next(); }
}

const redirectLogin = (request, response, next) => {
  if(!request.session.userId) {
    response.redirect('/login');
  } else { next(); }
};

// const storage = multer.diskStorage({

//   destination: (req, file, cb) => {
//     cb(null, 'uploads');
//   },

//   filename: (req, file, cb) => {
//     const {originalname} = file;
//     cb(null, `${uuid()}-${originalname}`);
//   }
// });

// const upload = multer({ storage });

// app.post('/upload', upload.single('document_order'), (request, response) => {
//   return response.json({ file: response.req.file });
// });

// app.delete('/deleteRecordFile', (request, response) => {
//   const path = request.query.fileName;

//   try {
//     fs.unlinkSync(path)
//   } catch(err) {
//     console.error(err)
//   }

//   return response.json( { status: "OK"} );
// });

app.listen(process.env.PORT, (req, res) => {
  console.log("Server running...");
});