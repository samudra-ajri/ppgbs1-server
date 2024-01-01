module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "usersCompletions" ADD CONSTRAINT "userIdFkey" FOREIGN KEY ("userId") REFERENCES "users" ("id");  
      ALTER TABLE "usersCompletions" ADD CONSTRAINT "materialIdFkey" FOREIGN KEY ("materialId") REFERENCES "materials" ("id");
  `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "usersCompletions" DROP CONSTRAINT "userIdFkey";
      ALTER TABLE "usersCompletions" DROP CONSTRAINT "materialIdFkey";
    `)
  }
}
