const express = require('express');
const router = express.Router();
const ThoughtsController = require('../controllers/ThoughtController')

const authCheck = require('../helpers/auth').authCheck;


router.get('/', ThoughtsController.showAllThoughts)
router.get('/dashboard',ThoughtsController.dashboard)
router.get('/add', ThoughtsController.createThoughts)
router.post('/add', ThoughtsController.createThoughtsSave)
router.post('/remove', ThoughtsController.removeThoughts)
router.get('/update/:id', ThoughtsController.updateThoughts)
router.post('/update', ThoughtsController.updateThoughtsSave)

module.exports = router