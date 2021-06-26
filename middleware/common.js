const uuid = require('uuid').v4;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
  
    filename: (req, file, cb) => {
      const {originalname} = file;
      cb(null, `${uuid()}-${originalname}`);
    }
});
  
const upload_mw = multer({ storage });

const redirectHome = (request, response, next) => {
  if (request.session.userData) {
    response.redirect('/');
  } else { next(); }
}

const redirectLogin = (request, response, next) => {
  if(!request.session.userData) {
    response.redirect('/login');
  } else { next(); }
};

module.exports = {
    upload_mw,
    redirectHome,
    redirectLogin
};