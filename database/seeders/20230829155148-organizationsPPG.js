const organizationLevelsConstant = require('../../constants/organizationLevelsConstant');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = Date.now()
    const data = [{
      id: 1,
      name: 'PPG BANDUNG SELATAN',
      level: organizationLevelsConstant.ppg,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }]

    const hierarchyData = [{
      ancestor_id: 1,
      descendant_id: 1,
      depth: 0,
      updated_at: now
    }]
  
    await queryInterface.bulkInsert('organizations', data)
    await queryInterface.bulkInsert('organization_hierarchies', hierarchyData)
  }
}
