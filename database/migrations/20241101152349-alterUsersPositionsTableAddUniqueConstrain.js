module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "usersPositions" ADD CONSTRAINT "uniqueUserIdPositionId" UNIQUE("userId", "positionId");
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "usersPositions" DROP CONSTRAINT "uniqueUserIdPositionId";
    `)
  }
}
