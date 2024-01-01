module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "usersPositions" (
        "userId"      bigint,
        "positionId"  bigint,
        "isMain"      boolean,
        "createdAt"   bigint,
        "deletedAt"   bigint
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "usersPositions";
    `)
  }
}
