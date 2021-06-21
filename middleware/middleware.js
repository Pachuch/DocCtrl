const uuid = require('uuid').v4;
const multer = require('multer');

const auth_middle = (request, response, next) => {
    const { userId } = request.session;
    if (userId) {
        response.locals.user = users.find(user => user.id === userId);
    }
    next();
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
  
const upload_mw = multer({ storage });

module.exports = {
    auth_middle,
    upload_mw
};