module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "directories" ADD COLUMN IF NOT EXISTS "type" varchar default 'PUBLIC';  
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "directories" DROP COLUMN IF EXISTS "type";
    `)
  }
}
