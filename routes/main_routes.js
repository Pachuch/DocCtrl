const express = require('express');
const main_controller = require('../controllers/main_controller');
const auth_controller = require('../controllers/auth_controller');
const router = express.Router();

// const checkAuth = require('../middleware/middleware');

router.get('/', main_controller.index);
router.get('/home', main_controller.index);

router.get('/account', main_controller.account);
router.get('/administration', main_controller.administration);
router.get('/docview', main_controller.docview);
router.get('/editing', main_controller.editing);
router.get('/report_view', main_controller.report_view);

router.get('/login', auth_controller.logging);
router.post('/login', auth_controller.login);
router.post('/signup', auth_controller.signup);
// router.get('/me', auth_controller, controllers.getMe);

module.exports = router;