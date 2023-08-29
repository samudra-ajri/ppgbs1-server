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
          organization_id: 1,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        })
      }
    }
    console.log(data);
    // await queryInterface.bulkInsert('positions', data)
  },
}
