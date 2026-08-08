const userPositionRepository = require('./userPositionRepository')
const eventConstant = require('../../../constants/eventConstant')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const ageUtils = require('../../../utils/ageUtils')
const { throwError } = require('../../../utils/errorUtils')

const userPositionService = {}

userPositionService.delete = async (userId, positionId, deletedBy) => {
    const deletedUserPosition = await userPositionRepository.findDeletedUserPosition(userId, positionId)
    if (deletedUserPosition) {
        await userPositionRepository.undoDelete(userId, positionId)
    } else {
        await userPositionRepository.delete(userId, positionId, deletedBy)
    }
}

userPositionService.hardDelete = async (userId, positionId, deletedBy) => {
    await userPositionRepository.hardDelete(userId, positionId, deletedBy)
}

userPositionService.change = async (userId, positionId, newPositionId) => {
    const event = eventConstant.userPosition.changeUserPosition
    const userPosition = await userPositionRepository.findUserPosition(userId, positionId)
    if (!userPosition) throwError(event.message.failed.notFound, 404)
    
    const foundPosition = await userPositionRepository.findPosition(newPositionId)
    if (!foundPosition) throwError(event.message.failed.notFoundPosition, 404)
    if (foundPosition.type !== userPosition.type) throwError(event.message.failed.mismatch, 404)
    
    await userPositionRepository.changeUserPosition(userId, positionId, newPositionId)
}

userPositionService.create = async (userId, newPositionId) => {
    const event = eventConstant.userPosition.createUserPosition
    const userPosition = await userPositionRepository.findUserPosition(userId, newPositionId)
    if (userPosition) throwError(event.message.failed.alreadyExists, 403)
    
    const foundPosition = await userPositionRepository.findPosition(newPositionId)
    if (!foundPosition) throwError(event.message.failed.notFoundPosition, 404)

    const data = {
        userId, 
        newPositionId, 
        type: foundPosition.type,
    }
    await userPositionRepository.createUserPosition(data)
}

userPositionService.createByAdmin = async (userId, organizationId, type, requesterPositionType) => {
    const event = eventConstant.userPosition.createUserPositionByAdmin

    assertTypeAllowed(event, type, requesterPositionType)

    const foundUser = await userPositionRepository.findUser(userId)
    if (!foundUser) throwError(event.message.failed.notFound, 404)

    const foundPosition = await userPositionRepository.findPositionByOrganization(organizationId, type)
    if (!foundPosition) throwError(event.message.failed.notFoundPosition, 404)

    const data = {
        userId,
        newPositionId: foundPosition.id,
        type: foundPosition.type,
    }

    const userPosition = await userPositionRepository.findUserPosition(userId, foundPosition.id)
    if (userPosition) throwError(event.message.failed.alreadyExists, 403)

    const deletedUserPosition = await userPositionRepository.findDeletedUserPosition(userId, foundPosition.id)
    if (deletedUserPosition) {
        await userPositionRepository.restoreUserPosition(data)
    } else {
        await userPositionRepository.createUserPosition(data)
    }

    return {
        userId,
        positionId: foundPosition.id,
        positionName: foundPosition.name,
        type: foundPosition.type,
        organizationId: foundPosition.organizationId,
        organizationName: foundPosition.organizationName,
    }
}

userPositionService.deleteByAdmin = async (userId, organizationId, type, requesterPositionType) => {
    const event = eventConstant.userPosition.deleteUserPositionByAdmin

    assertTypeAllowed(event, type, requesterPositionType)

    const foundUser = await userPositionRepository.findUser(userId)
    if (!foundUser) throwError(event.message.failed.notFound, 404)

    const foundPosition = await userPositionRepository.findPositionByOrganization(organizationId, type)
    if (!foundPosition) throwError(event.message.failed.notFoundPosition, 404)

    const userPosition = await userPositionRepository.findUserPosition(userId, foundPosition.id)
    if (!userPosition) throwError(event.message.failed.notAssigned, 404)

    const activePositions = await userPositionRepository.countActiveUserPositions(userId)
    if (activePositions <= 1) throwError(event.message.failed.lastPosition, 403)

    // Removed for good, not soft deleted: a soft deleted position still shows up in the
    // user list as "pindah sementara", which is the toggle's meaning, not this one's.
    await userPositionRepository.hardDelete(userId, foundPosition.id)

    return {
        userId,
        positionId: foundPosition.id,
        type: foundPosition.type,
        organizationId: foundPosition.organizationId,
    }
}

// The teacher declares themselves a generus as well. The class is derived from
// their age, and the position is taken from the kelompok they teach at.
userPositionService.createMyGenerus = async (userId) => {
    const event = eventConstant.userPosition.createMyGenerusPosition

    const user = await userPositionRepository.findUser(userId)
    if (!user) throwError(event.message.failed.notFound, 404)
    if (!user.birthdate) throwError(event.message.failed.noBirthdate, 400)

    const teacherPosition = await userPositionRepository.findActiveUserPositionByType(userId, positionTypesConstant.PENGAJAR)
    if (!teacherPosition) throwError(event.message.failed.notTeacher, 403)

    const generusPosition = await userPositionRepository.findPositionByOrganization(teacherPosition.organizationId, positionTypesConstant.GENERUS)
    if (!generusPosition) throwError(event.message.failed.notFoundPosition, 404)

    const userPosition = await userPositionRepository.findUserPosition(userId, generusPosition.id)
    if (userPosition) throwError(event.message.failed.alreadyExists, 403)

    const grade = ageUtils.getGrade(user.birthdate)
    const data = { userId, newPositionId: generusPosition.id, grade }

    const deletedUserPosition = await userPositionRepository.findDeletedUserPosition(userId, generusPosition.id)
    if (deletedUserPosition) {
        await userPositionRepository.restoreGenerusPosition(data)
    } else {
        await userPositionRepository.createGenerusPosition(data)
    }

    return {
        userId,
        positionId: generusPosition.id,
        positionName: generusPosition.name,
        type: generusPosition.type,
        organizationId: generusPosition.organizationId,
        organizationName: generusPosition.organizationName,
        grade,
    }
}

const assertTypeAllowed = (event, type, requesterPositionType) => {
    if (!positionTypesConstant[type]) throwError(event.message.failed.invalidType, 400)
    const isAdminRequester = requesterPositionType === positionTypesConstant.ADMIN
    if (type === 'ADMIN' && !isAdminRequester) throwError(event.message.failed.forbiddenType, 403)
}

module.exports = userPositionService
