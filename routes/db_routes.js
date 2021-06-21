const express = require('express');
const db_controller = require('../controllers/db_controller');
const router = express.Router();

router.get('/retrieve', db_controller.retrieve);
router.get('/getTable/:id', db_controller.get_table);
router.get('/getFiltered', db_controller.get_filtered);
router.get('/getUser', db_controller.get_user);
router.get('/getRecordClauses', db_controller.get_record_clauses);
router.get('/getRecordFiles', db_controller.get_record_files);
router.get('/getRecordOwners', db_controller.get_record_owners);
router.get('/insertDocumentDraft', db_controller.insert_document_draft);

router.post('/insert', db_controller.insert);
router.post('/insertUser', db_controller.insert_user);
router.post('/updateDocument', db_controller.update_document);

router.delete('/delete/:id', db_controller.delete_by_id);
router.post('/deleteMiddle', db_controller.delete_middle);

module.exports = router;