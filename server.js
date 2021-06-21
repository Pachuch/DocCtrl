const express = require("express");
const session = require("express-session");
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(session({
  name: "sid",
  resave: false,
  saveUninitialized: false,
  secret: "topsecret_key",
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true,
    secure: false
  } 
}));

const mainRouter = require('./routes/main_routes');
const dbRouter = require('./routes/db_routes');
app.use(mainRouter);
app.use(dbRouter);

app.listen(process.env.PORT, (req, res) => {
  console.log("Server running...");
});
