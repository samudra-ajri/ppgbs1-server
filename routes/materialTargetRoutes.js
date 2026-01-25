const router = require('express').Router()
const materialTargetController = require('../modules/v1/materialTarget/materialTargetController')
const { admin, protect } = require('../middlewares/authMiddleware')

router.post('/', protect, admin, materialTargetController.create)
router.get('/', protect, materialTargetController.list)
router.put('/:id', protect, admin, materialTargetController.update)
router.delete('/:id', protect, admin, materialTargetController.delete)

module.exports = router
