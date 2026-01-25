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

materialTargetService.getMaterialTargets = async (filters, page, pageSize) => {
    const { data, total } = await materialTargetRepository.findAll(filters, page, pageSize)
    return { data, total }
}

materialTargetService.getMaterialTargetIds = async (filters) => {
    return await materialTargetRepository.findAllIds(filters)
}

materialTargetService.updateMaterialTarget = async (id, payload) => {
    const event = eventConstant.materialTarget.update
    const { grades, month, year } = payload

    const materialTarget = await materialTargetRepository.findById(id)
    if (!materialTarget) throwError(event.message.failed.notFound, 404)

    // Validation if updating specific fields
    if (grades && (!Array.isArray(grades) || grades.length === 0)) {
        throwError(event.message.failed.invalidData, 400)
    }
    if (month && (month < 1 || month > 12)) {
        throwError(event.message.failed.invalidData, 400)
    }
    if (year && year < 2000) {
        throwError(event.message.failed.invalidData, 400)
    }

    await materialTargetRepository.update(id, payload)
    return { id }
}

materialTargetService.deleteMaterialTarget = async (id) => {
    const event = eventConstant.materialTarget.delete
    const materialTarget = await materialTargetRepository.findById(id)
    if (!materialTarget) throwError(event.message.failed.notFound, 404)

    await materialTargetRepository.delete(id)
    return { id }
}

module.exports = materialTargetService
