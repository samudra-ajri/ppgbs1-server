const randomstring = require('randomstring')
const authUtils = require('../../../utils/authUtils')
const authRepository = require('./authRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const { isValidDate } = require('../../../utils/stringUtils')
const gradeConstant = require('../../../constants/gradeConstant')

const authService = {}

authService.getUser = async ({ login, password, positionId }) => {
    const event = eventConstant.auth.login
    const foundUsers = await authRepository.findUser(login)
    const user = foundUsers[0]

    if (!user || !await authUtils.verifyPassword(password, user.password)) {
        throwError(event.message.failed.incorrectPhoneOrPassword, 401)
    }

    if (user.resetPasswordToken && !user.needUpdatePassword) await authRepository.restoreResetPasswordToken(user.id)

    if (!user.isActive) await authRepository.restoreUser(user.id)

    const userPosition = await authRepository.findUserPoisition(user.id, positionId)
    if (!userPosition) throwError(event.message.failed.undefinedPosition, 401)
    await authRepository.restoreUserPosition(user.id)

    const positionHierarchy = await authRepository.findPoisitionHierarchy(userPosition.orgId)
    userPosition.hierarchy = positionHierarchy

    const userAccess = await authRepository.findUserAccess(user.id)

    await authRepository.updateLastLogin(user.id)

    return {
        login,
        token: authUtils.getToken({
            id: Number(user.id),
            login,
            name: user.name,
            position: userPosition,
            access: userAccess,
        }),
    }
}

authService.switchUserPosition = async ({ login, positionId }) => {
    const event = eventConstant.auth.switchPosition
    const foundUsers = await authRepository.findUser(login)
    const user = foundUsers[0]

    const userPosition = await authRepository.findUserPoisition(user.id, positionId)
    if (!userPosition) throwError(event.message.failed.undefinedPosition, 401)

    const positionHierarchy = await authRepository.findPoisitionHierarchy(userPosition.orgId)
    userPosition.hierarchy = positionHierarchy

    const userAccess = await authRepository.findUserAccess(user.id)

    return {
        login,
        token: authUtils.getToken({
            id: Number(user.id),
            login,
            name: user.name,
            position: userPosition,
            access: userAccess,
        }),
    }
}

authService.getUserProfile = async ({ userId, positionId }) => {
    const user = await authRepository.findUserWithPosition(userId)
    const currentPositionId = Number(positionId)
    const currentPosition = user.positions.filter(position => position.positionId === currentPositionId)
    const currentAncestorOrganization = await authRepository.findCurrentAncestorOrganization(currentPosition[0].organizationId)
    user.currentPosition = { ...currentPosition[0], ...currentAncestorOrganization }
    return user
}

authService.createUser = async ({
    name,
    username,
    email,
    phone,
    sex,
    isMuballigh,
    birthdate,
    password,
    password2,
    positionIds,
    createdBy,
    grade,
    education,
    greatHadiths,
    pondok,
    kertosonoYear,
    firstDutyYear,
    timesDuties,
    maritalStatus,
    muballighStatus,
    children,
    assignmentStartDate,
    assignmentFinishDate,
    scopes,
    job,
    hasBpjs
}) => {
    const event = eventConstant.auth.register

    // validate phone number
    if (phone && !isPhoneNumber(phone)) throwError(event.message.failed.invalidPhoneNumber, 400)
    // validate email
    if (email && !isEmailAddress(email)) throwError(event.message.failed.invalidEmail, 400)
    // validate username
    if (username && !isUsername(username)) throwError(event.message.failed.invalidUsername, 400)

    // validate birthdate format
    if (birthdate && !isValidDate(birthdate)) throwError(event.message.failed.invalidBirthdate, 400)
    // password confirmation
    if (password !== password2) throwError(event.message.failed.incorrectPasswordCombination, 400)
    // check exist users
    const register = { username, email, phone }
    const existUsers = await authRepository.findRegisteredUser(register)
    if (existUsers.length) throwError(event.message.failed.registeredCredentials, 400)
    // check positions availability
    const foundPositions = await authRepository.findPositions(positionIds)
    if (!positionIds.length || foundPositions.length < positionIds.length) {
        throwError(event.message.failed.undefinedPosition, 400)
    }
    if (grade > gradeConstant.PN4) throwError(event.message.failed.invalidGrade, 400)

    // create user
    const data = {
        name,
        phone: phone || '',
        username: username || '',
        email: email || '',
        sex,
        isMuballigh: isMuballigh || false,
        birthdate,
        password: await authUtils.generatePassword(password),
        positionIds,
        positions: foundPositions,
        createdBy: createdBy || null,
        updatedBy: createdBy || null,
        grade: grade ?? null,
        education: education || null,
        pondok: pondok || null,
        greatHadiths: greatHadiths || null,
        kertosonoYear: kertosonoYear || null,
        firstDutyYear: firstDutyYear || null,
        timesDuties: timesDuties || null,
        maritalStatus: maritalStatus || null,
        muballighStatus: muballighStatus || null,
        children: children || null,
        assignmentStartDate: assignmentStartDate || null,
        assignmentFinishDate: assignmentFinishDate || null,
        scopes: scopes || null,
        job: job || null,
        hasBpjs: hasBpjs || false
    }
    await authRepository.createUser(data)
}

authService.forgotPassword = async ({ login }) => {
    const event = eventConstant.auth.forgotPassword
    const foundUsers = await authRepository.findUser(login)
    const user = foundUsers[0]

    if (!user) throwError(event.message.failed.notFound, 404)

    const random = randomstring.generate({ length: 10, charset: 'alphabetic' })
    const data = {
        userId: user.id,
        resetPasswordToken: `${user.id}${random}`
    }
    await authRepository.updateResetPasswordToken(data)
}

authService.tempPasswordUser = async ({ token, tempPassword, updatedBy }) => {
    const data = {
        token,
        password: await authUtils.generatePassword(tempPassword),
        updatedBy,
    }
    await authRepository.tempUserPassword(data)
}

authService.resetPassword = async ({ token, tempPassword, newPassword, confirmNewPassword }) => {
    const event = eventConstant.auth.resetPassword
    const foundUsers = await authRepository.findUserByResetToken(token)
    const user = foundUsers[0]

    if (!user || !await authUtils.verifyPassword(tempPassword, user.password)) {
        throwError(event.message.failed.invalid, 401)
    }

    if (newPassword !== confirmNewPassword) {
        throwError(event.message.failed.mismatch, 400)
    }

    const data = {
        userId: user.id,
        password: await authUtils.generatePassword(newPassword),
    }

    await authRepository.updateUserPassword(data)
}

authService.updatePassword = async ({ userId, currentPassword, newPassword, confirmNewPassword }) => {
    const event = eventConstant.auth.updatePassword
    const foundUsers = await authRepository.findUserById(userId)
    const user = foundUsers[0]

    if (!user || !await authUtils.verifyPassword(currentPassword, user.password)) {
        throwError(event.message.failed.invalidCurrentPassword, 401)
    }

    if (newPassword !== confirmNewPassword) {
        throwError(event.message.failed.mismatch, 400)
    }

    const data = {
        userId: user.id,
        password: await authUtils.generatePassword(newPassword),
    }

    await authRepository.updateUserPassword(data)
}

authService.hashString = async (string) => {
    return authUtils.generatePassword(string)
}

const isPhoneNumber = (input) => {
    // Regular expression to match phone numbers in the format 082129379891
    const phoneRegex = /^0\d{10,14}$/ // Starts with '0' followed by 10 to 14 digits
    return phoneRegex.test(input)
}

const isEmailAddress = (input) => {
    // Regular expression to match email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(input)
}

const isUsername = (input) => {
    // Regular expression to match usernames (alphanumeric and underscores, 3-255 characters)
    const usernameRegex = /^[a-zA-Z0-9_]{3,255}$/
    return usernameRegex.test(input)
}

module.exports = authService
