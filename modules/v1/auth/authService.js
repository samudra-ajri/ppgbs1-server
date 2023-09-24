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

module.exports = authService
