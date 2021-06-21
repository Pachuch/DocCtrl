const express = require('express');
const checkAuth = require('../middleware/middleware');
const controllers = require('../controllers/main_controller');
const router = express.Router();

router.get('/', controllers.index);
router.get('/home', controllers.index);

router.get('/account', controllers.account);
router.get('/administration', controllers.administration);
router.get('/docview', controllers.docview);
router.get('/editing', controllers.editing);
router.get('/login', controllers.login);
router.get('/register', controllers.register);
router.get('/report_view', controllers.report_view);

// router.post('/signup', controllers.userRegister);
// router.post('/login', controllers.userLogin);
// router.get('/me', checkAuth, controllers.getMe);

module.exports = router;