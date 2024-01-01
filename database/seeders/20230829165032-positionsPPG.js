const positionTypes = require('../../constants/positionTypesConstant')

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = Date.now()
    const data = []

    for (let key in positionTypes) {
      if ([positionTypes.ADMIN, positionTypes.PENGURUS].includes(key)) {
        data.push({
          name: `${positionTypes[key]} PPG BANDUNG SELATAN`,
          type: key,
          organizationId: 1,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        })
      }
    }

    await queryInterface.bulkInsert('positions', data)
  },
}
