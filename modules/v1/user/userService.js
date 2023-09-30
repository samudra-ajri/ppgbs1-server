const userRepository = require('./userRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const authUtils = require('../../../utils/authUtils')
const { isValidDate } = require('../../../utils/stringUtils')

const userService = {}

userService.getUsers = async (filters, search, page, pageSize) => {
    const { data, total } = await userRepository.findAll(filters, search, page, pageSize)
    return { data, total }
}

userService.getUser = async (id) => {
    const user = await userRepository.findById(id)
    return user
}

userService.updateMyProfile = async (data) => {
    const event = eventConstant.user.updateProfile
    const { userData, payload } = data

    // validate birthdate format
    if (payload.birthdate && !isValidDate(payload.birthdate)) throwError(event.message.failed.invalidBirthdate, 400)
    // password confirmation
    const { password, password2 } = payload
    if (password !== password2) throwError(event.message.failed.incorrectPasswordCombination, 400)

    let updatedPassword
    if (payload.password) {
        updatedPassword = await authUtils.generatePassword(payload.password)
    } else {
        const { password } = await userRepository.findUserPassword(userData.id)
        updatedPassword = password
    }

    console.log(payload);
    const updatedDdata = {
        id: userData.id,
        name: payload.name || userData.name,
        sex: String(payload.sex) || userData.sex,
        isMuballigh: String(payload.isMuballigh) || userData.isMuballigh,
        birthdate: payload.birthdate || userData.birthdate,
        password: updatedPassword,
    }

    await userRepository.updateUser(updatedDdata)
}

module.exports = userService
