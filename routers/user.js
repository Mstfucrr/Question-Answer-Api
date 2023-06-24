const express = require('express')
const router = express.Router();
const { getSingleUser, getAllUsers } = require('../controllers/user')
const { chechUserExist } = require('../middlewares/database/databaseErrorHelpers')
const { userQueryMiddleware } = require('../middlewares/query/userQueryMiddleware');
const User = require('../models/User');
// tüm user'ları getir


router.get('/', userQueryMiddleware(User), getAllUsers) //tüm user'ları getir
router.get('/:id', chechUserExist, getSingleUser) //id'ye göre user var mı yok mu kontrol et, varsa getSingleUser'a git ve user'ı getir


module.exports = router