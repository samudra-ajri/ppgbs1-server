const materialTargetRepository = require('./materialTargetRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')

const materialTargetService = {}

materialTargetService.create = async (payload) => {
    const { materialIds, grades, month, year } = payload
    const event = eventConstant.materialTarget.create

    // Basic validation
    if (!materialIds || !Array.isArray(materialIds) || materialIds.length === 0) {
        throwError(event.message.failed.invalidMaterialIds, 400)
    }
    if (!grades || !Array.isArray(grades) || grades.length === 0) {
        throwError(event.message.failed.invalidGrades, 400)
    }
    if (!month || month < 1 || month > 12) {
        throwError(event.message.failed.invalidMonth, 400)
    }
    if (!year || year < 2000) {
        throwError(event.message.failed.invalidYear, 400)
    }

    // Prepare records for bulk insert
    const records = []
    for (const materialId of materialIds) {
        records.push({
            materialId,
            grades,
            month,
            year
        })
    }

    await materialTargetRepository.bulkCreate(records)

    return { count: records.length }
}

module.exports = materialTargetService
