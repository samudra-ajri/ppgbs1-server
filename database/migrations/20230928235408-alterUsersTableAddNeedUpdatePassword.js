module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "needUpdatePassword" boolean NOT NULL DEFAULT false;  
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "needUpdatePassword";
    `)
  }
}
