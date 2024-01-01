module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "admins" ADD CONSTRAINT "userIdFkey" FOREIGN KEY ("userId") REFERENCES "users" ("id");  
  `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "admins" DROP CONSTRAINT "userIdFkey";
    `)
  }
}
