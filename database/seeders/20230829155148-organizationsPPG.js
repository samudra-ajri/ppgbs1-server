const organizationLevelsConstant = require('../../constants/organizationLevelsConstant');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = Date.now()
    const data = [{
      id: 1,
      name: 'PPG BANDUNG SELATAN',
      level: organizationLevelsConstant.ppg,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }]

    const hierarchyData = [{
      ancestorId: 1,
      descendantId: 1,
      depth: 0,
      updatedAt: now
    }]
  
    await queryInterface.bulkInsert('organizations', data)
    await queryInterface.bulkInsert('organizationHierarchies', hierarchyData)
  }
}
