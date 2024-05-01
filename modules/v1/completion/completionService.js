const ExcelJS = require('exceljs')
const completionRepository = require('./completionRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const positionTypesConstant = require('../../../constants/positionTypesConstant')

const completionService = {}

completionService.getCompletions = async (filters, page, pageSize) => {
    const { data, total } = await completionRepository.findAll(filters, page, pageSize)
    return { data, total }
}

completionService.createCompletions = async (session, materialIds) => {
    const event = eventConstant.completion.create
    const foundMaterials = await completionRepository.findMaterials(materialIds)
    if (!materialIds.length || foundMaterials.length < materialIds.length) {
        throwError(event.message.failed.undefinedMaterial, 404)
    }

    try {
        await completionRepository.insert(session.id, materialIds)
        await completionRepository.updateLastCompletionStudent(session.id)
    } catch (error) {
        throwError(error.message, 500)
    }
}

completionService.deleteCompletions = async (session, materialIds) => {
    const event = eventConstant.completion.delete
    const userId = session.id
    const foundMaterials = await completionRepository.findMaterials(materialIds)
    if (!materialIds.length || foundMaterials.length < materialIds.length) {
        throwError(event.message.failed.undefinedMaterial, 404)
    }
    await completionRepository.delete(userId, materialIds)
}

// sum completion for single user
completionService.sumCompletion = async (structure, userId, filters) => {
    validateStructure(structure)
    const materialsMultiplier = 1
    const completionsCount = await getCompletionCount(structure, userId, filters)
    const materialsCount = await getMaterialCount(structure, filters)
    return calculateSumCompletion(completionsCount, materialsCount, structure, materialsMultiplier)
}

// sum completion for group users
completionService.sumCompletions = async (structure, filters) => {
    validateStructure(structure)
    const materialsMultiplier = await getUsersCount(positionTypesConstant.GENERUS, filters)
    const completionsCount = await completionRepository.countUsersCompletions(structure, filters)
    const materialsCount = await getMaterialCount(structure, filters)
    return calculateSumCompletions(completionsCount, materialsCount, structure, materialsMultiplier)
}

const getCompletionCount = async (structure, userId, filters) => {
    if (structure === 'material') {
        const event = eventConstant.completion.sum
        if (!filters?.subcategory) throwError(`${event.message.failed.subcategoryNotFound}`, 404)
        return completionRepository.countUserCompletionsWithId(userId, filters)
    } else {
        return completionRepository.countUserCompletions(structure, userId, filters)
    }
}

const getMaterialCount = async (structure, filters) => {
    if (structure === 'material') {
        const event = eventConstant.completion.sum
        if (!filters?.subcategory) throwError(`${event.message.failed.subcategoryNotFound}`, 404)
        return completionRepository.countUserCompletionsMaterialsWithId(filters)
    } else {
        return completionRepository.countUserCompletionsMaterials(structure, filters)
    }
}

const validateStructure = (structure) => {
    const event = eventConstant.completion.sum
    const listedStructures = ['grade', 'subject', 'category', 'subcategory', 'material',]
    const isListedStructure = listedStructures.includes(structure)
    if (!isListedStructure) throwError(`${event.message.failed.structureNotFound} (structure=${structure})`, 404)
}

const getUsersCount = async (positionTypes, filters) => {
    const { organizationId, usersGrade, ancestorId } = filters
    const { usersCount } = await completionRepository.countUsers(positionTypes, organizationId, usersGrade, ancestorId)
    return Number(usersCount)
}

const calculateSumCompletion = (completionsCount, materialsCount, structure, materialsMultiplier) => {
    const findCompletionIndex = structure === 'material' ? 'id' : structure
    return materialsCount.map(material => {
        const completion = completionsCount.find(c => c[findCompletionIndex] === material[findCompletionIndex])
        const completionCount = completion ? parseInt(completion.count, 10) : 0
        const materialCount = parseInt(material.count, 10)
        const percentage = materialsMultiplier
            ? (+(completionCount / (materialCount * materialsMultiplier) * 100).toFixed(2))
            : 0

        const sumData = { completionCount, materialCount, materialsMultiplier, percentage }
        sumData[structure] = material[structure]
        sumData.materialId = material.id
        sumData.grade = material.grade
        sumData.createdAt = completion?.createdAt
        return sumData
    })
}

const calculateSumCompletions = (completionsCount, materialsCount, structure, materialsMultiplier) => {
    return materialsCount.map(material => {
        const completion = completionsCount.find(c => c[structure] === material[structure])
        const completionCount = completion ? parseInt(completion.count, 10) : 0
        const materialCount = parseInt(material.count, 10)
        const percentage = materialsMultiplier
            ? (+(completionCount / (materialCount * materialsMultiplier) * 100).toFixed(2))
            : 0

        const sumData = { completionCount, materialCount, materialsMultiplier, percentage }
        sumData[structure] = material[structure]
        sumData.materialId = material.id
        sumData.grade = material.grade
        return sumData
    })
}

completionService.getUser = async (userId) => {
    const event = eventConstant.completion.getUser
    const user = await completionRepository.findUser(userId)
    if (!user) throwError(event.message.failed.notFound, 404)
    return user
}

completionService.exportDataAsExcel = async (res, filters) => {
    const event = eventConstant.completion.download

    try {
        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: res,
        })
        const worksheet = workbook.addWorksheet('capaian materi')
        worksheet.columns = [
            { header: 'Tercapai Pada', key: 'createdAt', width: 20 },
            { header: 'Materi/Halaman', key: 'material', width: 30 },
            { header: 'Kelas', key: 'grade', width: 5 },
            { header: 'Subjek', key: 'subject', width: 30 },
            { header: 'Kategori', key: 'category', width: 30 },
            { header: 'Subkategori', key: 'subcategory', width: 30 },
        ]

        const dataStream = await completionRepository.queryStream(filters)
        for await (const row of dataStream) {
            row.createdAt = row.createdAt ? row.createdAt.toLocaleString('id-ID', excelDateTimeOptions) : 'belum'
            worksheet.addRow(row).commit()
        }

        await workbook.commit()
    } catch (error) {
        throwError(event.message.failed.errorGenerating, 500)
    }
}

const excelDateTimeOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
}

module.exports = completionService
