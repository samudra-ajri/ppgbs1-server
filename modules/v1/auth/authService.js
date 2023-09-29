const randomstring = require('randomstring')
const authUtils = require('../../../utils/authUtils')
const authRepository = require('./authRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')

const authService = {}

authService.getUser = async ({ login, password, positionId }) => {
    const event = eventConstant.auth.login
    const foundUsers = await authRepository.findUser(login)
    const user = foundUsers[0]

    if (!user || !await authUtils.verifyPassword(password, user.password)) {
        throwError(event.message.failed.incorrectPhoneOrPassword, 401)
    }

    if (!user.isActive) {
        throwError(event.message.failed.invalidAccount, 401)
    }

    if (user.deletedAt) {
        throwError(event.message.failed.removedAccount, 401)
    }

    const userPosition = await authRepository.findUserPoisition(user.id, positionId)
    if (!userPosition) {
        throwError(event.message.failed.undefinedPosition, 401)
    }

    const positionHierarchy = await authRepository.findPoisitionHierarchy(userPosition.orgId)
    userPosition.hierarchy = positionHierarchy

    await authRepository.updateLastLogin(user.id)

    return {
        login,
        token: authUtils.getToken({
            id: Number(user.id),
            login,
            name: user.name,
            position: userPosition,
        }),
    }
}

authService.getUserProfile = async ({ userId, positionId }) => {
    const user = await authRepository.findUserWithPosition(userId)
    const currentPositionId = Number(positionId)
    const currentPosition = user.positions.filter(position => position.positionId === currentPositionId)
    user.currentPosition = currentPosition
    return user
}

authService.createUser = async ({ name, username, email, phone, sex, isMuballigh, birthdate, password, password2, positionIds }) => {
    const event = eventConstant.auth.register

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

    // create user
    const data = {
        name,
        phone,
        username,
        email,
        sex,
        isMuballigh,
        birthdate,
        password: await authUtils.generatePassword(password),
        positionIds,
        positions: foundPositions,
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

authService.resetPasswordUser = async ({ token, tempPassword, updatedBy }) => {
    const data = {
        token,
        password: await authUtils.generatePassword(tempPassword),
        updatedBy,
    }
    await authRepository.resetUserPassword(data)
}

authService.updatePassword = async ({ userId, newPassword, confirmNewPassword }) => {
    if (newPassword !== confirmNewPassword) {
        throwError(eventConstant.auth.updatePassword.message.failed.mismatch, 400)
    }

    const data = {
        userId,
        password: await authUtils.generatePassword(newPassword),
    }

    await authRepository.updateUserPassword(data)
}

module.exports = authService
