const userRepository = require('./userRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const authUtils = require('../../../utils/authUtils')
const { isValidDate } = require('../../../utils/stringUtils')
const gradeConstant = require('../../../constants/gradeConstant')
const ageUtils = require('../../../utils/ageUtils')

const userService = {}

userService.getUsers = async (filters, search, page, pageSize) => {
    const { data, total } = await userRepository.findAll(filters, search, page, pageSize)
    return { data, total }
}

userService.getUser = async (id) => {
    const event = eventConstant.user.detail
    const user = await userRepository.findById(id)
    if (!user) throwError(event.message.failed.notFound, 404)
    return user
}

userService.updateMyProfile = async (data) => {
    const event = eventConstant.user.updateProfile
    const { userData, payload } = data

    // validate birthdate format
    if (payload.birthdate && !isValidDate(payload.birthdate)) throwError(event.message.failed.invalidBirthdate, 400)
    // password confirmation
    const { password, password2, currentPositionId, newPositionId } = payload
    if (password !== password2) throwError(event.message.failed.incorrectPasswordCombination, 400)
    // check positions availability
    const positionIds = [...new Set([currentPositionId, newPositionId])]
    const foundPositions = await userRepository.findPositions(positionIds)
    if (!currentPositionId || !newPositionId || foundPositions.length < positionIds.length) {
        throwError(event.message.failed.undefinedPosition, 400)
    }
    if (foundPositions[0].type !== foundPositions[1].type) {
        throwError(event.message.failed.differentPositionType, 400)
    }

    let updatedPassword
    if (payload.password) {
        updatedPassword = await authUtils.generatePassword(payload.password)
    } else {
        const { password } = await userRepository.findUserPassword(userData.id)
        updatedPassword = password
    }

    const updatedDdata = {
        id: userData.id,
        name: payload.name || userData.name,
        sex: payload.sex?.toString() || userData.sex,
        isMuballigh: payload.isMuballigh?.toString() || userData.isMuballigh,
        birthdate: payload.birthdate || userData.birthdate,
        password: updatedPassword,
        currentPositionId,
        newPositionId,
    }

    await userRepository.updateUser(updatedDdata)
}

userService.updateMyStudentProfile = async (data) => {
    const event = eventConstant.user.updateProfileStudent
    const { userData, payload } = data

    // validate grade
    if (payload.grade > gradeConstant.PN4) throwError(event.message.failed.invalidGrade, 400)
    // find student profile
    const existStudent = await userRepository.findUserStudent(userData.id)
    if (!existStudent.length) throwError(event.message.failed.notFound, 400)

    const updatedDdata = {
        userId: userData.id,
        grade: payload.grade?.toString() || userData.grade?.toString() || ageUtils.getGrade(userData.birthdate),
    }

    await userRepository.updateUserStudent(updatedDdata)
}

userService.updateMyTeacherProfile = async (data) => {
    const event = eventConstant.user.updateProfileTeacher
    const { userData, payload } = data

    // find student profile
    const existTeacher = await userRepository.findUserTeacher(userData.id)
    if (!existTeacher.length) throwError(event.message.failed.notFound, 400)

    const updatedDdata = {
        userId: userData.id,
        isMarried: payload.isMarried?.toString() || userData.isMarried,
        pondok: payload.pondok || userData.pondok,
        kertosonoYear: payload.kertosonoYear || userData.kertosonoYear,
        firstDutyYear: payload.firstDutyYear || userData.firstDutyYear,
        timesDuties: payload.timesDuties?.toString() || userData.timesDuties || '0',
        greatHadiths: payload.greatHadiths?.join(', ')  || userData.greatHadiths,
        education: payload.education || userData.education,
    }
    
    await userRepository.updateUserTeacher(updatedDdata)
}

module.exports = userService
