module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "presences" ADD CONSTRAINT "uniqueUserIdEventId" UNIQUE("userId", "eventId");
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "presences" DROP CONSTRAINT "uniqueUserIdEventId";
    `)
  }
}
