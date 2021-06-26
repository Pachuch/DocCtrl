const express = require("express");
const session = require("express-session");
// const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// const corsOptions = {
//   origin: '',  //Your Client, do not write '*'
//   credentials: true,
// };

// app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: "sid",
  resave: false,
  saveUninitialized: false,
  secret: "topsecret_key",
  // httpOnly: true,
  // domain: "localhost:3001",
  // path: "/home",
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true,
    secure: false
  },
  rolling: true
}));
app.use(express.static(__dirname + "/public"));

const mainRouter = require('./routes/main_routes');
const dbRouter = require('./routes/db_routes');
app.use(mainRouter);
app.use(dbRouter);

app.listen(process.env.PORT, (req, res) => {
  console.log("Server running...");
});
