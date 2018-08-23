const express = require('express');
const router = express.Router();

//Require the Controller

const user_controller = require('../controllers/user.controller');

//CRUD
router.get('/', user_controller.index);//R

router.get('/sort/:type/:orderby', user_controller.index);//R
router.get('/search', user_controller.index);//R

router.get('/add', user_controller.add_form);//R
router.post('/add', user_controller.user_add);//C

router.get('/edit/:id', user_controller.edit_form);//R
router.put('/edit/:id', user_controller.user_update);//U
router.delete('/delete/:id', user_controller.user_delete);//D

module.exports = router;
