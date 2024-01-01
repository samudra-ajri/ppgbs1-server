module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "usersCompletions" ADD CONSTRAINT "uniqueUserIdMaterialId" UNIQUE("userId", "materialId");
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "usersCompletions" DROP CONSTRAINT "uniqueUserIdMaterialId";
    `)
  }
}
