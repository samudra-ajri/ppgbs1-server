module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "lastCompletionUpdate" int8;  
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "students" DROP COLUMN IF EXISTS "lastCompletionUpdate";
    `)
  }
}
