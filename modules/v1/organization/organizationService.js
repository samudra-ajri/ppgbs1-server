const organizationRepository = require('./organizationRepository')

const organizationService = {}

organizationService.getOrganizations = async (filters, page, pageSize) => {
    const { data, total } = await organizationRepository.findAll(filters, page, pageSize)
    return { data, total }
}

module.exports = organizationService
