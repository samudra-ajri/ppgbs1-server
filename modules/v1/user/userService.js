const userRepository = require('./userRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')

const userService = {}

userService.getUsers = async (filters, search, page, pageSize) => {
    const { data, total } = await userRepository.findAll(filters, search, page, pageSize)
    return { data, total }
}

userService.getUser = async (id) => {
    const user = await userRepository.findById(id)
    return user
}

module.exports = userService
