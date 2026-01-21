const router = require('express').Router()
const materialTargetController = require('../modules/v1/materialTarget/materialTargetController')
const { admin, protect } = require('../middlewares/authMiddleware')

router.post('/', protect, admin, materialTargetController.create)

module.exports = router
