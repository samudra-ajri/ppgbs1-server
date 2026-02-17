const router = require('express').Router()
const materialTargetController = require('../modules/v1/materialTarget/materialTargetController')
const { admin, protect } = require('../middlewares/authMiddleware')

router.post('/', protect, admin, materialTargetController.create)
router.get('/', protect, materialTargetController.list)
router.get('/group', protect, materialTargetController.group)
router.get('/ids', protect, materialTargetController.listIds)
router.get('/summary/:structure', protect, materialTargetController.summary)
router.put('/:id', protect, admin, materialTargetController.update)
router.delete('/:id', protect, admin, materialTargetController.delete)

module.exports = router
