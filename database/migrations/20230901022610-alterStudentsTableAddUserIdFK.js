module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "students" ADD CONSTRAINT "userIdFkey" FOREIGN KEY ("userId") REFERENCES "users" ("id");  
  `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "students" DROP CONSTRAINT "userIdFkey";
    `)
  }
}
