const express = require('express')
const router = express.Router()
const { blockUser, deleteUser } = require('../controllers/admin.js')
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth.js')
const { chechUserExist } = require('../middlewares/database/databaseErrorHelpers.js')

// block , unblock and delete user
router.use([getAccessToRoute, getAdminAccess]) // getaccesstoroute ve getadminaccess ile admin olmayan kullanıcılar bu route'a erişemez
 // checkuserexist middleware ile user'ın olup olmadığını kontrol ederiz
router.put('/block/:id',chechUserExist, blockUser)
router.delete('/delete/:id',chechUserExist, deleteUser)

// for test 
router.get('/' 
    , (req, res, next) => {
        res.status(200).json({
            success: true,
            message: "Bu sayfaya giriş izniniz yok",
            status : 200
        })
    })


module.exports = router;