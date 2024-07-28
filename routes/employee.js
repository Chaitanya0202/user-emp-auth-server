const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addEmployee, editEmployee, deleteEmployee, getEmployee, getEmployees, upload } = require('../controllers/employeeController');

router.post('/add', auth, upload, addEmployee);
router.put('/edit/:id', auth, upload, editEmployee);
router.delete('/delete/:id', auth, deleteEmployee);
router.get('/:id', auth, getEmployee);
router.get('/', auth, getEmployees);

module.exports = router;
