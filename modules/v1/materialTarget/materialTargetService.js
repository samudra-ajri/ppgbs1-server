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

materialTargetService.getGroupedMaterialTargets = async (filters) => {
    return await materialTargetRepository.group(filters)
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

materialTargetService.deleteMaterialTargets = async (payload) => {
    const event = eventConstant.materialTarget.delete
    const { materialIds, grades, month, year } = payload
    const filters = {}

    if (materialIds && Array.isArray(materialIds) && materialIds.length > 0) {
        filters.materialIds = materialIds
    }
    if (grades && Array.isArray(grades) && grades.length > 0) {
        filters.grades = grades
    }
    if (month && !isNaN(month)) {
        filters.month = month
    }
    if (year && !isNaN(year)) {
        filters.year = year
    }

    if (Object.keys(filters).length === 0) {
        throwError(event.message.failed.invalidData, 400)
    }

    await materialTargetRepository.delete(filters)
    return filters
}

materialTargetService.getSummary = async (structure, filters) => {
    validateStructure(structure)
    if (structure === 'material' && !filters?.subcategory) {
        throwError(eventConstant.materialTarget.summary.message.failed.subcategoryNotFound, 404)
    }
    const targetedCount = await materialTargetRepository.countTargeted(structure, filters)
    const materialCount = await materialTargetRepository.countMaterials(structure, filters)
    return calculateSummary(targetedCount, materialCount, structure)
}

const validateStructure = (structure) => {
    const event = eventConstant.materialTarget.summary
    const listedStructures = ['grade', 'subject', 'category', 'subcategory', 'material']
    const isListedStructure = listedStructures.includes(structure)
    if (!isListedStructure) throwError(`${event.message.failed.structureNotFound} (structure=${structure})`, 404)
}

const calculateSummary = (targetedCounts, materialCounts, structure) => {
    const findIndex = structure === 'material' ? 'id' : structure
    return materialCounts.map(material => {
        const targeted = targetedCounts.find(t => t[findIndex] === material[findIndex])
        const targetedCount = targeted ? parseInt(targeted.count, 10) : 0
        const materialCount = parseInt(material.count, 10)

        const sumData = { targetedCount, materialCount }
        sumData[structure] = material[structure]

        if (structure === 'material') {
            sumData.materialId = material.id
            sumData.grade = material.grade
        }

        return sumData
    })
}

module.exports = materialTargetService
