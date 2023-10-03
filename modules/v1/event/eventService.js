const randomstring = require('randomstring')
const authUtils = require('../../../utils/authUtils')
const eventRepository = require('./eventRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const { isValidDate } = require('../../../utils/stringUtils')

const eventService = {}

module.exports = eventService
