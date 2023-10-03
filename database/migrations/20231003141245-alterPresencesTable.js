module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "presences" ADD CONSTRAINT "userIdFkey" FOREIGN KEY ("userId") REFERENCES "users" ("id");
      ALTER TABLE "presences" ADD CONSTRAINT "eventIdFkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id");
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "presences" DROP CONSTRAINT "userIdFkey";
      ALTER TABLE "presences" DROP CONSTRAINT "positionIdFkey";
    `)
  }
}
