module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "usersPositions" ADD CONSTRAINT "userIdFkey" FOREIGN KEY ("userId") REFERENCES "users" ("id");
      ALTER TABLE "usersPositions" ADD CONSTRAINT "positionIdFkey" FOREIGN KEY ("positionId") REFERENCES "positions" ("id");
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "usersPositions" DROP CONSTRAINT "userIdFkey";
      ALTER TABLE "usersPositions" DROP CONSTRAINT "positionIdFkey";
    `)
  }
}
